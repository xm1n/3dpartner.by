import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { ProductCard } from '@/components/catalog/ProductCard'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : ''
  return {
    title: q ? `Поиск: ${q} — 3D Partner` : 'Поиск — 3D Partner',
  }
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q.trim() : ''
  const page = Number(params.page) || 1

  let products: any[] = []
  let totalDocs = 0
  let totalPages = 0

  if (q.length >= 2) {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'products',
      limit: 12,
      page,
      depth: 1,
      where: {
        or: [
          { title: { like: q } },
          { sku: { like: q } },
        ],
        _status: { equals: 'published' },
      },
    })

    products = result.docs
    totalDocs = result.totalDocs
    totalPages = result.totalPages
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-3 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold">Поиск</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
          {q ? <>Результаты поиска: «{q}»</> : 'Поиск'}
        </h1>
        {q && (
          <p className="text-sm text-slate-500 font-medium">
            {totalDocs > 0
              ? `Найдено ${totalDocs} ${totalDocs === 1 ? 'товар' : totalDocs < 5 ? 'товара' : 'товаров'}`
              : 'Ничего не найдено'}
          </p>
        )}
      </div>

      {!q && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Введите запрос для поиска</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Начните вводить название товара, артикул или бренд в строке поиска</p>
        </div>
      )}

      {q && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product: any) => {
            const brand = typeof product.brand === 'object' ? product.brand?.title : undefined
            const firstImage = product.images?.[0]?.image
            const imageUrl = typeof firstImage === 'object' ? firstImage?.url : undefined
            const colors = product.variants
              ?.filter((v: any) => v.colorHex)
              .map((v: any) => ({ hex: v.colorHex }))

            return (
              <ProductCard
                key={product.id}
                title={product.title}
                slug={product.slug}
                brand={brand}
                price={product.price}
                oldPrice={product.oldPrice ?? undefined}
                imageUrl={imageUrl}
                inStock={product.inStock}
                stockQuantity={product.stockQuantity ?? undefined}
                badges={product.badges ?? undefined}
                colors={colors?.length > 0 ? colors : undefined}
              />
            )
          })}
        </div>
      )}

      {q && products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl font-black">?</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">По запросу «{q}» ничего не найдено</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Попробуйте изменить запрос или воспользуйтесь каталогом для навигации по категориям
          </p>
          <Link href="/catalog" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded font-bold transition text-sm shadow-sm">
            Перейти в каталог
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/search?q=${encodeURIComponent(q)}&page=${p}`}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold shadow-sm transition ${
                p === page
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
