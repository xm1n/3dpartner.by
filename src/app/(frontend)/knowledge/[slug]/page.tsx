import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Params = Promise<{ slug: string }>

async function getArticle(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug) as any
  return {
    title: article?.metaTitle || article?.title || 'Статья',
    description: article?.metaDescription || article?.excerpt || undefined,
  }
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticle(slug) as any
  if (!article) notFound()

  const coverImage = typeof article.coverImage === 'object' ? article.coverImage : null
  const imageUrl = coverImage?.url
  const author = typeof article.author === 'object' ? article.author : null
  const authorName = author?.firstName ? `${author.firstName}${author.lastName ? ` ${author.lastName}` : ''}` : null
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-6 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li><Link href="/knowledge" className="hover:text-slate-900 transition">База знаний</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold truncate max-w-[200px]">{article.title}</li>
        </ol>
      </nav>

      <article className="max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-6">
          {dateStr && <span>{dateStr}</span>}
          {authorName && <span>{authorName}</span>}
        </div>

        {imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden border border-slate-200">
            <img src={imageUrl} alt={article.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          {article.content && typeof article.content === 'object' && article.content.root ? (
            <RichText data={article.content} />
          ) : (
            <p className="text-slate-600">Содержимое статьи пока не добавлено.</p>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition"
          >
            Вернуться в базу знаний
          </Link>
        </div>
      </article>
    </main>
  )
}
