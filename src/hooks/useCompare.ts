'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareState {
  ids: string[]
  toggle: (productId: string) => void
  isComparing: (productId: string) => boolean
  clear: () => void
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        set((state) => {
          if (state.ids.includes(productId)) {
            return { ids: state.ids.filter((id) => id !== productId) }
          }
          if (state.ids.length >= 4) return state
          return { ids: [...state.ids, productId] }
        })
      },
      isComparing: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
    }),
    { name: '3dpartner-compare' },
  ),
)
