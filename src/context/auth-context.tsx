import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLazyGetAuthenticateQuery, useLogoutMutation } from '../app/services/auth';

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
    checkSession();
    setInterval(() => {
      checkSession();
    }, 900000)
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
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutApi().unwrap();
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
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
