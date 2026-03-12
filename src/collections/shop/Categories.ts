import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager } from '@/access/roles'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Магазин',
    defaultColumns: ['title', 'parent', 'slug'],
  },
  access: {
    read: anyone,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    { name: 'slug', type: 'text', label: 'URL (slug)', required: true, unique: true },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Родительская категория',
      admin: { position: 'sidebar' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение' },
    { name: 'description', type: 'textarea', label: 'Описание' },
    { name: 'sortOrder', type: 'number', label: 'Порядок сортировки', defaultValue: 0 },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
  ],
}
