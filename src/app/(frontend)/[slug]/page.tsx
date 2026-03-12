import { getPayload } from '@/lib/payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Params = Promise<{ slug: string }>

function renderRichText(content: any) {
  if (!content?.root?.children) return null
  return content.root.children.map((node: any, i: number) => {
    if (node.type === 'paragraph') {
      const text = node.children?.map((c: any) => c.text || '').join('') || ''
      return <p key={i} className="mb-4 text-slate-600 leading-relaxed">{text}</p>
    }
    if (node.type === 'heading') {
      const text = node.children?.map((c: any) => c.text || '').join('') || ''
      const Tag = `h${node.tag || 2}` as any
      return <Tag key={i} className="text-xl font-bold text-slate-900 mb-3 mt-6">{text}</Tag>
    }
    return null
  })
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
  })
  const page = result.docs[0] as any
  if (!page) return {}
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
  }
}

export default async function PagePage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
  })
  const page = result.docs[0] as any
  if (!page) notFound()

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-6 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold truncate max-w-[200px]">{page.title}</li>
        </ol>
      </nav>

      <article className="max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
          {page.title}
        </h1>

        <div className="prose prose-slate max-w-none">
          {page.content ? renderRichText(page.content) : null}
        </div>
      </article>
    </main>
  )
}
