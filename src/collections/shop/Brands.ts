import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager } from '@/access/roles'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    group: 'Магазин',
  },
  access: {
    read: anyone,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    { name: 'slug', type: 'text', label: 'URL (slug)', required: true, unique: true },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип' },
    { name: 'description', type: 'textarea', label: 'Описание' },
    { name: 'website', type: 'text', label: 'Сайт производителя' },
  ],
}
