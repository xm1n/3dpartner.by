import type { CollectionConfig } from 'payload'
import { isAdminOrManager, isLoggedIn } from '@/access/roles'

export const PrintOrders: CollectionConfig = {
  slug: 'print-orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Производство',
    defaultColumns: ['orderNumber', 'status', 'customer', 'material', 'estimatedPrice', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      return { customer: { equals: user.id } }
    },
    create: isLoggedIn,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'orderNumber', type: 'text', label: 'Номер заказа', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'new',
      options: [
        { label: 'Новый', value: 'new' },
        { label: 'На оценке', value: 'estimating' },
        { label: 'Согласование', value: 'approval' },
        { label: 'Оплачен', value: 'paid' },
        { label: 'Слайсинг', value: 'slicing' },
        { label: 'Печатается', value: 'printing' },
        { label: 'Постобработка', value: 'postprocessing' },
        { label: 'Готово', value: 'ready' },
        { label: 'Выдан', value: 'delivered' },
        { label: 'Отменён', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'customer', type: 'relationship', relationTo: 'users', label: 'Клиент' },
    {
      name: 'files',
      type: 'array',
      label: 'STL/OBJ файлы',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        { name: 'fileName', type: 'text', label: 'Оригинальное имя' },
      ],
    },
    {
      name: 'printParams',
      type: 'group',
      label: 'Параметры печати',
      fields: [
        { name: 'material', type: 'text', label: 'Материал' },
        { name: 'color', type: 'text', label: 'Цвет' },
        { name: 'infill', type: 'number', label: 'Заполнение (%)', min: 0, max: 100 },
        { name: 'layerHeight', type: 'number', label: 'Высота слоя (мм)' },
        { name: 'quantity', type: 'number', label: 'Количество копий', min: 1, defaultValue: 1 },
        { name: 'needSupports', type: 'checkbox', label: 'Нужны поддержки' },
      ],
    },
    {
      name: 'estimation',
      type: 'group',
      label: 'Расчёт стоимости',
      fields: [
        { name: 'volumeCm3', type: 'number', label: 'Объём (см³)' },
        { name: 'weightGrams', type: 'number', label: 'Вес (г)' },
        { name: 'printTimeMinutes', type: 'number', label: 'Время печати (мин)' },
        { name: 'estimatedPrice', type: 'number', label: 'Расчётная стоимость (BYN)' },
      ],
    },
    { name: 'customerNote', type: 'textarea', label: 'Комментарий клиента' },
    { name: 'internalNote', type: 'textarea', label: 'Внутренний комментарий', admin: { position: 'sidebar' } },
    { name: 'yougileTaskId', type: 'text', label: 'ID задачи YouGile', admin: { position: 'sidebar', readOnly: true } },
    { name: 'productionCard', type: 'relationship', relationTo: 'production-cards', label: 'Тех. карта', admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
