import { MapPin, Clock } from 'lucide-react'

export function TopBar() {
  return (
    <div className="bg-slate-900 text-slate-400 text-xs py-2 hidden md:block border-b border-slate-800">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-[1400px]">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            г. Минск, ул. Технологическая, 1
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Пн-Пт: 9:00 - 18:00
          </span>
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-white transition">О компании</a>
          <a href="/knowledge" className="hover:text-white transition">Доставка и оплата</a>
          <a href="/b2b" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1">B2B Портал</a>
          <a href="/engineers" className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1">Инженерам</a>
        </div>
      </div>
    </div>
  )
}
