'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, ArrowLeft, FileText, Key, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

type B2BClient = {
  id: number | string
  companyName: string
  inn?: string
  discountColumn?: string
  customDiscountPercent?: number
  apiToken?: string
  contactPerson?: string
  phone?: string
  email?: string
}

const DISCOUNT_LABELS: Record<string, string> = {
  base: 'Базовая (0%)',
  partner_5: 'Партнёр (5%)',
  dealer_10: 'Дилер (10%)',
  distributor_15: 'Дистрибьютор (15%)',
  custom: 'Индивидуальная',
}

export default function B2BPortalPage() {
  const { user, loading: authLoading } = useAuth()
  const [client, setClient] = useState<B2BClient | null>(null)
  const [loading, setLoading] = useState(true)
  const isB2B = user?.role === 'b2b_customer'

  useEffect(() => {
    if (!isB2B || !user) {
      setLoading(false)
      return
    }
    fetch(`/api/b2b-clients?where[user][equals]=${user.id}&limit=1&depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => setClient(data.docs?.[0] ?? null))
      .catch(() => setClient(null))
      .finally(() => setLoading(false))
  }, [isB2B, user?.id])

  if (!authLoading && !isB2B) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px]">
        <Link href="/b2b" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Link>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-slate-700">Доступ только для оптовых партнёров.</p>
          <Link href="/b2b" className="text-blue-600 font-semibold mt-2 inline-block">Подать заявку на подключение</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px] max-w-3xl">
      <Link href="/b2b" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Назад к разделу B2B
      </Link>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : !client ? (
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl">
          <Building2 className="w-12 h-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Данные компании не найдены</h2>
          <p className="text-slate-600 text-sm mb-4">
            Ваш аккаунт ещё не привязан к карточке B2B-клиента. Обратитесь к менеджеру для подключения оптовых условий.
          </p>
          <Link href="/b2b" className="text-blue-600 font-semibold text-sm">Перейти на страницу B2B</Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{client.companyName}</h1>
              {client.inn && <p className="text-sm text-slate-500">УНП {client.inn}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-6 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Условия</h3>
              <p className="text-lg font-bold text-slate-900">
                {client.discountColumn === 'custom' && client.customDiscountPercent != null
                  ? `Скидка ${client.customDiscountPercent}%`
                  : DISCOUNT_LABELS[client.discountColumn || 'base'] || 'Базовая'}
              </p>
            </div>
            {client.apiToken && (
              <div className="p-6 rounded-xl border border-slate-200 bg-white">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4" /> API-токен
                </h3>
                <p className="text-sm font-mono text-slate-600 break-all">
                  {client.apiToken.slice(0, 8)}…{client.apiToken.slice(-4)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Используется для доступа к прайс-листам по API</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 rounded-xl border border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Прайс-листы и выгрузки
            </h3>
            {client.apiToken ? (
              <>
                <p className="text-slate-600 text-sm mb-3">
                  Скачайте прайс или подставьте ссылку в свою систему (1С, МойСклад и др.). Формат и состав выгрузки настраивает менеджер.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['xml', 'csv', 'json'] as const).map((format) => {
                    const url = `/api/b2b/feed?token=${encodeURIComponent(client.apiToken!)}&format=${format}`
                    return (
                      <a
                        key={format}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
                      >
                        {format.toUpperCase()}
                      </a>
                    )
                  })}
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  По вопросам состава выгрузки и ЭДО обращайтесь к менеджеру или через раздел контактов.
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-600 text-sm">
                  Выгрузки в форматах XML, CSV и JSON настраиваются вашим менеджером. После выдачи токена здесь появятся ссылки на фиды.
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  По вопросам выгрузки и ЭДО обращайтесь к менеджеру или через раздел контактов на сайте.
                </p>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition"
            >
              Каталог товаров
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 border border-slate-300 font-semibold px-5 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              Мои заказы
            </Link>
          </div>
        </>
      )}
    </main>
  )
}
