'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, LogOut, Settings, ShoppingCart, Shield } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  developer: 'Разработчик',
  b2c_customer: 'Покупатель (B2C)',
  b2b_customer: 'Оптовый клиент (B2B)',
  engineer: 'Инженер',
}

export default function AccountPage() {
  const auth = useAuth()
  const router = useRouter()

  if (auth.loading) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px] flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </main>
    )
  }

  if (!auth.user) {
    router.replace('/login')
    return null
  }

  const firstName = auth.user.firstName || 'Пользователь'
  const roleLabel = ROLE_LABELS[auth.user.role] || auth.user.role

  const isStaff = auth.user.role === 'admin' || auth.user.role === 'manager' || auth.user.role === 'developer'

  const cards = [
    {
      title: 'Мои заказы',
      description: 'История заказов и отслеживание',
      href: '/account/orders',
      icon: Package,
    },
    {
      title: 'Избранное',
      description: 'Сохранённые товары',
      href: '/account/favorites',
      icon: Heart,
    },
    {
      title: 'Настройки профиля',
      description: 'Изменить данные и пароль',
      href: '/account/settings',
      icon: Settings,
    },
    {
      title: 'Корзина',
      description: 'Товары в корзине',
      href: '/cart',
      icon: ShoppingCart,
    },
    ...(isStaff
      ? [
          {
            title: 'Админ-панель',
            description: 'Управление сайтом и контентом',
            href: '/admin',
            icon: Shield,
          },
        ]
      : []),
  ]

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        Здравствуйте, {firstName}!
      </h1>
      <p className="text-slate-600 mb-1">{auth.user.email}</p>
      <p className="text-sm text-slate-500 mb-10">{roleLabel}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group"
          >
            <div className="p-3 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-slate-900">
                {card.title}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={async () => {
          await auth.logout()
          router.push('/')
        }}
        className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
      >
        <LogOut className="w-4 h-4" />
        Выйти из аккаунта
      </button>
    </main>
  )
}
