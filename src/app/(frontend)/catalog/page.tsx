import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { Printer, Box, Wrench, Cog, Package, Layers } from 'lucide-react'
import type { ReactNode } from 'react'

const iconMap: Record<string, ReactNode> = {
  printer: <Printer className="w-8 h-8" />,
  spool: <Layers className="w-8 h-8" />,
  cube: <Box className="w-8 h-8" />,
  gear: <Cog className="w-8 h-8" />,
  tools: <Wrench className="w-8 h-8" />,
  box: <Package className="w-8 h-8" />,
}

export const metadata = {
  title: 'Каталог — 3D Partner',
  description: 'Все разделы каталога 3D Partner: принтеры, материалы, готовые изделия и комплектующие',
}

export default async function CatalogIndexPage() {
  const payload = await getPayload()

  const [catalogsResult, productsCount] = await Promise.all([
    payload.find({ collection: 'catalogs', sort: 'sortOrder', limit: 20 }),
    payload.find({ collection: 'products', where: { _status: { equals: 'published' } }, limit: 0 }),
  ])

  const catalogs = catalogsResult.docs

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-3 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold">Каталог</li>
        </ol>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Каталог</h1>
        <p className="text-slate-500 text-sm">
          {productsCount.totalDocs > 0
            ? `${productsCount.totalDocs} товаров в ${catalogs.length} ${catalogs.length === 1 ? 'разделе' : 'разделах'}`
            : 'Выберите раздел для просмотра товаров'}
        </p>
      </div>

      {catalogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((cat: any) => {
            const imageUrl = typeof cat.image === 'object' ? cat.image?.url : undefined

            return (
              <Link
                key={cat.id}
                href={`/catalog/${cat.slug}`}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <div className="aspect-[16/9] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                  {imageUrl ? (
                    <img src={imageUrl} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="text-slate-300 group-hover:text-slate-400 transition">
                      {cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : <Box className="w-12 h-12" />}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition">{cat.title}</h2>
                  {cat.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">{cat.description}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 mt-3 group-hover:gap-2 transition-all">
                    Перейти <span>→</span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 text-2xl font-black">3D</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Каталоги пока не созданы</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">Разделы каталога скоро появятся. Загляните позже!</p>
          <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded font-bold transition text-sm shadow-sm">
            На главную
          </Link>
        </div>
      )}
    </main>
  )
}
