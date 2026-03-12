'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import Link from 'next/link'

type Props = {
  productId: string
  productPath?: string
  onSubmitted?: () => void
}

export function ReviewForm({ productId, productPath, onSubmitted }: Props) {
  const { user, loading: authLoading } = useAuth()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !text.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const productValue = /^\d+$/.test(String(productId)) ? Number(productId) : productId
      const authorValue = /^\d+$/.test(String(user.id)) ? Number(user.id) : user.id
      const res = await fetch('/api/reviews', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productValue,
          author: authorValue,
          rating: Number(rating),
          text: text.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.errors?.[0]?.message || data.message || 'Не удалось отправить отзыв')
      }
      setText('')
      setRating(5)
      setSuccess(true)
      onSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return <div className="text-sm text-slate-500">Загрузка...</div>
  }

  if (!user) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
        <Link href={`/login?redirect=${encodeURIComponent(productPath || '/')}`} className="text-blue-600 font-semibold hover:text-blue-800">
          Войдите
        </Link>
        , чтобы оставить отзыв о товаре.
      </div>
    )
  }

  if (success) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
        Спасибо! Ваш отзыв отправлен и будет опубликован после проверки модератором.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Оценка</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl leading-none transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
              aria-label={`${star} звезд`}
            >
              <span className={star <= rating ? 'text-yellow-400' : 'text-slate-300'}>★</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="review-text" className="block text-sm font-semibold text-slate-700 mb-2">
          Текст отзыва
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-slate-400"
          placeholder="Расскажите о качестве товара, доставке, удобстве использования..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !text.trim()}
        className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition"
      >
        {submitting ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  )
}
