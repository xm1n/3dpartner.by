import Link from 'next/link'
import { getPayload } from '@/lib/payload'

const CATEGORY_LABELS: Record<string, string> = {
  knowledge: 'База знаний',
  news: 'Новости',
  reviews: 'Обзоры',
  tutorials: 'Инструкции',
}

async function getArticles() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
    depth: 1,
  })
  return result.docs
}

export default async function KnowledgePage() {
  const articles = await getArticles()

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-3 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold">База знаний</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">База знаний</h1>
        <p className="text-slate-600">Статьи, руководства и обзоры по 3D-печати</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['Все', 'База знаний', 'Новости', 'Обзоры', 'Инструкции'].map((tab) => (
          <button
            key={tab}
            type="button"
            className="shrink-0 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
          >
            {tab}
          </button>
        ))}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => {
            const coverImage = typeof article.coverImage === 'object' ? article.coverImage : null
            const imageUrl = coverImage?.url
            const categoryLabel = article.articleCategory ? CATEGORY_LABELS[article.articleCategory] ?? article.articleCategory : null
            const dateStr = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
              : null

            return (
              <Link
                key={article.id}
                href={`/knowledge/${article.slug}`}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition"
              >
                <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <span className="text-slate-300 text-4xl font-black">3D</span>
                  )}
                </div>
                <div className="p-5">
                  {categoryLabel && (
                    <span className="inline-block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {categoryLabel}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">{article.excerpt}</p>
                  )}
                  {dateStr && (
                    <p className="text-xs text-slate-400 mb-3">{dateStr}</p>
                  )}
                  <span className="text-sm font-semibold text-slate-900 group-hover:underline">
                    Читать
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 text-2xl font-black">3D</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Статьи пока не добавлены</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Раздел базы знаний скоро будет наполнен полезными материалами. Загляните позже!
          </p>
          <Link
            href="/"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded font-bold transition text-sm shadow-sm"
          >
            На главную
          </Link>
        </div>
      )}
    </main>
  )
}
