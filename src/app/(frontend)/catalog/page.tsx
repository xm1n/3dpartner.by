import Link from 'next/link'
import { ProductCard } from '@/components/catalog/ProductCard'

const mockProducts = [
  { title: '3D-принтер Bambu Lab X1 Carbon Combo (с системой AMS)', slug: 'bambu-x1-carbon', brand: 'Bambu Lab', category: 'FDM', price: 5690.0, inStock: true, stockQuantity: 3, badges: ['bestseller'] as string[] },
  { title: '3D-принтер Creality K1 Max (Высокоскоростной)', slug: 'creality-k1-max', brand: 'Creality', category: 'FDM', price: 3150.0, inStock: true, stockQuantity: 12, badges: ['bestseller'] as string[] },
  { title: '3D-принтер Elegoo Saturn 3 Ultra 12K', slug: 'elegoo-saturn-3', brand: 'Elegoo', category: 'Фотополимерный', price: 1890.0, inStock: true, stockQuantity: 5, badges: ['new'] as string[] },
  { title: '3D-принтер Bambu Lab A1 Mini Combo (с AMS Lite)', slug: 'bambu-a1-mini', brand: 'Bambu Lab', category: 'FDM', price: 1650.0, inStock: true, stockQuantity: 18 },
  { title: '3D-принтер Anycubic Kobra 2 Pro', slug: 'anycubic-kobra-2', brand: 'Anycubic', category: 'FDM', price: 1150.0, inStock: false, badges: ['preorder'] as string[] },
  { title: 'Станция мойки и засветки Anycubic Wash & Cure 3.0', slug: 'anycubic-wash-cure', brand: 'Anycubic', category: 'SLA', price: 450.0, inStock: true },
]

export default function CatalogPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="mb-8">
        <nav className="flex text-xs text-slate-500 mb-3 font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
            <li><span className="mx-1 text-slate-300">/</span></li>
            <li className="text-slate-900 font-semibold">Каталог</li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">3D Принтеры и оборудование</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-500 text-sm font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">{mockProducts.length} товаров</span>
            <select className="appearance-none bg-white border border-slate-300 text-slate-800 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-slate-900 font-semibold cursor-pointer shadow-sm">
              <option>Сначала популярные</option>
              <option>Сначала новинки</option>
              <option>Сначала дешёвые</option>
              <option>Сначала дорогие</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="hidden lg:flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm sticky top-[100px] max-h-[calc(100vh-140px)] overflow-hidden">
            <div className="overflow-y-auto p-5 space-y-1">
              <div className="mb-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Категории</h3>
                <ul className="space-y-1 text-sm font-medium text-slate-600">
                  <li><a href="#" className="flex justify-between items-center text-slate-900 bg-slate-100 rounded-lg px-3 py-2">
                    <span className="font-bold">Все принтеры</span>
                    <span className="text-[10px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded shadow-sm">124</span>
                  </a></li>
                  <li><a href="#" className="flex justify-between items-center hover:bg-slate-50 rounded-lg px-3 py-2 transition">FDM принтеры <span className="text-[10px] text-slate-400">86</span></a></li>
                  <li><a href="#" className="flex justify-between items-center hover:bg-slate-50 rounded-lg px-3 py-2 transition">Фотополимерные (SLA) <span className="text-[10px] text-slate-400">28</span></a></li>
                  <li><a href="#" className="flex justify-between items-center hover:bg-slate-50 rounded-lg px-3 py-2 transition">Промышленные <span className="text-[10px] text-slate-400">10</span></a></li>
                </ul>
              </div>

              <hr className="border-slate-100" />

              <div className="py-2">
                <label className="flex items-center gap-3 cursor-pointer px-1">
                  <input type="checkbox" className="filter-checkbox" defaultChecked />
                  <span className="text-sm font-semibold text-slate-700">В наличии на складе</span>
                </label>
              </div>

              <hr className="border-slate-100" />

              <div className="py-2">
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4 px-1">Цена, BYN</h3>
                <div className="flex items-center gap-2 px-1">
                  <input type="number" defaultValue={650} className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm font-semibold text-center shadow-sm" />
                  <span className="text-slate-300 font-bold">—</span>
                  <input type="number" placeholder="до" className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm font-semibold text-center shadow-sm" />
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="py-2">
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-3 px-1">Бренд</h3>
                <div className="space-y-3 px-1">
                  {['Bambu Lab', 'Creality', 'Anycubic', 'Elegoo', 'Phrozen'].map((b) => (
                    <label key={b} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="filter-checkbox" />
                      <span className="text-sm text-slate-600 flex-1">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition text-sm shadow-md mb-2">Применить</button>
              <button className="w-full text-xs text-slate-500 hover:text-slate-800 font-semibold py-2 transition">Сбросить фильтры</button>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {mockProducts.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>

          <div className="mt-10 mb-6 flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
            <button className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-md">1</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center text-sm font-semibold shadow-sm">2</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center text-sm font-semibold shadow-sm">3</button>
            <span className="text-slate-400 px-2 font-bold">...</span>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center text-sm font-semibold shadow-sm">8</button>
          </div>
        </div>
      </div>
    </main>
  )
}
