import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const B2BPriceLists: CollectionConfig = {
  slug: 'b2b-pricelists',
  labels: { singular: 'Прайс-лист', plural: 'Прайс-листы' },
  admin: {
    useAsTitle: 'name',
    group: 'B2B / Опт',
    description: 'Конфигурации выгрузки прайс-листов для оптовых клиентов',
  },
  access: {
    read: isAdminOrManager,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название конфигурации', required: true },
    {
      name: 'format',
      type: 'select',
      label: 'Формат выгрузки',
      required: true,
      options: [
        { label: 'XML (YML)', value: 'xml' },
        { label: 'CSV', value: 'csv' },
        { label: 'JSON', value: 'json' },
      ],
    },
    { name: 'client', type: 'relationship', relationTo: 'b2b-clients', label: 'B2B-клиент' },
    {
      name: 'filterCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Категории для включения',
    },
    {
      name: 'filterBrands',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
      label: 'Бренды для включения',
    },
    { name: 'onlyB2BAvailable', type: 'checkbox', label: 'Только товары с флагом «Доступно для опта»', defaultValue: true },
    { name: 'includeOutOfStock', type: 'checkbox', label: 'Включать товары без остатков', defaultValue: false },
    {
      name: 'priceRule',
      type: 'select',
      label: 'Правило ценообразования',
      options: [
        { label: 'Базовая цена', value: 'base' },
        { label: 'Скидка клиента', value: 'client_discount' },
        { label: 'Наценка %', value: 'markup' },
      ],
    },
    { name: 'markupPercent', type: 'number', label: 'Наценка (%)', admin: { condition: (data) => data?.priceRule === 'markup' } },
    { name: 'active', type: 'checkbox', label: 'Активен', defaultValue: true },
  ],
  timestamps: true,
}
