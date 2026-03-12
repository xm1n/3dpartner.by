'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

type Category = {
  id: number | string
  title: string
  slug: string
}

type CatalogItem = {
  id: number | string
  title: string
  slug: string
  icon?: string
  categories: Category[]
}

const catalogColors = [
  'bg-blue-600',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-cyan-500',
]

export function CatalogMenu() {
  const [open, setOpen] = useState(false)
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [panelTop, setPanelTop] = useState(0)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    if (loaded) return
    try {
      const [catRes, catsRes] = await Promise.all([
        fetch('/api/catalogs?sort=sortOrder&limit=20&depth=0'),
        fetch('/api/categories?sort=sortOrder&limit=100&depth=0'),
      ])
      const catData = await catRes.json()
      const catsData = await catsRes.json()

      const catalogDocs: any[] = catData.docs || []
      const categoryDocs: any[] = catsData.docs || []

      const mapped: CatalogItem[] = catalogDocs.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        icon: c.icon,
        categories: categoryDocs
          .filter((cat: any) => {
            const catCatalogId = typeof cat.catalog === 'object' ? cat.catalog?.id : cat.catalog
            return catCatalogId === c.id
          })
          .map((cat: any) => ({ id: cat.id, title: cat.title, slug: cat.slug })),
      }))

      setCatalogs(mapped)
      setLoaded(true)
    } catch {
      // silently fail
    }
  }, [loaded])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open])

  function handleToggle() {
    if (!open) {
      load()
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        const headerEl = btnRef.current.closest('header')
        if (headerEl) {
          const headerRect = headerEl.querySelector('.container')?.getBoundingClientRect()
          setPanelTop((headerRect?.bottom ?? rect.bottom) + 1)
        } else {
          setPanelTop(rect.bottom + 8)
        }
      }
    }
    setOpen((v) => !v)
  }

  const colCount = Math.max(1, Math.min(4, catalogs.length))
  const gridClass =
    colCount === 1 ? 'md:grid-cols-1' :
    colCount === 2 ? 'md:grid-cols-2' :
    colCount === 3 ? 'md:grid-cols-3' :
    'md:grid-cols-4'

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded font-medium text-sm items-center gap-2 transition shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        Каталог
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-xl pb-8 transition-all"
          style={{ top: `${panelTop}px` }}
        >
          <div className="container mx-auto px-4 pt-6 max-w-[1400px]">
            {catalogs.length > 0 ? (
              <div className={`grid grid-cols-1 ${gridClass} gap-8`}>
                {catalogs.map((catalog, idx) => (
                  <div key={catalog.id}>
                    <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className={`w-2 h-2 ${catalogColors[idx % catalogColors.length]} rounded-sm shrink-0`} />
                      <Link
                        href={`/catalog/${catalog.slug}`}
                        onClick={() => setOpen(false)}
                        className="hover:text-blue-600 transition"
                      >
                        {catalog.title}
                      </Link>
                    </h4>
                    {catalog.categories.length > 0 && (
                      <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                        {catalog.categories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/catalog/${catalog.slug}/${cat.slug}`}
                              onClick={() => setOpen(false)}
                              className="hover:text-blue-600 transition"
                            >
                              {cat.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Загрузка каталогов...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
