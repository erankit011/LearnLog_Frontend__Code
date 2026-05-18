import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isResetPasswordPage = window.location.pathname.startsWith('/reset-password/');
    const isForgotPasswordPage = window.location.pathname === '/forgot-password';
    const isAuthPage = window.location.pathname === '/login' || 
                       window.location.pathname === '/register' || 
                       window.location.pathname === '/verify-otp' ||
                       isForgotPasswordPage ||
                       isResetPasswordPage;
    
    if (!isAuthPage) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {      
      const response = await api.get('/auth/current-user', {
        _skipAuthToast: true
      });
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await api.post('/auth/refresh-token', {}, {
            _skipAuthToast: true
          });
          const retryResponse = await api.get('/auth/current-user', {
            _skipAuthToast: true
          });
          if (retryResponse.data.success) {
            setUser(retryResponse.data.data.user);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (refreshError) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const setAuthUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.data?.requiresOTP) {
        return { 
          success: false, 
          message: response.data.message,
          requiresOTP: true,
          email: response.data.data.email
        };
      }
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        toast.success('Login successful');
        return { success: true };
      }
    } catch (error) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || 'Login failed';
      const data = error.response?.data?.data;
      
      if (statusCode === 429) {
        return { 
          success: false, 
          message: 'Too many login attempts. Please wait a few minutes before trying again.',
          rateLimited: true
        };
      }
      
      if (data?.requiresVerification || data?.requiresOTP) {
        return { 
          success: false, 
          message,
          requiresOTP: true,
          email: data.email
        };
      }
      
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    checkAuth,
    setAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
