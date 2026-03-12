import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  labels: { singular: 'Акция', plural: 'Акции и промокоды' },
  admin: {
    useAsTitle: 'name',
    group: 'Маркетинг',
    defaultColumns: ['name', 'type', 'code', 'active', 'validUntil'],
  },
  access: {
    read: isAdminOrManager,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название акции', required: true },
    {
      name: 'type',
      type: 'select',
      label: 'Тип',
      required: true,
      options: [
        { label: 'Промокод — скидка %', value: 'promo_percent' },
        { label: 'Промокод — скидка BYN', value: 'promo_fixed' },
        { label: 'Промокод — бесплатная доставка', value: 'promo_shipping' },
        { label: 'Правило корзины — автоскидка', value: 'cart_rule' },
      ],
    },
    { name: 'code', type: 'text', label: 'Промокод', admin: { condition: (data) => data?.type?.startsWith('promo') } },
    { name: 'discountValue', type: 'number', label: 'Размер скидки', min: 0 },
    { name: 'minOrderAmount', type: 'number', label: 'Мин. сумма заказа (BYN)', min: 0 },
    { name: 'minQuantity', type: 'number', label: 'Мин. количество товаров', min: 0 },
    { name: 'applicableCategories', type: 'relationship', relationTo: 'categories', hasMany: true, label: 'Категории' },
    { name: 'usageLimit', type: 'number', label: 'Лимит использований', min: 0 },
    { name: 'usedCount', type: 'number', label: 'Использовано', defaultValue: 0, admin: { readOnly: true } },
    { name: 'validFrom', type: 'date', label: 'Действует с' },
    { name: 'validUntil', type: 'date', label: 'Действует до' },
    { name: 'active', type: 'checkbox', label: 'Активна', defaultValue: true, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
