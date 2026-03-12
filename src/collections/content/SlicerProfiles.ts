import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager } from '@/access/roles'

export const SlicerProfiles: CollectionConfig = {
  slug: 'slicer-profiles',
  labels: { singular: 'Профиль слайсера', plural: 'Профили слайсеров' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'printer', 'material', 'slicer'],
  },
  access: {
    read: anyone,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название профиля', required: true },
    { name: 'printer', type: 'text', label: 'Модель принтера', required: true },
    { name: 'material', type: 'text', label: 'Материал', required: true },
    {
      name: 'slicer',
      type: 'select',
      label: 'Слайсер',
      options: [
        { label: 'Bambu Studio', value: 'bambu_studio' },
        { label: 'OrcaSlicer', value: 'orcaslicer' },
        { label: 'PrusaSlicer', value: 'prusaslicer' },
        { label: 'Cura', value: 'cura' },
        { label: 'Другой', value: 'other' },
      ],
    },
    { name: 'profileFile', type: 'upload', relationTo: 'media', label: 'Файл профиля', required: true },
    { name: 'description', type: 'textarea', label: 'Описание и рекомендации' },
    { name: 'downloadCount', type: 'number', label: 'Скачиваний', defaultValue: 0, admin: { readOnly: true } },
  ],
  timestamps: true,
}
