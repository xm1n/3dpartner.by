'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/providers/CartProvider';
import { formatPrice } from '@/lib/formatPrice';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px]">
        <nav className="flex text-xs text-slate-500 mb-6 font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li className="text-slate-900 font-semibold">Корзина</li>
          </ol>
        </nav>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Корзина пуста</h1>
          <p className="text-slate-500 mb-8">Добавьте товары из каталога</p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold transition text-sm"
          >
            Перейти в каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-6 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold">Корзина</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-black text-slate-900 mb-8">Корзина</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 items-start sm:items-center"
                >
                  <Link href={`/product/${item.slug}`} className="shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-24 object-contain bg-slate-50 rounded-lg border border-slate-100"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xl font-black">
                        3D
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-bold text-slate-900 hover:text-slate-600 transition line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    {item.brand && (
                      <div className="text-xs text-slate-500 mt-0.5">{item.brand}</div>
                    )}
                    {item.variant && (
                      <div className="text-xs text-slate-600 mt-0.5">Вариант: {item.variant}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-lg font-bold text-slate-900">
                      {formatPrice(item.price)} BYN
                    </div>
                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-l-lg transition"
                        aria-label="Уменьшить"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-r-lg transition"
                        aria-label="Увеличить"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-lg font-bold text-slate-900 min-w-[5rem] text-right">
                      {formatPrice(item.price * item.quantity)} BYN
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      aria-label="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearCart}
              className="text-sm text-slate-500 hover:text-red-600 transition font-medium"
            >
              Очистить корзину
            </button>
          </div>
        </div>

        <aside className="lg:w-96 shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sticky top-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Итого</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Товары</span>
                <span>{formatPrice(totalPrice)} BYN</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Доставка</span>
                <span>от 5.00 BYN</span>
              </div>
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between text-lg font-bold text-slate-900">
              <span>Итого</span>
              <span>{formatPrice(totalPrice)} BYN</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-lg font-bold transition text-sm"
            >
              Оформить заказ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
