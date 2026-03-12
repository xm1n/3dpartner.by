'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Folder, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  review: 'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонён',
  published: 'Опубликован',
}

export default function EngineerProjectDetailPage() {
  const params = useParams()
  const id = params?.id
  const { user, loading: authLoading } = useAuth()
  const [project, setProject] = useState<{ id: string; title: string; status: string; description?: unknown; licenseType?: string; createdAt?: string } | null>(null)
  const [loading, setLoading] = useState(!!id)
  const isEngineer = user?.role === 'engineer'

  useEffect(() => {
    if (!id || !isEngineer) {
      setLoading(false)
      return
    }
    fetch(`/api/engineer-projects/${id}?depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProject(data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [id, isEngineer])

  if (!authLoading && !isEngineer) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px]">
        <Link href="/engineers/portal/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад к проектам
        </Link>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-slate-700">Доступ только для авторов.</p>
        </div>
      </main>
    )
  }

  if (loading || !project) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px]">
        <Link href="/engineers/portal/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад к проектам
        </Link>
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          <span>{loading ? 'Загрузка...' : 'Проект не найден'}</span>
        </div>
      </main>
    )
  }

  const statusClass =
    project.status === 'draft'
      ? 'bg-slate-100 text-slate-700'
      : project.status === 'published'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-amber-100 text-amber-800'

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px] max-w-2xl">
      <Link href="/engineers/portal/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Назад к проектам
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <Folder className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{project.title}</h1>
          <span className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded ${statusClass}`}>
            {STATUS_LABELS[project.status] || project.status}
          </span>
        </div>
      </div>
      {project.createdAt && (
        <p className="text-sm text-slate-500 mb-6">
          Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}
        </p>
      )}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-slate-600 text-sm">Редактирование и загрузка файлов — в разработке.</p>
      </div>
    </main>
  )
}
