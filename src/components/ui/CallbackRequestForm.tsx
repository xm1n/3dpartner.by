'use client'

import { useState, useEffect } from 'react'
import { Loader2, X } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

type Props = {
  onSuccess?: () => void
  onCancel?: () => void
  title?: string
}

export function CallbackRequestForm({ onSuccess, onCancel, title = 'Заказать звонок' }: Props) {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
    preferredTime: '',
  })

  useEffect(() => {
    if (user) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
      setForm((f) => ({
        ...f,
        name: name || f.name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError('Укажите имя')
      return
    }
    if (!form.phone.trim()) {
      setError('Укажите телефон')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/callback-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          comment: form.comment.trim() || undefined,
          preferredTime: form.preferredTime.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.errors?.[0]?.message || data.message || 'Ошибка отправки')
      }
      setSuccess(true)
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {success && (
        <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
          Заявка отправлена. Мы перезвоним в ближайшее время.
        </div>
      )}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}
      {success ? null : (
      <div className="space-y-3">
        <div>
          <label htmlFor="cb-name" className="block text-xs font-semibold text-slate-600 mb-1">Имя *</label>
          <input
            id="cb-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Как к вам обращаться"
            required
          />
        </div>
        <div>
          <label htmlFor="cb-phone" className="block text-xs font-semibold text-slate-600 mb-1">Телефон *</label>
          <input
            id="cb-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="+375 (29) 000-00-00"
            required
          />
        </div>
        <div>
          <label htmlFor="cb-email" className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
          <input
            id="cb-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label htmlFor="cb-preferredTime" className="block text-xs font-semibold text-slate-600 mb-1">Удобное время для звонка</label>
          <input
            id="cb-preferredTime"
            type="text"
            value={form.preferredTime}
            onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Например: после 15:00"
          />
        </div>
        <div>
          <label htmlFor="cb-comment" className="block text-xs font-semibold text-slate-600 mb-1">Вопрос или комментарий</label>
          <textarea
            id="cb-comment"
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
            placeholder="О чём хотите поговорить?"
          />
        </div>
      </div>
      )}
      {!success && (
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Отправить заявку
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Отмена
          </button>
        )}
      </div>
      )}
    </form>
  )
}
