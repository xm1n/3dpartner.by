import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  title: string
  slug: string
  brand?: string
  category?: string
  price: number
  oldPrice?: number
  imageUrl?: string
  inStock?: boolean
  stockQuantity?: number
  badges?: string[]
  colors?: { hex: string }[]
}

const badgeLabels: Record<string, { label: string; className: string }> = {
  bestseller: { label: 'Хит продаж', className: 'bg-blue-600' },
  new: { label: 'Новинка', className: 'bg-slate-800' },
  sale: { label: 'Скидка', className: 'bg-red-500' },
  preorder: { label: 'Под заказ', className: 'bg-slate-500' },
}

export function ProductCard({
  title, slug, brand, category, price, oldPrice, imageUrl, inStock = true, stockQuantity, badges, colors,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col hover-card group relative">
      {badges && badges.length > 0 && (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {badges.map((badge) => {
            const b = badgeLabels[badge]
            return b ? (
              <span key={badge} className={`${b.className} text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase shadow-sm tracking-wider`}>
                {b.label}
              </span>
            ) : null
          })}
        </div>
      )}

      <button className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 backdrop-blur rounded flex items-center justify-center text-slate-400 hover:text-red-500 border border-slate-100 shadow-sm transition">
        <Heart className="w-4 h-4" />
      </button>

      <Link href={`/product/${slug}`} className="relative h-48 bg-white flex items-center justify-center border-b border-slate-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-4xl font-black">3D</div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
          {brand}{category ? ` • ${category}` : ''}
        </div>
        <Link href={`/product/${slug}`} className="font-bold text-slate-900 hover:text-blue-700 transition line-clamp-2 mb-3 text-sm leading-snug">
          {title}
        </Link>

        {colors && colors.length > 0 && (
          <div className="mb-4 flex gap-1.5 flex-wrap">
            {colors.slice(0, 4).map((c, i) => (
              <span key={i} className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: c.hex }} />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] font-semibold text-slate-500 ml-1">+{colors.length - 4}</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-50 flex items-end justify-between">
          <div>
            {inStock ? (
              <div className="text-[10px] text-emerald-600 font-bold mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                В наличии{stockQuantity ? `: ${stockQuantity} шт` : ''}
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 font-bold mb-1">Под заказ</div>
            )}
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-black text-slate-900 leading-none">
                {price.toFixed(2)} <span className="text-[10px] font-bold text-slate-500 uppercase">BYN</span>
              </div>
              {oldPrice && (
                <div className="text-xs text-slate-400 line-through">{oldPrice.toFixed(2)}</div>
              )}
            </div>
          </div>
          <button className="bg-white text-slate-800 hover:bg-slate-50 transition px-4 py-2 rounded text-xs font-bold border border-slate-300 shadow-sm flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            В корзину
          </button>
        </div>
      </div>
    </div>
  )
}
