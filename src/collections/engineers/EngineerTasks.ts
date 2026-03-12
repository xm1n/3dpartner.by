import type { CollectionConfig } from 'payload'
import { isAdminOrManager, isLoggedIn } from '@/access/roles'

export const EngineerTasks: CollectionConfig = {
  slug: 'engineer-tasks',
  admin: {
    useAsTitle: 'title',
    group: 'Инженеры',
    defaultColumns: ['title', 'status', 'client', 'budget', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'manager') return true
      return { client: { equals: user.id } }
    },
    create: isLoggedIn,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название задачи', required: true },
    { name: 'client', type: 'relationship', relationTo: 'users', label: 'Заказчик', required: true },
    { name: 'briefing', type: 'richText', label: 'Техническое задание' },
    {
      name: 'referenceFiles',
      type: 'array',
      label: 'Референсы / Файлы',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'budget', type: 'number', label: 'Бюджет (BYN)', min: 0 },
    { name: 'deadline', type: 'date', label: 'Срок' },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'open',
      options: [
        { label: 'Открыт', value: 'open' },
        { label: 'Инженер выбран', value: 'assigned' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'На проверке', value: 'review' },
        { label: 'Завершён', value: 'completed' },
        { label: 'Спор', value: 'dispute' },
        { label: 'Отменён', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'responses',
      type: 'array',
      label: 'Отклики инженеров',
      fields: [
        { name: 'engineer', type: 'relationship', relationTo: 'users', required: true },
        { name: 'price', type: 'number', label: 'Цена', min: 0 },
        { name: 'estimatedDays', type: 'number', label: 'Срок (дней)' },
        { name: 'message', type: 'textarea', label: 'Сообщение' },
        { name: 'selected', type: 'checkbox', label: 'Выбран', defaultValue: false },
      ],
    },
    { name: 'assignedEngineer', type: 'relationship', relationTo: 'users', label: 'Назначенный инженер', admin: { position: 'sidebar' } },
    { name: 'escrowAmount', type: 'number', label: 'Заморожено на эскроу (BYN)', admin: { position: 'sidebar', readOnly: true } },
  ],
  timestamps: true,
}
