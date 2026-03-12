import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

type Params = Promise<{ catalog: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getCatalog(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'catalogs',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { catalog: slug } = await params
  const cat = await getCatalog(slug)
  return {
    title: cat?.metaTitle || cat?.title || 'Каталог',
    description: cat?.metaDescription || cat?.description || undefined,
  }
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { catalog: catalogSlug } = await params
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const brandFilter = sp.brand as string | undefined

  const payload = await getPayload()
  const catalog = await getCatalog(catalogSlug)
  if (!catalog) notFound()

  const where: any = {
    _status: { equals: 'published' },
    catalog: { equals: catalog.id },
  }
  if (brandFilter) {
    where['brand.name'] = { equals: brandFilter }
  }

  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    payload.find({
      collection: 'products',
      limit: 12,
      page,
      sort: '-createdAt',
      where,
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      where: { catalog: { equals: catalog.id } },
      limit: 50,
      sort: 'sortOrder',
    }),
    payload.find({
      collection: 'brands',
      limit: 50,
      sort: 'title',
    }),
  ])

  const products = productsResult.docs
  const totalProducts = productsResult.totalDocs
  const totalPages = productsResult.totalPages
  const currentPage = productsResult.page || 1
  const categories = categoriesResult.docs
  const brands = brandsResult.docs

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="mb-8">
        <nav className="flex text-xs text-slate-500 mb-3 font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li><Link href="/catalog" className="hover:text-slate-900 transition">Каталог</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li className="text-slate-900 font-semibold">{catalog.title}</li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{catalog.title}</h1>
            {catalog.description && (
              <p className="text-sm text-slate-500 mt-1 max-w-xl">{catalog.description}</p>
            )}
          </div>
          <span className="text-slate-500 text-sm font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
            {totalProducts} {totalProducts === 1 ? 'товар' : totalProducts < 5 ? 'товара' : 'товаров'}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="hidden lg:flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm sticky top-[100px] max-h-[calc(100vh-140px)] overflow-hidden">
            <div className="overflow-y-auto p-5 space-y-1">
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Категории</h3>
                  <ul className="space-y-1 text-sm font-medium text-slate-600">
                    <li>
                      <Link href={`/catalog/${catalogSlug}`} className="flex justify-between items-center text-slate-900 bg-slate-100 rounded-lg px-3 py-2">
                        <span className="font-bold">Все товары</span>
                        <span className="text-[10px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded shadow-sm">{totalProducts}</span>
                      </Link>
                    </li>
                    {categories.map((cat: any) => (
                      <li key={cat.id}>
                        <Link href={`/catalog/${catalogSlug}/${cat.slug}`} className="flex justify-between items-center hover:bg-slate-50 rounded-lg px-3 py-2 transition">
                          {cat.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {brands.length > 0 && (
                <>
                  <hr className="border-slate-100" />
                  <div className="py-2">
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-3 px-1">Бренд</h3>
                    <div className="space-y-3 px-1">
                      {brands.map((b: any) => (
                        <label key={b.id} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="filter-checkbox" />
                          <span className="text-sm text-slate-600 flex-1">{b.name || b.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {products.map((product: any) => {
                const brand = typeof product.brand === 'object' ? product.brand?.title || product.brand?.name : undefined
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 text-2xl font-black">3D</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">В этом разделе пока нет товаров</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm">Товары скоро появятся. Загляните позже!</p>
              <Link href="/catalog" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded font-bold transition text-sm shadow-sm">
                Все каталоги
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 mb-6 flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/catalog/${catalogSlug}?page=${p}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold shadow-sm transition ${
                    p === currentPage
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-slate-400 px-2 font-bold">...</span>
                  <Link
                    href={`/catalog/${catalogSlug}?page=${totalPages}`}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center text-sm font-semibold shadow-sm"
                  >
                    {totalPages}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
