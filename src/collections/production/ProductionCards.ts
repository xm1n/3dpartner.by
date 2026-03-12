import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const ProductionCards: CollectionConfig = {
  slug: 'production-cards',
  labels: { singular: 'Тех. карта', plural: 'Тех. карты' },
  admin: {
    useAsTitle: 'title',
    group: 'Производство',
    defaultColumns: ['title', 'status', 'printer', 'createdAt'],
  },
  access: {
    read: isAdminOrManager,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название карты', required: true },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'draft',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Ожидает печати', value: 'queued' },
        { label: 'Слайсинг', value: 'slicing' },
        { label: 'Печатается', value: 'printing' },
        { label: 'Постобработка', value: 'postprocessing' },
        { label: 'Готово', value: 'completed' },
        { label: 'Брак', value: 'defect' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'sourceFiles',
      type: 'array',
      label: 'Исходные файлы (STL/OBJ)',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'gcodeFiles',
      type: 'array',
      label: 'G-code файлы',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        { name: 'printerModel', type: 'text', label: 'Модель принтера' },
      ],
    },
    { name: 'instructions', type: 'richText', label: 'Инструкции оператору' },
    { name: 'postprocessingNotes', type: 'textarea', label: 'Требования к постобработке' },
    { name: 'printer', type: 'relationship', relationTo: 'printers', label: 'Принтер' },
    { name: 'materialUsed', type: 'relationship', relationTo: 'farm-materials', label: 'Материал (катушка)' },
    { name: 'gramsUsed', type: 'number', label: 'Расход материала (г)', min: 0 },
    { name: 'yougileTaskId', type: 'text', label: 'ID задачи YouGile', admin: { position: 'sidebar', readOnly: true } },
  ],
  timestamps: true,
}
