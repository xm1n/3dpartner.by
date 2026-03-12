import type { CollectionConfig } from 'payload'
import { isAdminOrManager, isAdminOrPublished } from '@/access/roles'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Статья', plural: 'Статьи' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'articleCategory', '_status', 'author', 'publishedAt'],
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
    {
      name: 'articleCategory',
      type: 'select',
      label: 'Раздел',
      options: [
        { label: 'База знаний', value: 'knowledge' },
        { label: 'Новости', value: 'news' },
        { label: 'Обзоры', value: 'reviews' },
        { label: 'Инструкции', value: 'tutorials' },
      ],
    },
    { name: 'excerpt', type: 'textarea', label: 'Краткое описание' },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Обложка' },
    { name: 'content', type: 'richText', label: 'Содержимое' },
    { name: 'author', type: 'relationship', relationTo: 'users', label: 'Автор' },
    { name: 'publishedAt', type: 'date', label: 'Дата публикации' },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
  ],
  timestamps: true,
}
