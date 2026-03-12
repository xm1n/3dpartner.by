'use client'

import { ShoppingCart, Check, ArrowRight } from 'lucide-react'
import { useCart, type CartItem } from '@/providers/CartProvider'
import { useState } from 'react'

type Props = {
  product: Omit<CartItem, 'quantity'>
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary'
}

export function AddToCartButton({ product, className, size = 'sm', variant = 'default' }: Props) {
  const cart = useCart()
  const [added, setAdded] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    cart.addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-sm flex-1 h-10',
  }
  const variantClasses =
    variant === 'primary'
      ? 'bg-slate-900 hover:bg-blue-600 text-white rounded-full text-[11px] uppercase tracking-widest border-0 shadow-sm'
      : 'bg-white text-slate-800 hover:bg-slate-50 rounded font-bold border border-slate-300 shadow-sm'

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center justify-center gap-1.5 transition ${sizeClasses[size]} ${variantClasses} ${added ? '!bg-emerald-50 !border-emerald-300 !text-emerald-700' : ''} ${className || ''}`}
    >
      {added ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Добавлено
        </>
      ) : variant === 'primary' ? (
        <>
          В корзину
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </>
      ) : (
        <>
          <ShoppingCart className="w-3.5 h-3.5" />
          В корзину
        </>
      )}
    </button>
  )
}
