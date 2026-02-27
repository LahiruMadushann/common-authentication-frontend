import { LOCAL_STORAGE_KEYS } from '../constants/localStorageKeys.constant';
import axios, { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';

// Single-flight refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const handleLogout = () => {
  localStorage.clear();
  sessionStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  window.location.href = '/login';
};

/**
 * SSO CROSS-SITE REDIRECT
 * Call this instead of window.location.href when redirecting to the other site.
 *
 * The refresh token is passed via URL HASH (#rt=...) — NOT as a query param.
 * Hash fragments are never sent to the server, so they never appear in:
 *  - Server access logs
 *  - HTTP Referer headers forwarded to third parties
 *
 * Usage: redirectWithToken('https://other-site.com/dashboard')
 */
export const redirectWithToken = (targetUrl: string) => {
  const refreshToken = sessionStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  if (refreshToken) {
    // Encode the token and embed it in the hash. The hash never leaves the browser.
    const encoded = encodeURIComponent(refreshToken);
    window.location.href = `${targetUrl}#rt=${encoded}`;
  } else {
    window.location.href = targetUrl;
  }
};

/**
 * SSO INCOMING HANDLER
 * Call this on app init (auth-context useEffect).
 *
 * When Site B receives a redirect from Site A with #rt=...:
 *  1. Reads refresh_token from the URL HASH (never logged by any server).
 *  2. Immediately clears the hash from the URL — not visible after a fraction of a second.
 *  3. Calls POST /auth/refresh to get a fresh access token for this session.
 *  4. Stores tokens, starts the proactive timer.
 *  5. Returns true → caller sets isAuthenticated = true (no login form needed).
 *
 * Returns false on normal app load (no #rt in URL).
 */
export const extractIncomingToken = async (): Promise<boolean> => {
  const hash = window.location.hash;
  if (!hash.startsWith('#rt=')) return false;

  // Extract and decode the token from the hash
  const encoded = hash.slice(4); // strip '#rt='
  const incomingRefreshToken = decodeURIComponent(encoded);

  // Clear the hash from the URL immediately — before any async work
  // Use replaceState so it doesn't add a browser history entry
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  if (!incomingRefreshToken) return false;

  // Save the incoming refresh token to sessionStorage
  sessionStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, incomingRefreshToken);

  try {
    // Exchange for a fresh access token right away using the existing /auth/refresh endpoint
    const response = await axios.post(`${process.env.REACT_APP_ENDPOINT}/auth/refresh`, {
      refresh_token: incomingRefreshToken
    });

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem('authenticated', 'true');
      if (refresh_token) {
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      }
      startRefreshTimer(access_token);
      return true;
    }
  } catch (err) {
    console.warn('SSO token exchange failed:', err);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  }

  return false;
};


let refreshTimeout: NodeJS.Timeout | null = null;

// Call this function whenever a new access token is received (e.g., login, page load, refresh)
export const startRefreshTimer = (token: string) => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    // Calculate time until expiry in milliseconds
    // Refresh 1 minute (60000ms) before the token actually expires
    const expiresMs = decodedToken.exp * 1000;
    const timeoutMs = expiresMs - Date.now() - 60000;

    // If it's already expired or close to expiring, we might as well just let the interceptor handle it
    if (timeoutMs > 0) {
      refreshTimeout = setTimeout(() => {
        silentRefresh();
      }, timeoutMs);
    }
  } catch (error) {
    console.warn("Failed to decode token for refresh timer:", error);
  }
};

const silentRefresh = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  const refreshToken = sessionStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

  if (refreshToken) {
    try {
      const response = await axios.post(`${process.env.REACT_APP_ENDPOINT}/auth/refresh`, {
        refresh_token: refreshToken
      });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access_token);
        if (refresh_token) {
          sessionStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        startRefreshTimer(access_token);
        processQueue(null, access_token);
        return access_token;
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleLogout();
    } finally {
      isRefreshing = false;
    }
  } else {
    isRefreshing = false;
    handleLogout();
  }
  return null;
};


const axiosClient: AxiosInstance = axios.create({});

axiosClient.defaults.timeout = 45000;

axiosClient.defaults.withCredentials = false;

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        if (config.headers) config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = sessionStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_ENDPOINT}/auth/refresh`, {
            refresh_token: refreshToken
          });

          if (response.status === 200) {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access_token);
            if (refresh_token) {
              sessionStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
            }

            // Re-run the original request with the new token
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            startRefreshTimer(access_token);
            processQueue(null, access_token);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear everything and redirect
          processQueue(refreshError, null);
          handleLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        handleLogout();
      }
    }

    return Promise.reject(error?.response);
  }
);

export default axiosClient;
