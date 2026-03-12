import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import type { Where } from 'payload'
import { formatPrice } from '@/lib/formatPrice'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductActions } from '@/components/product/ProductActions'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { ProductTabs } from '@/components/product/ProductTabs'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { DeliveryWidget } from '@/components/product/DeliveryWidget'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ColorPicker } from '@/components/product/ColorPicker'
import type { Metadata } from 'next'

type Params = Promise<{ slug: string }>

async function getProduct(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}

async function getRelatedProducts(categoryIds: (string | number)[], catalogId: string | number | null, excludeId: string, limit: number) {
  if (categoryIds.length === 0 && !catalogId) return []
  const payload = await getPayload()
  const where: Where = {
    _status: { equals: 'published' },
    id: { not_equals: excludeId },
    ...(categoryIds.length > 0 ? { categories: { in: categoryIds } } : catalogId != null ? { catalog: { equals: catalogId } } : {}),
  }
  const result = await payload.find({
    collection: 'products',
    where,
    limit,
    depth: 1,
  })
  return result.docs
}

async function getProductReviews(productId: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'reviews',
    where: { product: { equals: productId } },
    sort: '-createdAt',
    limit: 50,
    depth: 0,
  })
  return result.docs
}

async function getCategoryCarouselSlides(categoryIds: (string | number)[]) {
  if (categoryIds.length === 0) return []
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'categories',
    where: { id: { in: categoryIds } },
    limit: categoryIds.length,
    depth: 0,
  })
  const withSlides = result.docs.find((c: any) => Array.isArray(c?.carouselSlides) && c.carouselSlides.length > 0)
  return (withSlides?.carouselSlides ?? []).map((s: any) => ({
    icon: s?.icon ?? '',
    title: s?.title ?? '',
    text: s?.text ?? '',
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  return {
    title: product?.metaTitle || product?.title || 'Товар',
    description: product?.metaDescription || undefined,
  }
}

const BADGE_LABELS: Record<string, { label: string; className: string }> = {
  bestseller: { label: 'Хит продаж', className: 'bg-blue-600 text-white border-blue-500' },
  new: { label: 'Новинка', className: 'bg-slate-800 text-white border-slate-700' },
  sale: { label: 'Скидка', className: 'bg-red-500 text-white border-red-400' },
  preorder: { label: 'Под заказ', className: 'bg-slate-500 text-white border-slate-400' },
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = (await getProduct(slug)) as any
  if (!product) notFound()

  const brand = typeof product.brand === 'object' ? product.brand : null
  const catalogObj = typeof product.catalog === 'object' ? product.catalog : null
  const categories = (product.categories ?? []).map((c: any) => (typeof c === 'object' ? c : null)).filter(Boolean)
  const images = (product.images ?? []).map((img: any) => (typeof img.image === 'object' ? img.image : null)).filter(Boolean)
  const specs = product.specs ?? []
  const variants = product.variants ?? []
  const badges = (product.badges ?? []).map((b: string) => BADGE_LABELS[b]).filter(Boolean)
  const downloadFiles = (product.downloadFiles ?? []).map((item: any) => ({
    label: item?.label || 'Файл',
    file: typeof item?.file === 'object' && item?.file ? { url: item.file.url, filename: item.file.filename } : null,
  })).filter((item: { file: unknown }) => item.file != null)

  const productId = String(product.id)
  const firstImage = images[0]
  const imageUrl = firstImage?.url

  const categoryIds = categories.map((c: any) => c.id)
  const catalogId = catalogObj?.id ?? null
  const [related, reviews, carouselSlides] = await Promise.all([
    getRelatedProducts(categoryIds, catalogId, productId, 4),
    getProductReviews(productId),
    getCategoryCarouselSlides(categoryIds),
  ])

  const catalogSlug = catalogObj?.slug
  const firstCategory = categories[0]
  const reviewsList = reviews.map((r: any) => ({
    id: r.id,
    authorName: r.authorName || 'Покупатель',
    rating: r.rating,
    text: r.text,
    createdAt: r.createdAt,
  }))
  const reviewsCount = reviewsList.length
  const averageRating = reviewsCount > 0
    ? reviewsList.reduce((sum, r) => sum + Number(r.rating), 0) / reviewsCount
    : null

  return (
    <main className="container mx-auto px-4 py-6 max-w-[1400px]">
      <nav className="flex text-[11px] text-slate-400 mb-6 font-semibold uppercase tracking-wider" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-slate-900 transition">
              Главная
            </Link>
          </li>
          <li>
            <span className="text-slate-200">/</span>
          </li>
          <li>
            <Link href="/catalog" className="hover:text-slate-900 transition">
              Каталог
            </Link>
          </li>
          {catalogObj && (
            <>
              <li>
                <span className="text-slate-200">/</span>
              </li>
              <li>
                <Link href={`/catalog/${catalogSlug}`} className="hover:text-slate-900 transition">
                  {catalogObj.title}
                </Link>
              </li>
            </>
          )}
          {firstCategory && catalogSlug && (
            <>
              <li>
                <span className="text-slate-200">/</span>
              </li>
              <li>
                <Link href={`/catalog/${catalogSlug}/${firstCategory.slug}`} className="hover:text-slate-900 transition">
                  {firstCategory.title}
                </Link>
              </li>
            </>
          )}
          <li>
            <span className="text-slate-200">/</span>
          </li>
          <li className="text-slate-800 truncate max-w-[180px]">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
        <ProductGallery
          images={images.map((img: any) => ({ url: img.url, alt: product.title }))}
          productTitle={product.title}
          badges={badges}
        />

        <div className="lg:col-span-5 flex flex-col pt-1">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            {brand ? (
              <Link
                href={brand.slug ? `/catalog?brand=${brand.slug}` : '/catalog'}
                className="flex items-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#0f172a" strokeWidth={1.5} fill="#f59e0b" />
                  <path d="M12 2v10.5m-9-5l9 5m9-5l-9 5" stroke="#0f172a" strokeWidth={1.5} />
                </svg>
                <span className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 uppercase tracking-widest transition">
                  {brand.name ?? brand.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2.5">
              <button type="button" className="text-slate-400 hover:text-blue-600 transition" title="Сравнить">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <FavoriteButton
                product={{ id: productId, title: product.title, slug: product.slug, price: product.price, imageUrl, brand: brand?.name ?? brand?.title }}
                className="!w-8 !h-8 text-slate-400 hover:text-red-500"
              />
              <span className="w-px h-3 bg-slate-200 mx-0.5" />
              {product.sku && (
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">Арт: {product.sku}</span>
              )}
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-4 text-xs">
            <div className="flex items-center text-slate-900 font-bold gap-1">
              <span className="text-yellow-400 text-sm">★</span> {averageRating != null ? averageRating.toFixed(1) : '—'}
            </div>
            <span className="text-slate-200">|</span>
            {reviewsCount > 0 ? (
              <a href="#reviews" className="text-slate-500 hover:text-slate-900 transition">
                {reviewsCount} {reviewsCount === 1 ? 'отзыв' : reviewsCount < 5 ? 'отзыва' : 'отзывов'}
              </a>
            ) : (
              <span className="text-slate-500">Отзывы скоро</span>
            )}
          </div>

          {variants.length > 0 && variants.some((v: any) => v.colorHex) && (
            <ColorPicker variants={variants as { variantName?: string; colorHex?: string }[]} />
          )}

          <hr className="border-slate-100 mb-4" />

          <div className="flex flex-col gap-1 mb-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Цена</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                {formatPrice(product.price)}{' '}
                <span className="text-base font-bold text-slate-400 ml-0.5 uppercase tracking-normal">BYN</span>
              </div>
              <div className="text-right">
                {product.inStock ? (
                  <>
                    <div className="text-emerald-600 font-bold text-[11px] mb-0.5 flex items-center justify-end gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> В наличии
                    </div>
                    {product.stockQuantity != null && (
                      <div className="text-[10px] text-slate-400">На складе: {product.stockQuantity} шт.</div>
                    )}
                  </>
                ) : (
                  <div className="text-slate-500 font-bold text-[11px]">Под заказ</div>
                )}
              </div>
            </div>
            {product.oldPrice && (
              <div className="text-sm text-slate-400 line-through mt-1">{formatPrice(product.oldPrice)} BYN</div>
            )}
          </div>

          <ProductActions
            product={{
              id: productId,
              title: product.title,
              slug: product.slug,
              price: product.price,
              imageUrl,
              brand: brand?.title,
            }}
          />

          <hr className="border-slate-100 mb-4" />

          <DeliveryWidget />
        </div>
      </div>

      <ProductTabs description={product.description} specs={specs} downloadFiles={downloadFiles} reviews={reviewsList} productId={productId} productPath={`/product/${product.slug}`} />

      <ProductCarousel slides={carouselSlides} />

      {related.length > 0 && (
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
            Мы также рекомендуем
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p: any) => {
              const images = p.images
              const firstImage = Array.isArray(images) ? images[0] : undefined
              const img = firstImage != null ? (firstImage?.image ?? firstImage) : undefined
              const imageUrl = typeof img === 'object' && img?.url ? img.url : undefined
              const brandTitle = typeof p.brand === 'object' ? (p.brand?.name ?? p.brand?.title) : undefined
              const categories = p.categories
              const catTitle = Array.isArray(categories) ? categories[0] : undefined
              const catName = typeof catTitle === 'object' && catTitle?.title ? catTitle.title : undefined
              return (
                <ProductCard
                  key={p.id}
                  id={String(p.id)}
                  title={p.title}
                  slug={p.slug}
                  brand={brandTitle}
                  category={catName}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  imageUrl={imageUrl}
                  inStock={p.inStock}
                  stockQuantity={p.stockQuantity}
                  badges={p.badges}
                  colors={p.variants?.filter((v: any) => v.colorHex).map((v: any) => ({ hex: v.colorHex }))}
                />
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
