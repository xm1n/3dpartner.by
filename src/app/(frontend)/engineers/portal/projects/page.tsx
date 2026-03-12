'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Folder, ArrowLeft, Plus, FileText, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  review: 'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонён',
  published: 'Опубликован',
}

const STATUS_CLASS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  review: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  published: 'bg-blue-100 text-blue-800',
}

type Project = {
  id: number | string
  title: string
  slug: string
  status: string
  licenseType?: string
  createdAt: string
}

export default function EngineersProjectsPage() {
  const { user, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const isEngineer = user?.role === 'engineer'

  useEffect(() => {
    if (!isEngineer || !user) {
      setLoading(false)
      return
    }
    fetch('/api/engineer-projects?limit=50&depth=0', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => setProjects(data.docs || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [isEngineer, user])

  if (!authLoading && !isEngineer) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px]">
        <Link href="/engineers/portal" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад в портал автора
        </Link>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-slate-700">Доступ только для авторов. Войдите в аккаунт инженера.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <Link href="/engineers/portal" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Назад в портал автора
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Folder className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Мои проекты</h1>
            <p className="text-slate-600 text-sm">Управление моделями и каталогом</p>
          </div>
        </div>
        <Link
          href="/engineers/portal/projects/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-lg transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Создать проект
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">У вас пока нет проектов</p>
          <Link
            href="/engineers/portal/projects/new"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-lg transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Создать первый проект
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/engineers/portal/projects/${p.id}`}
                className="block p-5 rounded-xl border border-slate-200 bg-white hover:border-purple-200 hover:shadow-md transition"
              >
                <h3 className="font-bold text-slate-900 truncate">{p.title}</h3>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_CLASS[p.status] || 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABELS[p.status] || p.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('ru-RU') : ''}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
