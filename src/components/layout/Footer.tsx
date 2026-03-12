import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white text-slate-500 py-12 border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-2 mb-4 text-slate-900 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm shadow-sm">3D</div>
            <span>PARTNER</span>
          </Link>
          <p className="text-xs mb-6 max-w-sm leading-relaxed">
            Профессиональная платформа аддитивных технологий. Поставка оборудования, серийное производство и инженерные разработки.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition text-xs font-bold">VK</a>
            <a href="#" className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition text-xs font-bold">TG</a>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-[10px]">Магазин</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><Link href="/catalog" className="hover:text-blue-600 transition">Каталог товаров</Link></li>
            <li><a href="#" className="hover:text-blue-600 transition">Оплата и доставка</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Гарантия и возврат</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Бренды</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-[10px]">Экосистема</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><Link href="/calculator" className="hover:text-blue-600 transition">Калькулятор 3D-печати</Link></li>
            <li><Link href="/b2b" className="text-blue-600 hover:text-blue-800 transition">B2B Оптовый портал</Link></li>
            <li><Link href="/engineers" className="text-purple-600 hover:text-purple-800 transition">Портал Инженеров</Link></li>
            <li><Link href="/knowledge" className="hover:text-blue-600 transition">База знаний</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-[10px]">Контакты</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li>
              <div className="text-slate-900 font-bold">+375 (29) 111-22-33</div>
              <div className="text-[10px] mt-0.5">Пн-Пт: 9:00 - 18:00</div>
            </li>
            <li><a href="mailto:info@3dpartner.by" className="hover:text-blue-600 transition">info@3dpartner.by</a></li>
            <li>г. Минск, ул. Технологическая, 1, офис 404</li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] mt-10 pt-6 border-t border-slate-100 text-[10px] flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} ООО &quot;3Д Партнер&quot;. Все права защищены.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-900 transition">Политика конфиденциальности</a>
          <a href="#" className="hover:text-slate-900 transition">Договор оферты</a>
        </div>
      </div>
    </footer>
  )
}
