'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User } from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await apiClient.getUser();
          setUser(userData);
        }
      } catch (error) {
        // Token might be invalid, remove it
        localStorage.removeItem('auth_token');
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const { user: userData } = await apiClient.register(name, email, password, passwordConfirmation);
      setUser(userData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData } = await apiClient.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if logout fails on server, clear local state
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}