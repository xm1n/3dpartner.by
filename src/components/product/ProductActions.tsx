'use client'

import { useState } from 'react'
import { AddToCartButton } from '@/components/ui/AddToCartButton'

type Props = {
  product: { id: string; title: string; slug: string; price: number; imageUrl?: string; brand?: string }
}

export function ProductActions({ product }: Props) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex gap-2 mb-5">
      <div className="flex items-center bg-slate-50 rounded-full overflow-hidden w-24 shrink-0 border border-slate-200 h-10">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 font-bold transition text-base focus:outline-none"
          aria-label="Уменьшить"
        >
          −
        </button>
        <span className="w-full h-full flex items-center justify-center text-sm font-black text-slate-900 border-x border-slate-200/50">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 font-bold transition text-base focus:outline-none"
          aria-label="Увеличить"
        >
          +
        </button>
      </div>
      <div className="flex-1">
        <AddToCartButton product={product} size="lg" variant="primary" className="flex-1 w-full" />
      </div>
    </div>
  )
}
