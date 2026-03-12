import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrManager } from '@/access/roles'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Магазин',
    defaultColumns: ['orderNumber', 'status', 'customer', 'total', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      return { customer: { equals: user.id } }
    },
    create: () => true,
    update: isAdminOrManager,
    delete: isAdmin,
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
        { label: 'Подтверждён', value: 'confirmed' },
        { label: 'Оплачен', value: 'paid' },
        { label: 'Комплектуется', value: 'packing' },
        { label: 'Передан в доставку', value: 'shipping' },
        { label: 'Доставлен', value: 'delivered' },
        { label: 'Завершён', value: 'completed' },
        { label: 'Отменён', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'customer', type: 'relationship', relationTo: 'users', label: 'Клиент' },
    {
      name: 'items',
      type: 'array',
      label: 'Товары',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'variantName', type: 'text', label: 'Вариант' },
        { name: 'quantity', type: 'number', label: 'Кол-во', required: true, min: 1 },
        { name: 'unitPrice', type: 'number', label: 'Цена за шт', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'subtotal', type: 'number', label: 'Сумма товаров', min: 0 },
        { name: 'deliveryCost', type: 'number', label: 'Доставка', min: 0 },
        { name: 'total', type: 'number', label: 'Итого', min: 0 },
      ],
    },
    {
      name: 'delivery',
      type: 'group',
      label: 'Доставка',
      fields: [
        {
          name: 'method',
          type: 'select',
          label: 'Способ',
          options: [
            { label: 'Самовывоз', value: 'pickup' },
            { label: 'Курьер', value: 'courier' },
            { label: 'Европочта', value: 'europochta' },
            { label: 'Белпочта', value: 'belpochta' },
          ],
        },
        { name: 'address', type: 'textarea', label: 'Адрес доставки' },
        { name: 'trackingNumber', type: 'text', label: 'Трек-номер' },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      label: 'Оплата',
      fields: [
        {
          name: 'method',
          type: 'select',
          label: 'Способ',
          options: [
            { label: 'Карта онлайн', value: 'card' },
            { label: 'ЕРИП', value: 'erip' },
            { label: 'Безналичный расчёт (юрлицо)', value: 'invoice' },
            { label: 'Наличные (самовывоз)', value: 'cash' },
          ],
        },
        { name: 'paid', type: 'checkbox', label: 'Оплачен' },
      ],
    },
    { name: 'customerNote', type: 'textarea', label: 'Комментарий клиента' },
    {
      name: 'moyskladOrderId',
      type: 'text',
      label: 'ID заказа в МойСклад',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  timestamps: true,
}
