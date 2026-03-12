'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/formatPrice'

type Order = {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items?: { quantity: number }[]
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  paid: 'Оплачен',
  packing: 'Комплектуется',
  shipping: 'В доставке',
  delivered: 'Доставлен',
  completed: 'Завершён',
  cancelled: 'Отменён',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  paid: 'bg-green-100 text-green-800',
  packing: 'bg-yellow-100 text-yellow-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-slate-100 text-slate-800',
  cancelled: 'bg-red-100 text-red-800',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-BY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function AccountOrdersPage() {
  const auth = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace('/login')
      return
    }
    if (!auth.user) return

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders?depth=1&sort=-createdAt', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setOrders(data.docs ?? [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [auth.loading, auth.user, router])

  if (auth.loading || !auth.user) {
    return null
  }

  const itemsCount = (order: Order) =>
    order.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) ?? 0

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
          <li className="text-slate-900 font-semibold">Мои заказы</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-black text-slate-900 mb-8">Мои заказы</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-600 mb-4">У вас пока нет заказов</p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-sm transition group"
            >
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition">{order.orderNumber}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="text-slate-700 font-medium">
                  {formatPrice(order.total ?? 0)} BYN
                </span>
                <span className="text-sm text-slate-500">
                  {itemsCount(order)} шт.
                </span>
                <span className="text-xs text-slate-400 group-hover:text-slate-600 transition">Подробнее →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
