import Link from 'next/link'
import { ArrowRight, Lightbulb, Boxes } from 'lucide-react'
import { ProductCard } from '@/components/catalog/ProductCard'

const mockProducts = [
  { title: 'Филамент PETG eSUN 1кг 1.75мм', slug: 'esun-petg-1kg', brand: 'eSUN', category: 'Филамент', price: 55.0, inStock: true, stockQuantity: 120, badges: ['bestseller'] as string[], colors: [{ hex: '#000' }, { hex: '#fff' }, { hex: '#dc2626' }, { hex: '#1eb4e6' }] },
  { title: 'Филамент Bambu PLA Basic 1кг (с катушкой)', slug: 'bambu-pla-basic', brand: 'Bambu Lab', category: 'Филамент', price: 95.0, inStock: true, badges: ['new'] as string[], colors: [{ hex: '#22c55e' }, { hex: '#f97316' }] },
  { title: 'Хотэнд в сборе (Закалённая сталь) для X1/P1', slug: 'hotend-x1-p1', brand: 'Комплектующие', price: 135.0, inStock: true },
]

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px] space-y-10">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[400px]">
        <Link href="/catalog" className="md:col-span-8 rounded-lg overflow-hidden relative group hover-card cursor-pointer bg-slate-900 flex">
          <div className="absolute inset-0 hero-overlay z-10" />
          <div className="relative z-20 p-8 md:p-12 flex flex-col justify-center h-full">
            <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-sm mb-4 inline-block w-max shadow-sm">
              B2B &amp; B2C Магазин
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">
              Всё для 3D&#8209;печати<br />в одном месте
            </h1>
            <p className="text-slate-300 mb-8 text-sm md:text-base max-w-md leading-relaxed">
              Более 2000 позиций: от фотополимерных смол и инженерного PETG до профессиональных станков Bambu Lab и Creality.
            </p>
            <span className="bg-white text-slate-900 px-6 py-2.5 rounded font-bold hover:bg-slate-100 transition shadow-sm flex items-center gap-2 w-max text-sm">
              Перейти в каталог <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <div className="md:col-span-4 flex flex-col gap-4 h-full">
          <Link href="/calculator" className="flex-1 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-center relative overflow-hidden group hover-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-slate-900">Студия 3D-печати</h3>
                <Boxes className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Загрузите STL файл в онлайн-калькулятор и узнайте точную стоимость за 5 секунд.
              </p>
              <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                Рассчитать стоимость <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <Link href="/engineers" className="flex-1 bg-slate-900 rounded-lg p-6 flex flex-col justify-center text-white relative overflow-hidden group hover-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-900/30 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white">Портал Инженеров</h3>
                <Lightbulb className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Монетизируйте свои 3D-модели. Загружайте файлы в сейф, мы их печатаем и выплачиваем вам роялти с продаж.
              </p>
              <span className="text-purple-400 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                Стать автором <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular products */}
      <section>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 border-b border-slate-200 pb-3 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Популярные расходники</h2>
            <p className="text-sm text-slate-500 mt-1">Материалы всегда в наличии на нашем складе</p>
          </div>
          <Link href="/catalog" className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-500 px-4 py-2 rounded transition">
            Весь каталог
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
          <Link href="/catalog" className="bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center hover:bg-white hover:border-slate-400 hover:shadow-sm transition cursor-pointer p-6 text-center group min-h-[280px]">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-slate-500">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1 text-sm">Смотреть весь каталог</h3>
            <p className="text-xs text-slate-500">Оборудование и материалы</p>
          </Link>
        </div>
      </section>

      {/* B2B + Engineers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 lg:p-10 relative overflow-hidden shadow-sm hover:shadow-md transition group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-purple-100 transition-colors" />
          <div className="relative z-10 flex flex-col h-full">
            <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded w-max uppercase tracking-wider mb-6 border border-purple-100">CRM Партнёров</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Создавайте модели.<br />Мы займёмся продажами.</h2>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed max-w-sm">
              Интегрированный портал для инженеров. Загрузите ваш чертёж в защищённый сейф. Мы напечатаем опытный образец и выставим на продажу.
            </p>
            <div className="mt-auto">
              <Link href="/engineers/portal" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded font-bold transition flex items-center gap-2 text-sm w-max shadow-sm">
                Войти в кабинет автора <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-8 lg:p-10 relative overflow-hidden shadow-md text-white group">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-900/40 rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none group-hover:bg-blue-800/40 transition-colors" />
          <div className="relative z-10 flex flex-col h-full">
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded w-max uppercase tracking-wider mb-6">Оптовый портал</span>
            <h2 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">Автоматизация закупок<br />для B2B клиентов</h2>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed max-w-sm">
              Регистрируйтесь как юридическое лицо и получите доступ к индивидуальным скидочным колонкам, ЭДО и API-токенам для интеграции.
            </p>
            <div className="mt-auto">
              <Link href="/b2b" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-bold transition flex items-center gap-2 text-sm w-max shadow-sm">
                Стать оптовым партнёром <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
