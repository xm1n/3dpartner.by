'use client'

import Link from 'next/link'
import { User, Heart, ShoppingCart, BarChart3 } from 'lucide-react'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useAuth } from '@/providers/AuthProvider'

export function HeaderActions() {
  const cart = useCart()
  const favorites = useFavorites()
  const auth = useAuth()

  return (
    <div className="hidden md:flex items-center gap-5 pl-2 border-l border-slate-100">
      <Link href={auth.user ? '/account' : '/login'} className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition group">
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-semibold">
          {auth.user ? auth.user.firstName : 'Войти'}
        </span>
      </Link>
      <Link href="/catalog" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition group relative">
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-semibold">Сравнение</span>
      </Link>
      <Link href="/account/favorites" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition group relative">
        <Heart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-semibold">Избранное</span>
        {favorites.totalItems > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
            {favorites.totalItems}
          </span>
        )}
      </Link>
      <Link href="/cart" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition group relative">
        <ShoppingCart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-semibold">Корзина</span>
        {cart.totalItems > 0 && (
          <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            {cart.totalItems}
          </span>
        )}
      </Link>
    </div>
  )
}
