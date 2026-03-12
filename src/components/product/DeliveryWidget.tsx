'use client'

import { useState } from 'react'

const DELIVERY_OPTIONS = [
  { id: 'pickup', label: 'Самовывоз из магазина', info: 'ул. Карла Либкнехта, д.112, оф. 3Н. Сегодня до 18:00', extra: 'Скидка 3% при получении', price: 'Бесплатно', priceClass: 'text-emerald-600 font-bold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded' },
  { id: 'cdek', label: 'Доставка СДЭК (ПВЗ)', info: 'Доступно 42 пункта выдачи. Отправим завтра.', extra: 'Срок в пути: 1-2 дня', price: 'от 5.50 BYN', priceClass: 'text-slate-900 font-bold text-[11px] bg-slate-100 px-1.5 py-0.5 rounded' },
  { id: 'europost', label: 'Европочта', info: 'Доставка в любое отделение. Отправим завтра.', extra: 'Срок в пути: 2-4 дня', price: 'от 3.50 BYN', priceClass: 'text-slate-900 font-bold text-[11px] bg-slate-100 px-1.5 py-0.5 rounded' },
]

export function DeliveryWidget() {
  const [method, setMethod] = useState('pickup')

  return (
    <div>
      <h3 className="text-[11px] font-bold text-slate-900 mb-2">Получение заказа</h3>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="relative">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-md pl-2 pr-6 py-1 focus:outline-none focus:border-slate-400 cursor-pointer transition-colors"
          >
            {DELIVERY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <svg className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <span className="text-slate-400 text-[11px] font-medium">в</span>
        <div className="relative">
          <select className="appearance-none bg-transparent text-blue-600 hover:text-blue-800 text-[11px] font-bold pl-1 pr-4 py-1 focus:outline-none cursor-pointer transition-colors">
            <option value="minsk">г. Минск</option>
            <option value="brest">г. Брест</option>
            <option value="gomel">г. Гомель</option>
            <option value="grodno">г. Гродно</option>
            <option value="vitebsk">г. Витебск</option>
            <option value="mogilev">г. Могилев</option>
          </select>
          <svg className="w-2.5 h-2.5 text-blue-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div className="relative min-h-[40px] pl-1">
        {DELIVERY_OPTIONS.map((o) => (
          <div
            key={o.id}
            className={method === o.id ? 'block' : 'hidden'}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] text-slate-500 mb-0.5">
                  {o.info} <br />
                  <span className="text-slate-800 font-medium">{o.id === 'pickup' ? 'Сегодня до 18:00' : 'Отправим завтра'}</span>
                </div>
                {o.extra && (
                  <div className={`text-[9px] font-semibold mt-0.5 uppercase tracking-wider ${o.id === 'pickup' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {o.id === 'pickup' ? '🎁 ' : ''}{o.extra}
                  </div>
                )}
              </div>
              <span className={o.priceClass}>{o.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
