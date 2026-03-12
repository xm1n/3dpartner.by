'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, FileText, Zap, Shield, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

export default function B2BPage() {
  const { user, loading: authLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    inn: '',
    contactPerson: '',
    phone: '',
    email: '',
    comment: '',
  })

  const isB2B = user?.role === 'b2b_customer'

  useEffect(() => {
    if (user) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
      setForm((f) => ({
        ...f,
        contactPerson: name || f.contactPerson,
        email: user.email || f.email,
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.companyName.trim() || !form.contactPerson.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Заполните обязательные поля')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/b2b-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          inn: form.inn.trim() || undefined,
          contactPerson: form.contactPerson.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          comment: form.comment.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.errors?.[0]?.message || data.message || 'Ошибка отправки')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <section className="bg-slate-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Оптовый портал для бизнеса
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl">
            Автоматизированные закупки, персональные прайс-листы и электронный документооборот для юридических лиц.
          </p>
          {!authLoading && isB2B && (
            <Link
              href="/b2b/portal"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              Войти в кабинет партнёра <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            Преимущества для партнёров
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Персональные прайс-листы
              </h3>
              <p className="text-slate-600">
                XML, CSV и JSON фиды с актуальными ценами. Автоматический импорт в ваши системы учёта и закупок.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Электронный документооборот
              </h3>
              <p className="text-slate-600">
                Счета, акты и договоры в электронном виде. Быстро, удобно и без бумажной волокиты.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                API-интеграция
              </h3>
              <p className="text-slate-600">
                REST API с токенами доступа для автоматизированного оформления заказов и синхронизации данных.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-2xl font-bold mb-12">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 font-bold text-blue-400">1</div>
              <h3 className="font-bold text-lg mb-2">Заявка</h3>
              <p className="text-slate-400 text-sm">Оставьте заявку и укажите реквизиты компании</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 font-bold text-blue-400">2</div>
              <h3 className="font-bold text-lg mb-2">Верификация</h3>
              <p className="text-slate-400 text-sm">Подтверждение статуса и объёмов закупок</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 font-bold text-blue-400">3</div>
              <h3 className="font-bold text-lg mb-2">Индивидуальные условия</h3>
              <p className="text-slate-400 text-sm">Персональные скидки и настройка интеграций</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 font-bold text-blue-400">4</div>
              <h3 className="font-bold text-lg mb-2">Автозакупки</h3>
              <p className="text-slate-400 text-sm">Заказы по API и автоматическая синхронизация</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="max-w-2xl mx-auto rounded-2xl bg-slate-900 text-white p-8 md:p-12">
            <Building2 className="w-14 h-14 text-blue-400 mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Стать оптовым партнёром
            </h2>
            <p className="text-slate-300 mb-6">
              Оставьте заявку — мы свяжемся с вами для обсуждения условий и подключения к порталу.
            </p>

            {success ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-100">
                Заявка отправлена. Менеджер свяжется с вами в ближайшее время.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b2b-company" className="block text-xs font-semibold text-slate-400 mb-1">Название компании *</label>
                    <input
                      id="b2b-company"
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="ООО «Компания»"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="b2b-inn" className="block text-xs font-semibold text-slate-400 mb-1">УНП (ИНН)</label>
                    <input
                      id="b2b-inn"
                      type="text"
                      value={form.inn}
                      onChange={(e) => setForm((f) => ({ ...f, inn: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="123456789"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b2b-person" className="block text-xs font-semibold text-slate-400 mb-1">Контактное лицо *</label>
                    <input
                      id="b2b-person"
                      type="text"
                      value={form.contactPerson}
                      onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="b2b-phone" className="block text-xs font-semibold text-slate-400 mb-1">Телефон *</label>
                    <input
                      id="b2b-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="+375 (29) 000-00-00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="b2b-email" className="block text-xs font-semibold text-slate-400 mb-1">Email *</label>
                  <input
                    id="b2b-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="zakup@company.by"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="b2b-comment" className="block text-xs font-semibold text-slate-400 mb-1">Комментарий</label>
                  <textarea
                    id="b2b-comment"
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    placeholder="Объёмы закупок, пожелания по формату выгрузки..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Отправить заявку
                </button>
              </form>
            )}

            {!success && user && (
              <p className="mt-4 text-slate-400 text-sm">
                Вы вошли как {user.email}. После одобрения заявки ваш аккаунт получит доступ к оптовому кабинету.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
