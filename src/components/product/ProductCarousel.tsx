'use client'

import { useState, useEffect } from 'react'

const DEFAULT_SLIDES = [
  { icon: '🌿', title: '100% Экологичный материал', text: 'Наш PLA производится из возобновляемых растительных ресурсов. Картонная катушка (Paper Spool) полностью подлежит вторичной переработке.' },
  { icon: '🎯', title: 'Идеальная намотка (Neat Winding)', text: 'Строгий автоматизированный контроль натяжения нити гарантирует отсутствие перехлестов и застреваний пластика даже во время многосуточной печати.' },
  { icon: '📦', title: 'Вакуумная упаковка', text: 'Каждая катушка поставляется в прочном вакуумном пакете с силикагелем. Это надежно защищает филамент от влаги во время транспортировки и хранения.' },
]

export type CarouselSlide = { icon?: string; title: string; text: string }

type Props = {
  slides?: CarouselSlide[] | null
}

export function ProductCarousel({ slides: propSlides }: Props) {
  const slides = (propSlides && propSlides.length > 0 ? propSlides : DEFAULT_SLIDES) as CarouselSlide[]
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-50 group/carousel border border-slate-100 mb-12">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="w-full shrink-0 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-sm border border-slate-100">
              {s.icon || '•'}
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3">{s.title}</h4>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 focus:outline-none border border-slate-200"
        aria-label="Назад"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 focus:outline-none border border-slate-200"
        aria-label="Вперёд"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-slate-800' : 'bg-slate-300'}`}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
