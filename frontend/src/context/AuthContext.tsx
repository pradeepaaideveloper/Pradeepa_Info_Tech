import React, { createContext, useContext, useState, useEffect } from 'react';
import { authEndpoints } from '../services/endpoints';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'cashier' | 'student' | 'customer';
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCashier: boolean;
  isStudent: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (token: string, userData: User) => {
    localStorage.setItem('pradeepa_access_token', token);
    localStorage.setItem('pradeepa_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('pradeepa_access_token');
    localStorage.removeItem('pradeepa_user');
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      localStorage.setItem('pradeepa_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const checkSession = async () => {
    const token = localStorage.getItem('pradeepa_access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authEndpoints.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Session validation failed:', error);
      // If token expired, clear localStorage session
      localStorage.removeItem('pradeepa_access_token');
      localStorage.removeItem('pradeepa_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt local load first for zero-flicker UI
    const cachedUser = localStorage.getItem('pradeepa_user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    checkSession();
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isCashier = user?.role === 'cashier' || user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isCashier,
        isStudent,
        login,
        logout,
        updateUser,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
