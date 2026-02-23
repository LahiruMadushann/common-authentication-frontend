import { LOCAL_STORAGE_KEYS } from '../constants/localStorageKeys.constant';
import axios, { AxiosInstance } from 'axios';

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
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_ENDPOINT}/auth/refresh`, {
            refresh_token: refreshToken
          });

          if (response.status === 200) {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access_token);
            if (refresh_token) {
              localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
            }

            // Re-run the original request with the new token
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear everything and redirect
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error?.response);
  }
);

export default axiosClient;
