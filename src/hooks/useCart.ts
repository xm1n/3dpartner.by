'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug: string
  title: string
  price: number
  quantity: number
  variantName?: string
  imageUrl?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, variantName?: string) => void
  updateQuantity: (productId: string, quantity: number, variantName?: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantName === item.variantName,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantName === item.variantName
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem: (productId, variantName) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantName === variantName),
          ),
        }))
      },

      updateQuantity: (productId, quantity, variantName) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantName)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantName === variantName
              ? { ...i, quantity }
              : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: '3dpartner-cart' },
  ),
)
