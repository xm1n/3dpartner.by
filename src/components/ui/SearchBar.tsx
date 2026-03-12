'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/formatPrice'

type SearchResult = {
  id: number | string
  title: string
  slug: string
  price?: number
  imageUrl?: string
  brand?: string
  inStock?: boolean
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query.trim(), 300)

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setTotalResults(0)
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/products?where[title][like]=${encodeURIComponent(q)}&limit=6&depth=1`,
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()

      const mapped: SearchResult[] = (data.docs || []).map((p: any) => {
        const firstImage = p.images?.[0]?.image
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          imageUrl: typeof firstImage === 'object' ? firstImage?.url : undefined,
          brand: typeof p.brand === 'object' ? p.brand?.title : undefined,
          inStock: p.inStock,
        }
      })

      setResults(mapped)
      setTotalResults(data.totalDocs || 0)
      setIsOpen(true)
    } catch {
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResults(debouncedQuery)
  }, [debouncedQuery, fetchResults])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setTotalResults(0)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="flex-1 relative">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          placeholder="Поиск принтеров по модели или бренду..."
          className="w-full bg-slate-50 border border-slate-300 rounded py-2 px-3 pl-9 pr-8 text-sm focus:outline-none focus:border-slate-500 focus:bg-white transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        {query && (
          <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-b-0"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover border border-slate-100 shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0">3D</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{item.title}</div>
                  {item.brand && <div className="text-[10px] text-slate-400 font-medium">{item.brand}</div>}
                </div>
                <div className="text-right shrink-0">
                  {item.price != null && (
                    <div className="text-sm font-bold text-slate-900">{formatPrice(item.price)} <span className="text-[9px] text-slate-400">BYN</span></div>
                  )}
                  {item.inStock ? (
                    <div className="text-[10px] text-emerald-600 font-medium">В наличии</div>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-medium">Под заказ</div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {totalResults > results.length && (
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm font-bold text-blue-600 hover:bg-blue-50 transition border-t border-slate-100"
            >
              Показать все результаты ({totalResults})
            </Link>
          )}
        </div>
      )}

      {isOpen && debouncedQuery.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-6 text-center">
          <div className="text-slate-400 text-sm font-medium">Ничего не найдено по запросу «{debouncedQuery}»</div>
          <div className="text-[11px] text-slate-400 mt-1">Попробуйте изменить запрос или перейти в <Link href="/catalog" className="text-blue-600 hover:underline">каталог</Link></div>
        </div>
      )}
    </div>
  )
}
