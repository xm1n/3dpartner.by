import type { CollectionConfig } from 'payload'
import { isB2B, isAdminOrManager } from '@/access/roles'

export const B2BClients: CollectionConfig = {
  slug: 'b2b-clients',
  admin: {
    useAsTitle: 'companyName',
    group: 'Клиенты и B2B',
    defaultColumns: ['companyName', 'inn', 'discountColumn', 'user', 'createdAt'],
  },
  access: {
    read: isB2B,
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
  timestamps: true,
}
