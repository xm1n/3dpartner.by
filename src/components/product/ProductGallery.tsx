'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageItem = { url: string; alt?: string }
type BadgeItem = { label: string; className: string }

type Props = {
  images: ImageItem[]
  productTitle: string
  badges?: BadgeItem[]
}

export function ProductGallery({ images, productTitle, badges = [] }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mainImage = images[activeIndex] ?? images[0]
  const mainUrl = mainImage?.url

  return (
    <div className="lg:col-span-7 flex flex-col gap-3">
      <div className="relative w-full flex items-center justify-center min-h-[300px] md:min-h-[460px] group bg-white">
        <button
          type="button"
          className="absolute top-2 right-2 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-10 cursor-zoom-in"
          title="Увеличить"
          aria-label="Увеличить"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        {mainUrl ? (
          <img
            src={mainUrl}
            alt={mainImage?.alt ?? productTitle}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 p-4"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 text-6xl font-black">
            3D
          </div>
        )}

        {badges.length > 0 && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            {badges.map((b) => (
              <span
                key={b.label}
                className={`${b.className} text-[10px] uppercase font-bold px-3 py-1.5 rounded-md shadow-sm tracking-widest flex items-center gap-1.5 border border-current/20`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar w-full pb-1 px-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`w-14 h-14 md:w-20 md:h-20 shrink-0 border-b-2 flex items-center justify-center p-2 cursor-pointer pb-3 transition-opacity bg-white ${
                i === activeIndex ? 'border-slate-900 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.alt ?? ''} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
