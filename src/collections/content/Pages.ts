import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager, isAdminOrPublished } from '@/access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Страница', plural: 'Страницы' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  versions: { drafts: true },
  access: {
    read: isAdminOrPublished,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'slug', type: 'text', label: 'URL (slug)', required: true, unique: true },
    { name: 'content', type: 'richText', label: 'Содержимое' },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
  ],
  timestamps: true,
}
