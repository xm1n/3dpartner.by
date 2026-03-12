import type { CollectionConfig } from 'payload'
import { isEngineer, isAdminOrManager, isAdminOrPublished } from '@/access/roles'

export const EngineerProjects: CollectionConfig = {
  slug: 'engineer-projects',
  admin: {
    useAsTitle: 'title',
    group: 'Инженеры',
    defaultColumns: ['title', 'author', 'status', 'licenseType', 'printabilityScore', 'createdAt'],
  },
  versions: { drafts: true },
  access: {
    read: isAdminOrPublished,
    create: isEngineer,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      return { author: { equals: user.id } }
    },
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название проекта', required: true },
    { name: 'slug', type: 'text', label: 'URL (slug)', required: true, unique: true },
    { name: 'author', type: 'relationship', relationTo: 'users', label: 'Автор', required: true },
    { name: 'description', type: 'richText', label: 'Описание' },
    {
      name: 'status',
      type: 'select',
      label: 'Статус модерации',
      defaultValue: 'draft',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'На модерации', value: 'review' },
        { label: 'Одобрен', value: 'approved' },
        { label: 'Отклонён', value: 'rejected' },
        { label: 'Опубликован в каталоге', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'sourceFiles',
      type: 'array',
      label: 'Исходные файлы (STL/STEP)',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        { name: 'version', type: 'text', label: 'Версия' },
      ],
    },
    {
      name: 'renders',
      type: 'array',
      label: 'Рендеры / Фото',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'licenseType',
      type: 'select',
      label: 'Тип лицензии',
      defaultValue: 'free',
      options: [
        { label: 'Бесплатно', value: 'free' },
        { label: 'Платная лицензия', value: 'paid' },
        { label: 'Только печать (без скачивания)', value: 'print_only' },
      ],
    },
    { name: 'licensePrice', type: 'number', label: 'Цена лицензии (BYN)', min: 0, admin: { condition: (data) => data?.licenseType === 'paid' } },
    { name: 'royaltyPercent', type: 'number', label: 'Роялти с печати (%)', min: 0, max: 50, defaultValue: 10 },
    { name: 'printabilityScore', type: 'number', label: 'Рейтинг печатаемости', min: 0, max: 5, admin: { position: 'sidebar' } },
    {
      name: 'printSpecs',
      type: 'group',
      label: 'Рекомендации к печати',
      fields: [
        { name: 'material', type: 'text', label: 'Рекомендуемый материал' },
        { name: 'infill', type: 'text', label: 'Заполнение' },
        { name: 'supports', type: 'checkbox', label: 'Нужны поддержки' },
        { name: 'notes', type: 'textarea', label: 'Примечания' },
      ],
    },
    { name: 'linkedProduct', type: 'relationship', relationTo: 'products', label: 'Товар в каталоге', admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
