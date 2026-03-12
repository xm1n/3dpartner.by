import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager } from '@/access/roles'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  admin: {
    useAsTitle: 'title',
    group: 'Магазин',
    defaultColumns: ['title', 'catalog', 'parent', 'slug', 'sortOrder'],
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
      name: 'catalog',
      type: 'relationship',
      relationTo: 'catalogs',
      label: 'Каталог',
      admin: { position: 'sidebar', description: 'К какому каталогу относится категория' },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Родительская категория',
      admin: { position: 'sidebar' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение' },
    { name: 'description', type: 'textarea', label: 'Описание' },
    {
      name: 'carouselSlides',
      type: 'array',
      label: 'Карусель преимуществ на странице товара',
      admin: { description: 'Слайды карусели для товаров этой категории. Если пусто — показывается общая карусель.' },
      fields: [
        { name: 'icon', type: 'text', label: 'Иконка (эмодзи)', admin: { description: 'Например: 🌿 📦 🎯' } },
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'textarea', label: 'Текст', required: true },
      ],
    },
    { name: 'sortOrder', type: 'number', label: 'Порядок сортировки', defaultValue: 0 },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
  ],
}
