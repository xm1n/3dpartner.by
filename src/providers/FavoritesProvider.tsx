'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'favorite-items';

export type FavoriteItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  imageUrl?: string;
  brand?: string;
};

type FavoritesContextValue = {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  totalItems: number;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFromStorage(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: FavoriteItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveToStorage(items);
  }, [items, mounted]);

  const addItem = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  }, []);

  const totalItems = items.length;

  const value: FavoritesContextValue = {
    items,
    addItem,
    removeItem,
    isFavorite,
    toggleFavorite,
    totalItems,
  };

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
