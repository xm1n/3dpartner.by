'use client'

import { useState, useEffect } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ReviewForm } from './ReviewForm'

type TabId = 'description' | 'specs' | 'reviews' | 'files'

type Spec = { specName: string; specValue: string }

type DownloadFile = { label: string; file: { url?: string; filename?: string } | number | string }

type Review = { id: string | number; authorName: string; rating: number; text: string; createdAt: string }

type Props = {
  description: unknown
  specs: Spec[]
  downloadFiles?: DownloadFile[]
  reviews?: Review[]
  productId?: string
  productPath?: string
}

function formatReviewDate(createdAt: string) {
  try {
    const d = new Date(createdAt)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export function ProductTabs({ description, specs, downloadFiles = [], reviews = [], productId, productPath }: Props) {
  const [active, setActive] = useState<TabId>('description')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash === '#reviews') setActive('reviews')
  }, [])

  const files = downloadFiles.filter(
    (item): item is DownloadFile & { file: { url?: string; filename?: string } } =>
      item?.file != null && typeof item.file === 'object' && 'url' in item.file
  )

  const tabs: { id: TabId; label: string; count?: number; icon?: React.ReactNode }[] = [
    { id: 'description', label: 'ОПИСАНИЕ' },
    { id: 'specs', label: 'ХАРАКТЕРИСТИКИ' },
    { id: 'reviews', label: 'ОТЗЫВЫ', count: reviews.length },
    {
      id: 'files',
      label: 'ПРОФИЛИ ДЛЯ СЛАЙСЕРА И ДРУГИЕ ФАЙЛЫ',
      count: files.length,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ]

  return (
    <div id="reviews" className="pt-6 border-t border-slate-200">
      <div className="flex overflow-x-auto border-b border-slate-200 no-scrollbar gap-6 md:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex items-center pb-3 font-semibold text-xs md:text-sm whitespace-nowrap tracking-wider border-b-2 transition ${
              active === tab.id
                ? 'text-slate-900 border-slate-900'
                : 'text-slate-400 hover:text-slate-900 border-transparent'
            }`}
          >
            {tab.icon && <span className="mr-1.5 flex items-center [&_svg]:block">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && <span className="ml-1.5 text-slate-900">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 mb-2">
        {active === 'description' && (
          <>
            <div className="md:col-span-7 prose prose-slate max-w-none text-sm md:text-base leading-relaxed text-slate-600">
              {description && typeof description === 'object' && 'root' in description ? (
                <RichText data={description as React.ComponentProps<typeof RichText>['data']} />
              ) : (
                <p className="text-slate-500">Описание товара пока не добавлено.</p>
              )}
            </div>
            {specs.length > 0 && (
              <div className="md:col-span-5">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Параметры</h3>
                <div className="space-y-3 text-sm">
                  {specs.map((s, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">{s.specName}</span>
                      <strong className="text-slate-900 font-mono">{s.specValue}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {active === 'specs' && (
          <div className="md:col-span-7">
            {specs.length > 0 ? (
              <div className="space-y-3 text-sm">
                {specs.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">{s.specName}</span>
                    <strong className="text-slate-900 font-mono">{s.specValue}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Характеристики не указаны.</p>
            )}
          </div>
        )}
        {active === 'reviews' && (
          <div className="md:col-span-7 space-y-8">
            {reviews.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Отзывы покупателей</h3>
                <ul className="space-y-5">
                  {reviews.map((r) => (
                    <li key={String(r.id)} className="border-b border-slate-100 pb-5 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(Math.round(r.rating))}
                          <span className="text-slate-300">{'★'.repeat(5 - Math.round(r.rating))}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{r.authorName}</span>
                        <span className="text-xs text-slate-400">{formatReviewDate(r.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{r.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Оставить отзыв</h3>
              {productId ? (
                <ReviewForm productId={productId} productPath={productPath} />
              ) : (
                <p className="text-slate-500 text-sm">Не удалось загрузить форму.</p>
              )}
            </div>
          </div>
        )}
        {active === 'files' && (
          <div className="md:col-span-7">
            {files.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 mb-4">
                  Скачайте профили для слайсера, 3D-модели и другие файлы для этого товара.
                </p>
                <ul className="space-y-2">
                  {files.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.file.url}
                        download={item.file.filename}
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 font-medium text-sm transition"
                      >
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {item.label}
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-slate-500">Файлы для скачивания пока не добавлены.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
