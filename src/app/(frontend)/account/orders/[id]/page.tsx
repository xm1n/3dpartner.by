'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { formatPrice } from '@/lib/formatPrice'
import { Package, Truck, CreditCard, MapPin, Phone, Mail, User, ArrowLeft, Clock } from 'lucide-react'

type OrderItem = {
  id: string
  product: any
  variantName?: string
  quantity: number
  unitPrice: number
}

type Order = {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  updatedAt: string
  customer?: any
  contactInfo?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  items: OrderItem[]
  subtotal: number
  deliveryCost: number
  total: number
  delivery?: {
    method?: string
    address?: string
    trackingNumber?: string
  }
  payment?: {
    method?: string
    paid?: boolean
  }
  customerNote?: string
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

const STATUS_STEPS = ['new', 'confirmed', 'paid', 'packing', 'shipping', 'delivered', 'completed']

const DELIVERY_LABELS: Record<string, string> = {
  pickup: 'Самовывоз',
  courier: 'Курьер',
  europochta: 'Европочта',
  belpochta: 'Белпочта',
}

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Карта онлайн',
  erip: 'ЕРИП',
  invoice: 'Безналичный расчёт',
  cash: 'Наличные',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-BY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const auth = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace('/login')
      return
    }
    if (!auth.user) return

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}?depth=2`, { credentials: 'include' })
        if (!res.ok) {
          if (res.status === 404 || res.status === 403) {
            setError('Заказ не найден')
          } else {
            throw new Error('Ошибка загрузки')
          }
          return
        }
        const data = await res.json()
        setOrder(data)
      } catch {
        setError('Не удалось загрузить заказ')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [auth.loading, auth.user, router, id])

  if (auth.loading || !auth.user) return null

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px] flex justify-center">
        <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px] text-center">
        <p className="text-slate-600 mb-4">{error || 'Заказ не найден'}</p>
        <Link href="/account/orders" className="text-blue-600 hover:text-blue-800 font-medium transition">
          Вернуться к заказам
        </Link>
      </main>
    )
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const contact = order.contactInfo

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-6 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li><Link href="/account" className="hover:text-slate-900 transition">Личный кабинет</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li><Link href="/account/orders" className="hover:text-slate-900 transition">Мои заказы</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold">{order.orderNumber}</li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Заказ {order.orderNumber}
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-800'}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-slate-900 transition-all duration-500"
              style={{ width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%` }}
            />
            {STATUS_STEPS.map((step, i) => {
              const isActive = i <= currentStepIdx
              const isCurrent = i === currentStepIdx
              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-slate-900 text-white ring-4 ring-slate-200'
                      : isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isActive ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium mt-2 hidden sm:block ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm font-medium">
          Заказ отменён
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-400" />
                Товары ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, i) => {
                const product = typeof item.product === 'object' ? item.product : null
                const title = product?.title ?? `Товар #${i + 1}`
                const slug = product?.slug
                const firstImage = product?.images?.[0]?.image
                const imageUrl = typeof firstImage === 'object' ? firstImage?.url : undefined
                const lineTotal = item.quantity * item.unitPrice

                return (
                  <div key={item.id || i} className="p-5 flex gap-4">
                    {imageUrl ? (
                      <img src={imageUrl} alt={title} className="w-16 h-16 object-contain bg-slate-50 rounded-lg border border-slate-100 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-sm font-black shrink-0">3D</div>
                    )}
                    <div className="flex-1 min-w-0">
                      {slug ? (
                        <Link href={`/product/${slug}`} className="font-bold text-slate-900 hover:text-blue-700 transition text-sm">
                          {title}
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-900 text-sm">{title}</span>
                      )}
                      {item.variantName && (
                        <div className="text-xs text-slate-500 mt-0.5">Вариант: {item.variantName}</div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">
                        {item.quantity} шт. × {formatPrice(item.unitPrice)} BYN
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900">{formatPrice(lineTotal)} BYN</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {order.customerNote && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Комментарий к заказу</h3>
              <p className="text-sm text-slate-600">{order.customerNote}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Total */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Итого</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Товары</span>
                <span>{formatPrice(order.subtotal ?? 0)} BYN</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Доставка</span>
                <span>{order.deliveryCost ? `${formatPrice(order.deliveryCost)} BYN` : 'Бесплатно'}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between text-lg font-bold text-slate-900">
                <span>Итого</span>
                <span>{formatPrice(order.total ?? 0)} BYN</span>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-400" />
              Доставка
            </h3>
            <div className="text-sm space-y-2">
              <div className="text-slate-700 font-medium">
                {DELIVERY_LABELS[order.delivery?.method ?? ''] ?? order.delivery?.method ?? '—'}
              </div>
              {order.delivery?.address && (
                <div className="text-slate-500 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {order.delivery.address}
                </div>
              )}
              {order.delivery?.trackingNumber && (
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium">
                  Трек-номер: {order.delivery.trackingNumber}
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              Оплата
            </h3>
            <div className="text-sm space-y-2">
              <div className="text-slate-700 font-medium">
                {PAYMENT_LABELS[order.payment?.method ?? ''] ?? order.payment?.method ?? '—'}
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                order.payment?.paid
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${order.payment?.paid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {order.payment?.paid ? 'Оплачено' : 'Ожидает оплаты'}
              </div>
            </div>
          </div>

          {/* Contact info */}
          {contact && (contact.firstName || contact.email || contact.phone) && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Контактные данные
              </h3>
              <div className="text-sm space-y-2">
                {(contact.firstName || contact.lastName) && (
                  <div className="text-slate-700 font-medium">
                    {contact.firstName} {contact.lastName}
                  </div>
                )}
                {contact.email && (
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {contact.email}
                  </div>
                )}
                {contact.phone && (
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {contact.phone}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" /> Вернуться к заказам
        </Link>
      </div>
    </main>
  )
}
