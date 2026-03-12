import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const Printers: CollectionConfig = {
  slug: 'printers',
  admin: {
    useAsTitle: 'name',
    group: 'Производство',
    defaultColumns: ['name', 'model', 'status', 'printHours'],
  },
  access: {
    read: isAdminOrManager,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название (ID)', required: true },
    { name: 'model', type: 'text', label: 'Модель', required: true },
    { name: 'manufacturer', type: 'text', label: 'Производитель' },
    {
      name: 'type',
      type: 'select',
      label: 'Тип',
      options: [
        { label: 'FDM', value: 'fdm' },
        { label: 'SLA/DLP', value: 'sla' },
        { label: 'SLS', value: 'sls' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'idle',
      options: [
        { label: 'Свободен', value: 'idle' },
        { label: 'Печатает', value: 'printing' },
        { label: 'На ТО', value: 'maintenance' },
        { label: 'Неисправен', value: 'broken' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'printHours', type: 'number', label: 'Моточасы', min: 0, defaultValue: 0 },
    { name: 'printVolume', type: 'text', label: 'Область печати (мм)', admin: { description: '300x300x300' } },
    { name: 'notes', type: 'textarea', label: 'Заметки' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото' },
  ],
  timestamps: true,
}
