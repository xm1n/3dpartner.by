export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <span className="inline-block text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded mb-4">
        Раздел в разработке
      </span>
      <h1 className="text-3xl font-black text-slate-900">Карточка товара</h1>
      <p className="text-slate-500 mt-2">
        Страница товара: <strong className="text-slate-700">{slug}</strong>
      </p>
    </main>
  )
}
