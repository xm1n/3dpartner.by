import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager } from '@/access/roles'

export const Catalogs: CollectionConfig = {
  slug: 'catalogs',
  labels: { singular: 'Каталог', plural: 'Каталоги' },
  admin: {
    useAsTitle: 'title',
    group: 'Магазин',
    defaultColumns: ['title', 'slug', 'sortOrder'],
    description: 'Основные разделы магазина (напр. Принтеры, Материалы, Готовые изделия)',
  },
  access: {
    read: anyone,
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
      admin: { description: 'Напр. printers, materials, products' },
    },
    { name: 'description', type: 'textarea', label: 'Описание' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение / Иконка' },
    {
      name: 'icon',
      type: 'select',
      label: 'Иконка (встроенная)',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Принтер', value: 'printer' },
        { label: 'Катушка', value: 'spool' },
        { label: 'Куб', value: 'cube' },
        { label: 'Шестерёнка', value: 'gear' },
        { label: 'Инструменты', value: 'tools' },
        { label: 'Коробка', value: 'box' },
      ],
    },
    {
      name: 'showInNav',
      type: 'checkbox',
      label: 'Показывать в навигации с мега-меню',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    { name: 'sortOrder', type: 'number', label: 'Порядок сортировки', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'megamenuBanner',
      type: 'group',
      label: 'Баннер в мега-меню',
      admin: { description: 'Рекламный баннер, отображаемый справа в мега-меню навигации' },
      fields: [
        { name: 'bannerImage', type: 'upload', relationTo: 'media', label: 'Изображение баннера' },
        { name: 'bannerBadge', type: 'text', label: 'Бейдж (напр. «Акция недели»)' },
        { name: 'bannerTitle', type: 'text', label: 'Заголовок' },
        { name: 'bannerText', type: 'text', label: 'Описание' },
        { name: 'bannerLink', type: 'text', label: 'Ссылка' },
        { name: 'bannerLinkText', type: 'text', label: 'Текст ссылки', defaultValue: 'Подробнее' },
      ],
    },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
  ],
}
