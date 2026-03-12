'use client'

import { Heart } from 'lucide-react'
import { useFavorites, type FavoriteItem } from '@/providers/FavoritesProvider'

type Props = {
  product: FavoriteItem
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({ product, className, size = 'sm' }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(product.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product)
  }

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-14 h-14',
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} bg-white/90 backdrop-blur rounded flex items-center justify-center border border-slate-100 shadow-sm transition ${
        active ? 'text-red-500 border-red-200 bg-red-50' : 'text-slate-400 hover:text-red-500'
      } ${className || ''}`}
      title={active ? 'Убрать из избранного' : 'В избранное'}
    >
      <Heart className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${active ? 'fill-current' : ''}`} />
    </button>
  )
}
