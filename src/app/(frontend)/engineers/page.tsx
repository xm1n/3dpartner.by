import Link from 'next/link'
import { ArrowRight, Users, Briefcase, TrendingUp, FileCheck, Coins, Shield, Zap } from 'lucide-react'

export default function EngineersPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-slate-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Биржа Инженеров 3D Partner
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl">
            Связываем инженеров, заказчиков и производство. От идеи до готовой детали — в одной экосистеме.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            Ценность для участников
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 hover:border-purple-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Для клиентов
              </h3>
              <p className="text-slate-600">
                Комплексное решение: от сломанной детали до напечатанной замены. Разработка модели, проверка и печать на ферме.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 hover:border-purple-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Для инженеров
              </h3>
              <p className="text-slate-600">
                Стабильный поток заказов и пассивный доход с роялти. Монетизируйте модели без активных продаж.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 hover:border-purple-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Для бизнеса
              </h3>
              <p className="text-slate-600">
                Комиссия с сделок, гарантированные заказы на печать, расширение каталога моделей.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-2xl font-bold mb-12">
            Сценарии работы
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                <FileCheck className="w-6 h-6" />
                Кастомный заказ
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">1</span>
                  <span>Создание задачи с описанием и ТЗ</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Инженер откликается и согласовывает условия</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">3</span>
                  <span>Безопасная сделка через платформу</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">4</span>
                  <span>Разработка и согласование в 3D-просмотрщике</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">5</span>
                  <span>Печать на ферме 3D Partner</span>
                </li>
              </ol>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                <Coins className="w-6 h-6" />
                Пассивный доход (Роялти)
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">1</span>
                  <span>Загрузка модели в каталог</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Установка цены и условий</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">3</span>
                  <span>Кнопка «Печать» в каталоге для клиентов</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">4</span>
                  <span>Роялти с каждой печати автоматически</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            Уникальные возможности
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Printability Score</h3>
              <p className="text-slate-600 text-sm">
                Оценка готовности модели к печати для быстрой проверки качества.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Защита IP (сейф моделей)</h3>
              <p className="text-slate-600 text-sm">
                Хранение исходников в защищённом хранилище с контролем доступа.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">B2B-интеграция</h3>
              <p className="text-slate-600 text-sm">
                Подключение корпоративных клиентов к каталогу и заказам.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-xl transition"
            >
              Стать инженером <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/engineers/portal"
              className="inline-flex items-center gap-2 border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 font-bold px-8 py-4 rounded-xl transition"
            >
              Заказать разработку <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
