'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: string;
};

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.errors?.[0]?.message || res.statusText);
  }
  return res.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await fetchApi<{ user: User }>('/api/users/me');
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      await fetchApi<{ user: User }>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      await fetchApi<{ user: User }>('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          role: 'b2c_customer',
        }),
      });
      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    await fetchApi('/api/users/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
