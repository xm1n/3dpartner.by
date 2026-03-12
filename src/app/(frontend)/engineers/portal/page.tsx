'use client'

import Link from 'next/link'
import { Folder, CheckSquare, Wallet, Upload } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

export default function EngineersPortalPage() {
  const { user, loading } = useAuth()
  const isEngineer = user?.role === 'engineer'
  const hasAccess = isEngineer

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <h1 className="text-3xl font-black text-slate-900">
        Портал автора
      </h1>

      {!loading && !hasAccess && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-xl">
          <p className="text-slate-700">
            Войдите в аккаунт инженера для доступа к порталу.{' '}
            <Link href="/login" className="font-semibold text-amber-700 hover:text-amber-800 underline">
              Войти
            </Link>
          </p>
        </div>
      )}

      {hasAccess && (
        <p className="mt-2 text-slate-600">
          Добро пожаловать, {user?.firstName}. Управляйте проектами, задачами и выплатами.
        </p>
      )}

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Link
          href={hasAccess ? "/engineers/portal/projects" : "#"}
          className={`block p-6 rounded-2xl border transition ${
            hasAccess
              ? 'bg-slate-50 border-slate-200 hover:border-purple-200 hover:shadow-md cursor-pointer'
              : 'bg-slate-50/60 border-slate-100 cursor-not-allowed opacity-75'
          }`}
          onClick={e => !hasAccess && e.preventDefault()}
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <Folder className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Мои проекты</h2>
          <p className="text-slate-600 text-sm mt-1">
            Управление моделями и каталогом
          </p>
        </Link>
        <Link
          href={hasAccess ? "/engineers/portal/tasks" : "#"}
          className={`block p-6 rounded-2xl border transition ${
            hasAccess
              ? 'bg-slate-50 border-slate-200 hover:border-purple-200 hover:shadow-md cursor-pointer'
              : 'bg-slate-50/60 border-slate-100 cursor-not-allowed opacity-75'
          }`}
          onClick={e => !hasAccess && e.preventDefault()}
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <CheckSquare className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Мои задачи</h2>
          <p className="text-slate-600 text-sm mt-1">
            Заказы и отклики на задания
          </p>
        </Link>
        <Link
          href={hasAccess ? "/engineers/portal/balance" : "#"}
          className={`block p-6 rounded-2xl border transition ${
            hasAccess
              ? 'bg-slate-50 border-slate-200 hover:border-purple-200 hover:shadow-md cursor-pointer'
              : 'bg-slate-50/60 border-slate-100 cursor-not-allowed opacity-75'
          }`}
          onClick={e => !hasAccess && e.preventDefault()}
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Баланс и выплаты</h2>
          <p className="text-slate-600 text-sm mt-1">
            Роялти и история транзакций
          </p>
        </Link>
      </div>

      <div className="mt-12 p-4 bg-slate-100 rounded-xl inline-flex items-center gap-2">
        <Upload className="w-5 h-5 text-slate-500" />
        <span className="text-sm font-medium text-slate-600">
          {hasAccess ? 'Раздел в разработке — функционал появится позже' : 'Раздел находится в разработке'}
        </span>
      </div>
    </main>
  )
}
