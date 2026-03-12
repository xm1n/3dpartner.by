import type { CollectionConfig } from 'payload'
import crypto from 'node:crypto'
import { isAdminOrManager } from '@/access/roles'

/** Админ/менеджер — все; B2B-клиент — только своя запись (где user = текущий пользователь) */
const readB2BClients: import('payload').Access = (args) => {
  const user = args.req.user as { id?: string | number; role?: string } | null | undefined
  if (user?.role === 'admin' || user?.role === 'manager') return true
  if (user?.role === 'b2b_customer' && user?.id != null) {
    return { user: { equals: user.id } } as import('payload').Where
  }
  return false
}

export const B2BClients: CollectionConfig = {
  slug: 'b2b-clients',
  labels: { singular: 'B2B клиент', plural: 'B2B клиенты' },
  admin: {
    useAsTitle: 'companyName',
    group: 'B2B / Опт',
    defaultColumns: ['companyName', 'inn', 'discountColumn', 'user', 'createdAt'],
  },
  access: {
    read: readB2BClients,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'companyName', type: 'text', label: 'Юридическое лицо', required: true },
    { name: 'inn', type: 'text', label: 'УНП (ИНН)' },
    { name: 'user', type: 'relationship', relationTo: 'users', label: 'Аккаунт пользователя' },
    { name: 'contactPerson', type: 'text', label: 'Контактное лицо' },
    { name: 'phone', type: 'text', label: 'Телефон' },
    { name: 'email', type: 'email', label: 'E-mail' },
    { name: 'legalAddress', type: 'textarea', label: 'Юридический адрес' },
    {
      name: 'discountColumn',
      type: 'select',
      label: 'Скидочная колонка',
      defaultValue: 'base',
      options: [
        { label: 'Базовая (0%)', value: 'base' },
        { label: 'Партнёр (5%)', value: 'partner_5' },
        { label: 'Дилер (10%)', value: 'dealer_10' },
        { label: 'Дистрибьютор (15%)', value: 'distributor_15' },
        { label: 'Индивидуальная', value: 'custom' },
      ],
    },
    { name: 'customDiscountPercent', type: 'number', label: 'Индивидуальная скидка (%)', min: 0, max: 50, admin: { condition: (data) => data?.discountColumn === 'custom' } },
    { name: 'apiToken', type: 'text', label: 'API-токен для прайс-листа', admin: { readOnly: true, description: 'Генерируется автоматически' } },
    { name: 'notes', type: 'textarea', label: 'Заметки менеджера' },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data?.apiToken || typeof data.apiToken !== 'string' || data.apiToken.trim() === '') {
          data.apiToken = crypto.randomBytes(32).toString('hex')
        }
      },
    ],
  },
  timestamps: true,
}
