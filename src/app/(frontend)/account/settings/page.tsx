'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type UserData = {
  firstName: string
  lastName?: string
  phone?: string
  deliveryAddress?: {
    city?: string
    street?: string
    postalCode?: string
  }
}

export default function AccountSettingsPage() {
  const auth = useAuth()
  const router = useRouter()
  const [form, setForm] = useState<UserData>({
    firstName: '',
    lastName: '',
    phone: '',
    deliveryAddress: { city: '', street: '', postalCode: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace('/login')
      return
    }
    if (!auth.user) return

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${auth.user!.id}?depth=0`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const doc = data.user ?? data.doc ?? data
        setForm({
          firstName: doc.firstName ?? '',
          lastName: doc.lastName ?? '',
          phone: doc.phone ?? '',
          deliveryAddress: {
            city: doc.deliveryAddress?.city ?? '',
            street: doc.deliveryAddress?.street ?? '',
            postalCode: doc.deliveryAddress?.postalCode ?? '',
          },
        })
      } catch {
        setForm({
          firstName: auth.user!.firstName ?? '',
          lastName: auth.user!.lastName ?? '',
          phone: auth.user!.phone ?? '',
          deliveryAddress: { city: '', street: '', postalCode: '' },
        })
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [auth.loading, auth.user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!auth.user) return
    setMessage(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${auth.user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName || undefined,
          phone: form.phone || undefined,
          deliveryAddress: {
            city: form.deliveryAddress?.city || undefined,
            street: form.deliveryAddress?.street || undefined,
            postalCode: form.deliveryAddress?.postalCode || undefined,
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || err.errors?.[0]?.message || 'Ошибка сохранения')
      }
      await auth.refreshUser()
      setMessage({ type: 'success', text: 'Профиль успешно обновлён' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Ошибка сохранения',
      })
    } finally {
      setSaving(false)
    }
  }

  if (auth.loading || !auth.user) {
    return null
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px] flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </main>
    )
  }

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
          <li className="text-slate-900 font-semibold">Настройки профиля</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-black text-slate-900 mb-8">Настройки профиля</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 bg-white border border-slate-200 rounded-xl p-6"
      >
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
            Имя
          </label>
          <input
            id="firstName"
            type="text"
            value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
            Фамилия
          </label>
          <input
            id="lastName"
            type="text"
            value={form.lastName ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Телефон
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
            Город
          </label>
          <input
            id="city"
            type="text"
            value={form.deliveryAddress?.city ?? ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                deliveryAddress: { ...p.deliveryAddress, city: e.target.value },
              }))
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-slate-700 mb-1">
            Улица, дом, кв.
          </label>
          <input
            id="street"
            type="text"
            value={form.deliveryAddress?.street ?? ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                deliveryAddress: { ...p.deliveryAddress, street: e.target.value },
              }))
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
            Почтовый индекс
          </label>
          <input
            id="postalCode"
            type="text"
            value={form.deliveryAddress?.postalCode ?? ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                deliveryAddress: { ...p.deliveryAddress, postalCode: e.target.value },
              }))
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </main>
  )
}
