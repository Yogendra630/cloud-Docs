import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; department?: string; title?: string }) => Promise<void>;
  logout: () => void;
  switchAccount: (email: string) => Promise<void>;
  updateProfile: (data: {
    name?: string;
    department?: string;
    title?: string;
    avatar?: string;
    phone?: string;
    location?: string;
    bio?: string;
    preferences?: any;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('clouddocs_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('clouddocs_jwt_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const me = await api.getCurrentUser();
          setUser(me);
          localStorage.setItem('clouddocs_user', JSON.stringify(me));
        } catch {
          // If token expired, fall back to demo user login
          await autoLoginDemo();
        }
      } else {
        // Automatically login as primary user (Yogendra Pratap) on first launch for seamless demo
        await autoLoginDemo();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const autoLoginDemo = async () => {
    try {
      const res = await api.login('yogendra@clouddocs.io', 'Password@123');
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('clouddocs_jwt_token', res.token);
      localStorage.setItem('clouddocs_user', JSON.stringify(res.user));
    } catch (e) {
      console.warn('Auto demo login failed', e);
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('clouddocs_jwt_token', res.token);
    localStorage.setItem('clouddocs_user', JSON.stringify(res.user));
  };

  const register = async (data: { name: string; email: string; password: string; department?: string; title?: string }) => {
    const res = await api.register(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('clouddocs_jwt_token', res.token);
    localStorage.setItem('clouddocs_user', JSON.stringify(res.user));
  };

  const switchAccount = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await api.switchAccount(email);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('clouddocs_jwt_token', res.token);
      localStorage.setItem('clouddocs_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    department?: string;
    title?: string;
    avatar?: string;
    phone?: string;
    location?: string;
    bio?: string;
    preferences?: any;
  }) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
    localStorage.setItem('clouddocs_user', JSON.stringify(updated));
  };

  const refreshUser = async () => {
    try {
      const me = await api.getCurrentUser();
      setUser(me);
      localStorage.setItem('clouddocs_user', JSON.stringify(me));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('clouddocs_jwt_token');
    localStorage.removeItem('clouddocs_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchAccount,
        updateProfile,
        refreshUser,
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
