import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/catalog/ProductCard'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

type Params = Promise<{ catalog: string; category: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function getData(catalogSlug: string, categorySlug: string) {
  const payload = await getPayload()

  const [catalogRes, categoryRes] = await Promise.all([
    payload.find({ collection: 'catalogs', where: { slug: { equals: catalogSlug } }, limit: 1 }),
    payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, limit: 1 }),
  ])

  const catalog = catalogRes.docs[0] || null
  const category = categoryRes.docs[0] || null

  return { catalog, category }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { catalog: catalogSlug, category: categorySlug } = await params
  const { catalog, category } = await getData(catalogSlug, categorySlug)
  const title = category?.metaTitle || category?.title
  const catalogTitle = catalog?.title
  return {
    title: title ? `${title} — ${catalogTitle || '3D Partner'}` : 'Категория',
    description: category?.metaDescription || category?.description || undefined,
  }
}

export default async function CatalogCategoryPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { catalog: catalogSlug, category: categorySlug } = await params
  const sp = await searchParams
  const page = Number(sp.page) || 1

  const payload = await getPayload()
  const { catalog, category } = await getData(catalogSlug, categorySlug)
  if (!catalog || !category) notFound()

  const [productsResult, allCategories] = await Promise.all([
    payload.find({
      collection: 'products',
      where: {
        _status: { equals: 'published' },
        catalog: { equals: catalog.id },
        categories: { in: [category.id] },
      },
      limit: 12,
      page,
      sort: '-createdAt',
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      where: { catalog: { equals: catalog.id } },
      limit: 50,
      sort: 'sortOrder',
    }),
  ])

  const products = productsResult.docs
  const totalProducts = productsResult.totalDocs
  const totalPages = productsResult.totalPages
  const currentPage = productsResult.page || 1
  const categories = allCategories.docs

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="mb-8">
        <nav className="flex text-xs text-slate-500 mb-3 font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li><Link href="/catalog" className="hover:text-slate-900 transition">Каталог</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li><Link href={`/catalog/${catalogSlug}`} className="hover:text-slate-900 transition">{catalog.title}</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li className="text-slate-900 font-semibold">{category.title}</li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{category.title}</h1>
            {category.description && (
              <p className="text-sm text-slate-500 mt-2 max-w-xl">{category.description}</p>
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
              <div className="mb-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">{catalog.title}</h3>
                <ul className="space-y-1 text-sm font-medium text-slate-600">
                  <li>
                    <Link href={`/catalog/${catalogSlug}`} className="flex justify-between items-center hover:bg-slate-50 rounded-lg px-3 py-2 transition">
                      <span>Все товары</span>
                    </Link>
                  </li>
                  {categories.map((cat: any) => (
                    <li key={cat.id}>
                      <Link
                        href={`/catalog/${catalogSlug}/${cat.slug}`}
                        className={`flex justify-between items-center rounded-lg px-3 py-2 transition ${
                          cat.slug === categorySlug
                            ? 'text-slate-900 bg-slate-100 font-bold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {cat.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
              <h3 className="text-lg font-bold text-slate-900 mb-2">В этой категории пока нет товаров</h3>
              <p className="text-sm text-slate-500 mb-6">Товары появятся в ближайшее время</p>
              <Link href={`/catalog/${catalogSlug}`} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded font-bold transition text-sm shadow-sm">
                Вернуться в {catalog.title}
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 mb-6 flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/catalog/${catalogSlug}/${categorySlug}?page=${p}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold shadow-sm transition ${
                    p === currentPage
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
