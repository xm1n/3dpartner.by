import Link from 'next/link'
import { Upload, Layers, Box, Ruler, ArrowRight } from 'lucide-react'

const MATERIALS = [
  { id: 'pla', name: 'PLA' },
  { id: 'petg', name: 'PETG' },
  { id: 'abs', name: 'ABS' },
  { id: 'tpu', name: 'TPU' },
  { id: 'nylon', name: 'Nylon' },
  { id: 'resin', name: 'Смола' },
]

const INFILL_OPTIONS = [20, 40, 60, 80, 100]
const QUALITY_OPTIONS = [
  { id: 'draft', label: 'Черновое 0.3мм' },
  { id: 'standard', label: 'Стандарт 0.2мм' },
  { id: 'high', label: 'Высокое 0.12мм' },
]

export default function CalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <section className="mb-16">
        <h1 className="text-4xl font-black text-slate-900">
          Онлайн-калькулятор 3D-печати
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl">
          Загрузите STL файл и получите моментальный расчёт стоимости
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-600" />
            Материал
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MATERIALS.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition cursor-pointer text-center font-medium text-slate-700"
              >
                {m.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-slate-600" />
            Загрузка модели
          </h2>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition">
            <Box className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="font-medium text-slate-600">
              Загрузить STL файл
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Перетащите файл сюда или нажмите для выбора
            </p>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Точный расчёт появится после загрузки модели
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-slate-600" />
          Параметры печати
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-3">Заполнение (infill)</h3>
            <div className="flex flex-wrap gap-2">
              {INFILL_OPTIONS.map((pct) => (
                <div
                  key={pct}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition cursor-pointer text-sm font-medium text-slate-700"
                >
                  {pct}%
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-3">Качество</h3>
            <div className="flex flex-wrap gap-2">
              {QUALITY_OPTIONS.map((q) => (
                <div
                  key={q.id}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition cursor-pointer text-sm font-medium text-slate-700"
                >
                  {q.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-slate-100 border border-slate-200 mb-16 max-w-2xl">
        <h3 className="font-bold text-slate-900 mb-4">Информация</h3>
        <ul className="space-y-2 text-slate-700">
          <li>Минимальная сумма заказа: 20 BYN</li>
          <li>Срок изготовления: 1–5 рабочих дней</li>
        </ul>
      </section>

      <section className="p-6 rounded-2xl bg-purple-50 border border-purple-100 max-w-2xl">
        <p className="text-slate-700 mb-4">
          Нужна разработка модели? Обратитесь к нашим инженерам
        </p>
        <Link
          href="/engineers"
          className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition"
        >
          Биржа Инженеров <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </main>
  )
}
