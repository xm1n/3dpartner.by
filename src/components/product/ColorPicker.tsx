'use client'

import { useState } from 'react'

type Variant = { variantName?: string; colorHex?: string }

type Props = { variants: Variant[] }

export function ColorPicker({ variants }: Props) {
  const withColor = variants.filter((v) => v.colorHex)
  const [selected, setSelected] = useState(0)
  if (withColor.length === 0) return null

  const current = withColor[selected]

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold text-slate-900">Цвет</span>
        <span className="text-[11px] text-slate-500" id="selected-color-name">
          {current?.variantName || current?.colorHex || '—'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {withColor.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={`color-btn w-7 h-7 rounded-full border transition hover:scale-110 focus:outline-none outline-2 outline-offset-2 ${
              i === selected
                ? 'outline-slate-900 border-slate-900 ring-2 ring-slate-900 ring-offset-1'
                : 'outline-transparent border-slate-200'
            }`}
            style={{ backgroundColor: v.colorHex || '#ccc' }}
            title={v.variantName || v.colorHex}
          />
        ))}
      </div>
    </div>
  )
}
