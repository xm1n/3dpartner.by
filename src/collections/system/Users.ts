import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAdminFieldLevel } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Система',
    defaultColumns: ['email', 'firstName', 'role', 'createdAt'],
  },
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req: { user } }) => {
      if (!user) return false
      return ['admin', 'manager', 'developer'].includes(user.role as string)
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'Имя',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Фамилия',
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      required: true,
      defaultValue: 'b2c_customer',
      access: {
        update: isAdminFieldLevel,
      },
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Менеджер', value: 'manager' },
        { label: 'Разработчик', value: 'developer' },
        { label: 'Покупатель (B2C)', value: 'b2c_customer' },
        { label: 'Оптовый клиент (B2B)', value: 'b2b_customer' },
        { label: 'Инженер', value: 'engineer' },
      ],
    },
    {
      name: 'permissions',
      type: 'select',
      label: 'Доступные модули',
      hasMany: true,
      admin: {
        condition: (data) => data?.role === 'manager',
        description: 'Назначьте модули, доступные этому менеджеру',
      },
      options: [
        { label: 'Магазин — Каталог', value: 'shop_catalog' },
        { label: 'Магазин — Заказы', value: 'shop_orders' },
        { label: 'Ферма — Заказы печати', value: 'farm_orders' },
        { label: 'Ферма — Оборудование', value: 'farm_equipment' },
        { label: 'Инженеры — Проекты', value: 'engineers' },
        { label: 'B2B — Клиенты', value: 'b2b' },
        { label: 'Маркетинг', value: 'marketing' },
        { label: 'Контент', value: 'content' },
        { label: 'Импорт и Парсинг', value: 'import' },
      ],
    },
    {
      name: 'deliveryAddress',
      type: 'group',
      label: 'Адрес доставки',
      admin: {
        condition: (data) =>
          ['b2c_customer', 'b2b_customer'].includes(data?.role),
      },
      fields: [
        { name: 'city', type: 'text', label: 'Город' },
        { name: 'street', type: 'text', label: 'Улица, дом, кв.' },
        { name: 'postalCode', type: 'text', label: 'Почтовый индекс' },
      ],
    },
  ],
  timestamps: true,
}
