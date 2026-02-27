import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLazyGetAuthenticateQuery, useLogoutMutation } from '../app/services/auth';
import { startRefreshTimer, extractIncomingToken } from '../config/axiosInstance.config';

// Define the shape of the authentication data
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isAuthenticatedResponse = localStorage.getItem('authenticated');
  const [getAuthenticatedFunc] = useLazyGetAuthenticateQuery();
  const [logoutApi] = useLogoutMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    isAuthenticatedResponse === 'true' ? true : false
  );

  useEffect(() => {
    const init = async () => {
      // Handle incoming cross-site redirect: if refresh_token is in the URL,
      // automatically log in and mark the user authenticated (true SSO - no login needed)
      const loggedInViaSSO = await extractIncomingToken();
      if (loggedInViaSSO) {
        setIsAuthenticated(true);
        return; // session fully established — skip checkSession
      }

      // Normal load: re-arm timer if a token already exists (page refresh case)
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        startRefreshTimer(existingToken);
      }
      checkSession();
    };

    init();
    setInterval(() => {
      checkSession();
    }, 900000);
  }, []);

  const checkSession = () => {
    const newAuthenticatedResponse = localStorage.getItem('authenticated');
    if (newAuthenticatedResponse === 'true') {
      getAuthenticatedFunc(null)
        .unwrap()
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          localStorage.clear();
        });
    } else {
      setIsAuthenticated(false);
      localStorage.clear();
    }
  }

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutApi().unwrap();
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
      sessionStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
