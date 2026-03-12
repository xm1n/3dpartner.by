'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Upload, X, FileText, Image } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

async function uploadMedia(file: File): Promise<number | string> {
  const form = new FormData()
  form.append('file', file)
  form.append('alt', file.name)
  const res = await fetch('/api/media', {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.errors?.[0]?.message || err.message || 'Ошибка загрузки')
  }
  const doc = await res.json()
  return doc.doc?.id ?? doc.id
}

export default function NewEngineerProjectPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)
  const sourceInputRef = useRef<HTMLInputElement>(null)
  const rendersInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    licenseType: 'free',
    licensePrice: '',
    royaltyPercent: '10',
    printabilityScore: '' as string | number,
    sourceFiles: [] as { file: number | string; version: string }[],
    renders: [] as { image: number | string }[],
    printSpecs: {
      material: '',
      infill: '',
      supports: false,
      notes: '',
    },
  })

  const isEngineer = user?.role === 'engineer'

  const addSourceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(file.name)
    try {
      const id = await uploadMedia(file)
      setForm((f) => ({
        ...f,
        sourceFiles: [...f.sourceFiles, { file: id, version: '' }],
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить файл')
    } finally {
      setUploadingFile(null)
      e.target.value = ''
    }
  }

  const addRender = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(file.name)
    try {
      const id = await uploadMedia(file)
      setForm((f) => ({
        ...f,
        renders: [...f.renders, { image: id }],
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить изображение')
    } finally {
      setUploadingFile(null)
      e.target.value = ''
    }
  }

  const removeSourceFile = (index: number) => {
    setForm((f) => ({
      ...f,
      sourceFiles: f.sourceFiles.filter((_, i) => i !== index),
    }))
  }

  const removeRender = (index: number) => {
    setForm((f) => ({
      ...f,
      renders: f.renders.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Введите название проекта')
      return
    }
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        title: form.title.trim(),
        status: 'draft',
        licenseType: form.licenseType,
        royaltyPercent: form.royaltyPercent ? Number(form.royaltyPercent) : 10,
        sourceFiles: form.sourceFiles.length ? form.sourceFiles : undefined,
        renders: form.renders.length ? form.renders : undefined,
        printSpecs: {
          material: form.printSpecs.material || undefined,
          infill: form.printSpecs.infill || undefined,
          supports: form.printSpecs.supports,
          notes: form.printSpecs.notes || undefined,
        },
      }
      if (form.slug.trim()) body.slug = form.slug.trim()
      if (form.description.trim()) body.description = form.description.trim()
      if (form.licenseType === 'paid' && form.licensePrice) body.licensePrice = Number(form.licensePrice)
      if (form.printabilityScore !== '' && form.printabilityScore !== undefined) {
        body.printabilityScore = Number(form.printabilityScore)
      }
      const res = await fetch('/api/engineer-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.errors?.[0]?.message || data.message || 'Ошибка сохранения')
      }
      const doc = await res.json()
      router.push(`/engineers/portal/projects/${doc.doc?.id ?? doc.id ?? ''}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать проект')
    } finally {
      setSubmitting(false)
    }
  }

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

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px] max-w-2xl">
      <Link href="/engineers/portal/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Назад к проектам
      </Link>
      <h1 className="text-2xl font-black text-slate-900 mb-6">Новый проект</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Основные поля */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Основное</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">
              Название проекта *
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Например: Кронштейн для монитора"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-slate-700 mb-1">
              URL (slug)
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Оставьте пустым — подставится автоматически"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">
              Описание
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[120px]"
              placeholder="Кратко опишите модель и назначение"
            />
          </div>
        </section>

        {/* Исходные файлы */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Исходные файлы (STL / STEP)
          </h2>
          <input
            ref={sourceInputRef}
            type="file"
            accept=".stl,.step,.stp,model/stl,application/octet-stream"
            className="hidden"
            onChange={addSourceFile}
          />
          {form.sourceFiles.length > 0 && (
            <ul className="space-y-2 mb-2">
              {form.sourceFiles.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Файл #{i + 1}</span>
                  <input
                    type="text"
                    placeholder="Версия"
                    value={item.version}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sourceFiles: f.sourceFiles.map((s, j) => (j === i ? { ...s, version: e.target.value } : s)),
                      }))
                    }
                    className="ml-auto w-24 px-2 py-1 border border-slate-200 rounded text-xs"
                  />
                  <button type="button" onClick={() => removeSourceFile(i)} className="p-1 text-slate-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => sourceInputRef.current?.click()}
            disabled={!!uploadingFile}
            className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-purple-400 hover:text-purple-700 transition"
          >
            {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingFile ? `Загрузка ${uploadingFile}...` : 'Добавить файл'}
          </button>
        </section>

        {/* Рендеры / Фото */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Рендеры / Фото
          </h2>
          <input
            ref={rendersInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={addRender}
          />
          {form.renders.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-2">
              {form.renders.map((_, i) => (
                <li key={i} className="relative w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => removeRender(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-slate-700 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => rendersInputRef.current?.click()}
            disabled={!!uploadingFile}
            className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-purple-400 hover:text-purple-700 transition"
          >
            {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingFile ? 'Загрузка...' : 'Добавить изображение'}
          </button>
        </section>

        {/* Лицензия и роялти */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Лицензия</h2>
          <div>
            <label htmlFor="licenseType" className="block text-sm font-semibold text-slate-700 mb-1">
              Тип лицензии
            </label>
            <select
              id="licenseType"
              value={form.licenseType}
              onChange={(e) => setForm((f) => ({ ...f, licenseType: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="free">Бесплатно</option>
              <option value="paid">Платная лицензия</option>
              <option value="print_only">Только печать (без скачивания)</option>
            </select>
          </div>
          {form.licenseType === 'paid' && (
            <div>
              <label htmlFor="licensePrice" className="block text-sm font-semibold text-slate-700 mb-1">
                Цена лицензии (BYN)
              </label>
              <input
                id="licensePrice"
                type="number"
                min="0"
                step="0.01"
                value={form.licensePrice}
                onChange={(e) => setForm((f) => ({ ...f, licensePrice: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="royaltyPercent" className="block text-sm font-semibold text-slate-700 mb-1">
              Роялти с печати (%)
            </label>
            <input
              id="royaltyPercent"
              type="number"
              min="0"
              max="50"
              value={form.royaltyPercent}
              onChange={(e) => setForm((f) => ({ ...f, royaltyPercent: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="printabilityScore" className="block text-sm font-semibold text-slate-700 mb-1">
              Рейтинг печатаемости (0–5)
            </label>
            <input
              id="printabilityScore"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.printabilityScore}
              onChange={(e) => setForm((f) => ({ ...f, printabilityScore: e.target.value === '' ? '' : e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Не указан"
            />
          </div>
        </section>

        {/* Рекомендации к печати */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Рекомендации к печати
          </h2>
          <div>
            <label htmlFor="material" className="block text-sm font-semibold text-slate-700 mb-1">
              Рекомендуемый материал
            </label>
            <input
              id="material"
              type="text"
              value={form.printSpecs.material}
              onChange={(e) => setForm((f) => ({ ...f, printSpecs: { ...f.printSpecs, material: e.target.value } }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="PLA, PETG, ABS..."
            />
          </div>
          <div>
            <label htmlFor="infill" className="block text-sm font-semibold text-slate-700 mb-1">
              Заполнение
            </label>
            <input
              id="infill"
              type="text"
              value={form.printSpecs.infill}
              onChange={(e) => setForm((f) => ({ ...f, printSpecs: { ...f.printSpecs, infill: e.target.value } }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="20%, сетка..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="supports"
              type="checkbox"
              checked={form.printSpecs.supports}
              onChange={(e) => setForm((f) => ({ ...f, printSpecs: { ...f.printSpecs, supports: e.target.checked } }))}
              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="supports" className="text-sm font-semibold text-slate-700">
              Нужны поддержки
            </label>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1">
              Примечания
            </label>
            <textarea
              id="notes"
              value={form.printSpecs.notes}
              onChange={(e) => setForm((f) => ({ ...f, printSpecs: { ...f.printSpecs, notes: e.target.value } }))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
              placeholder="Дополнительные рекомендации по печати"
            />
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-lg transition flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Создать проект
          </button>
          <Link
            href="/engineers/portal/projects"
            className="inline-flex items-center px-6 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Отмена
          </Link>
        </div>
      </form>
    </main>
  )
}
