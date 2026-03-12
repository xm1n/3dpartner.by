import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/roles'

export const B2BApplications: CollectionConfig = {
  slug: 'b2b-applications',
  labels: { singular: 'Заявка на B2B', plural: 'Заявки на B2B' },
  admin: {
    useAsTitle: 'companyName',
    group: 'B2B / Опт',
    defaultColumns: ['companyName', 'inn', 'contactPerson', 'status', 'createdAt'],
    description: 'Заявки на подключение к оптовому порталу',
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
    { name: 'companyName', type: 'text', label: 'Название компании', required: true },
    { name: 'inn', type: 'text', label: 'УНП (ИНН)' },
    { name: 'contactPerson', type: 'text', label: 'Контактное лицо', required: true },
    { name: 'phone', type: 'text', label: 'Телефон', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'comment', type: 'textarea', label: 'Комментарий' },
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
        { label: 'В работе', value: 'in_progress' },
        { label: 'Одобрена', value: 'approved' },
        { label: 'Отклонена', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
