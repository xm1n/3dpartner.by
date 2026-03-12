import Link from 'next/link'
import { Search, User, BarChart3, Heart, ShoppingCart } from 'lucide-react'
import { TopBar } from './TopBar'

export function Header() {
  return (
    <>
      <TopBar />
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200 relative">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-6 max-w-[1400px]">
          <Link href="/" className="text-xl font-black tracking-tight shrink-0 flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm shadow-sm">3D</div>
            <span className="hidden sm:block text-slate-900">PARTNER</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2">
            <Link href="/catalog" className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded font-medium text-sm items-center gap-2 transition shrink-0">
              <span>☰</span> Каталог
            </Link>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Поиск принтеров по модели или бренду..."
                className="w-full bg-slate-50 border border-slate-300 rounded py-2 px-3 pl-9 text-sm focus:outline-none focus:border-slate-500 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right hidden lg:block mr-2">
              <div className="font-bold text-sm text-slate-900 leading-none">+375 (29) 111-22-33</div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide">Пн-Пт: 9:00 - 18:00</div>
            </div>

            <div className="hidden md:flex items-center gap-5 pl-2 border-l border-slate-100">
              <Link href="/account" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition">
                <User className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Войти</span>
              </Link>
              <button className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition">
                <BarChart3 className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Сравнение</span>
              </button>
              <button className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition relative">
                <Heart className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Избранное</span>
              </button>
              <Link href="/cart" className="flex flex-col items-center text-slate-500 hover:text-slate-900 transition relative">
                <ShoppingCart className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Корзина</span>
              </Link>
            </div>
          </div>
        </div>

        <nav className="border-t border-slate-100 bg-white relative z-40">
          <div className="container mx-auto px-4 max-w-[1400px] hidden md:flex justify-between gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-full">
            <Link href="/catalog" className="py-3 flex items-center gap-1 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap">
              3D Принтеры и оборудование
            </Link>
            <Link href="/catalog" className="py-3 flex items-center gap-1 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap">
              Материалы для 3D
            </Link>
            <Link href="/catalog" className="py-3 flex items-center gap-1 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap">
              Готовые изделия и 3D модели
            </Link>
            <Link href="/calculator" className="py-3 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap">
              Услуги 3D-печати
            </Link>
            <Link href="/engineers" className="py-3 flex items-center gap-1.5 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Биржа Инженеров
            </Link>
            <Link href="/knowledge" className="py-3 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap">
              База знаний
            </Link>
          </div>
        </nav>
      </header>
    </>
  )
}
