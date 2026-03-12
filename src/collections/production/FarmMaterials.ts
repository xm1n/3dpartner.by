import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const FarmMaterials: CollectionConfig = {
  slug: 'farm-materials',
  labels: { singular: 'Материал', plural: 'Материалы (склад)' },
  admin: {
    useAsTitle: 'label',
    group: 'Производство',
    defaultColumns: ['label', 'materialType', 'color', 'remainingGrams'],
  },
  access: {
    read: isAdminOrManager,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'label', type: 'text', label: 'Название / Метка катушки', required: true },
    {
      name: 'materialType',
      type: 'select',
      label: 'Тип материала',
      required: true,
      options: [
        { label: 'PLA', value: 'pla' },
        { label: 'PETG', value: 'petg' },
        { label: 'ABS', value: 'abs' },
        { label: 'ASA', value: 'asa' },
        { label: 'TPU', value: 'tpu' },
        { label: 'Nylon / PA', value: 'nylon' },
        { label: 'PC', value: 'pc' },
        { label: 'Композит', value: 'composite' },
        { label: 'Смола (Resin)', value: 'resin' },
      ],
    },
    { name: 'brand', type: 'text', label: 'Производитель' },
    { name: 'color', type: 'text', label: 'Цвет' },
    { name: 'colorHex', type: 'text', label: 'HEX цвета' },
    { name: 'spoolWeightGrams', type: 'number', label: 'Вес катушки (г)', defaultValue: 1000 },
    { name: 'remainingGrams', type: 'number', label: 'Остаток (г)', required: true, min: 0 },
    { name: 'pricePerGram', type: 'number', label: 'Стоимость за грамм (BYN)' },
    { name: 'linkedProduct', type: 'relationship', relationTo: 'products', label: 'Товар в каталоге' },
    { name: 'notes', type: 'textarea', label: 'Заметки' },
  ],
  timestamps: true,
}
