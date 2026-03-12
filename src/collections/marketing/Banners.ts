import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager } from '@/access/roles'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Баннер', plural: 'Баннеры' },
  admin: {
    useAsTitle: 'title',
    group: 'Маркетинг',
    defaultColumns: ['title', 'position', 'active', 'showFrom', 'showUntil'],
  },
  access: {
    read: anyone,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'subtitle', type: 'text', label: 'Подзаголовок' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение', required: true },
    { name: 'link', type: 'text', label: 'Ссылка' },
    { name: 'buttonText', type: 'text', label: 'Текст кнопки' },
    {
      name: 'position',
      type: 'select',
      label: 'Позиция',
      required: true,
      options: [
        { label: 'Главный баннер (hero)', value: 'hero' },
        { label: 'Баннер в мегаменю', value: 'megamenu' },
        { label: 'Баннер в каталоге', value: 'catalog' },
        { label: 'Поп-ап', value: 'popup' },
      ],
    },
    { name: 'badgeText', type: 'text', label: 'Бейдж (Акция / Новинка)' },
    { name: 'badgeColor', type: 'text', label: 'Цвет бейджа', admin: { description: 'Tailwind класс: bg-red-500' } },
    { name: 'sortOrder', type: 'number', label: 'Порядок', defaultValue: 0 },
    { name: 'showFrom', type: 'date', label: 'Показывать с' },
    { name: 'showUntil', type: 'date', label: 'Показывать до' },
    { name: 'active', type: 'checkbox', label: 'Активен', defaultValue: true, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
