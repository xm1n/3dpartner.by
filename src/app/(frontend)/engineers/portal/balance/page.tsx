import Link from 'next/link'
import { Wallet, ArrowLeft } from 'lucide-react'

export default function EngineersBalancePage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <Link href="/engineers/portal" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Назад в портал автора
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Баланс и выплаты</h1>
          <p className="text-slate-600 text-sm">Роялти и история транзакций</p>
        </div>
      </div>
      <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <p className="text-slate-600">Раздел в разработке</p>
      </div>
    </main>
  )
}
