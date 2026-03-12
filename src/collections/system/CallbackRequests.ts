import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/roles'

export const CallbackRequests: CollectionConfig = {
  slug: 'callback-requests',
  labels: { singular: 'Заявка на звонок', plural: 'Заявки на звонок' },
  admin: {
    useAsTitle: 'name',
    group: 'Система',
    defaultColumns: ['name', 'phone', 'email', 'status', 'createdAt'],
    description: 'Заявки с формы «Заказать звонок»',
  },
  access: {
    read: isAdmin,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user && !(data as any).user) {
          (data as any).user = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'phone', type: 'text', label: 'Телефон', required: true },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'comment', type: 'textarea', label: 'Комментарий / Вопрос' },
    { name: 'preferredTime', type: 'text', label: 'Удобное время для звонка', admin: { description: 'Например: после 15:00' } },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Пользователь',
      admin: { description: 'Заполняется, если заявка от авторизованного пользователя' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'Связались', value: 'contacted' },
        { label: 'Закрыта', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
