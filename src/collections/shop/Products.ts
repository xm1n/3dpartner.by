import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager, isAdminOrPublished } from '@/access/roles'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    group: 'Магазин',
    defaultColumns: ['title', 'sku', 'price', 'brand', 'inStock', '_status'],
  },
  versions: { drafts: true },
  access: {
    read: isAdminOrPublished,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'URL (slug)',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    { name: 'sku', type: 'text', label: 'Артикул', admin: { position: 'sidebar' } },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      label: 'Бренд',
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Категории',
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Цены и наличие',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', label: 'Цена (BYN)', required: true, min: 0 },
                { name: 'oldPrice', type: 'number', label: 'Старая цена', min: 0 },
              ],
            },
            { name: 'inStock', type: 'checkbox', label: 'В наличии', defaultValue: true },
            { name: 'stockQuantity', type: 'number', label: 'Остаток (шт)', min: 0 },
            { name: 'availableForB2B', type: 'checkbox', label: 'Доступно для опта', defaultValue: false },
          ],
        },
        {
          label: 'Варианты (SKU)',
          fields: [
            {
              name: 'variants',
              type: 'array',
              label: 'Варианты',
              fields: [
                { name: 'variantName', type: 'text', label: 'Вариант (цвет/размер)' },
                { name: 'variantSku', type: 'text', label: 'Артикул варианта' },
                { name: 'variantPrice', type: 'number', label: 'Цена варианта', min: 0 },
                { name: 'variantStock', type: 'number', label: 'Остаток', min: 0 },
                { name: 'colorHex', type: 'text', label: 'HEX цвета', admin: { description: '#000000' } },
              ],
            },
          ],
        },
        {
          label: 'Характеристики',
          fields: [
            {
              name: 'specs',
              type: 'array',
              label: 'Характеристики',
              fields: [
                { name: 'specName', type: 'text', label: 'Параметр', required: true },
                { name: 'specValue', type: 'text', label: 'Значение', required: true },
              ],
            },
          ],
        },
        {
          label: 'Медиа',
          fields: [
            {
              name: 'images',
              type: 'array',
              label: 'Изображения',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text', label: 'Meta Title' },
            { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
          ],
        },
      ],
    },
    {
      name: 'badges',
      type: 'select',
      label: 'Бейджи',
      hasMany: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Хит продаж', value: 'bestseller' },
        { label: 'Новинка', value: 'new' },
        { label: 'Скидка', value: 'sale' },
        { label: 'Под заказ', value: 'preorder' },
      ],
    },
    {
      name: 'moyskladId',
      type: 'text',
      label: 'ID МойСклад',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
