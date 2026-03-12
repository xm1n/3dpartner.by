'use client'

import { useFavorites } from '@/providers/FavoritesProvider'
import { useCart } from '@/providers/CartProvider'
import Link from 'next/link'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/formatPrice'

export default function AccountFavoritesPage() {
  const favorites = useFavorites()
  const cart = useCart()

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-6 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <Link href="/" className="hover:text-slate-900 transition">
              Главная
            </Link>
          </li>
          <li>
            <span className="mx-1 text-slate-300">/</span>
          </li>
          <li>
            <Link href="/account" className="hover:text-slate-900 transition">
              Личный кабинет
            </Link>
          </li>
          <li>
            <span className="mx-1 text-slate-300">/</span>
          </li>
          <li className="text-slate-900 font-semibold">Избранное</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-black text-slate-900 mb-8">Избранное</h1>

      {favorites.items.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Список избранного пуст</p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition"
            >
              <Link href={`/product/${item.slug}`} className="block">
                <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-4xl font-bold">
                  3D
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <h2 className="font-semibold text-slate-900 hover:text-slate-700 line-clamp-2">
                    {item.title}
                  </h2>
                </Link>
                {item.brand && (
                  <p className="text-sm text-slate-500 mt-1">{item.brand}</p>
                )}
                <p className="text-lg font-semibold text-slate-900 mt-2">
                  {formatPrice(item.price)}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      cart.addItem({
                        id: item.id,
                        title: item.title,
                        slug: item.slug,
                        price: item.price,
                        imageUrl: item.imageUrl,
                        brand: item.brand,
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    В корзину
                  </button>
                  <button
                    type="button"
                    onClick={() => favorites.removeItem(item.id)}
                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                    aria-label="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
