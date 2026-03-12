import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager, isLoggedIn } from '@/access/roles'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'id',
    group: 'Магазин',
    defaultColumns: ['product', 'author', 'rating', 'approved', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'manager') return true
      return { approved: { equals: true } }
    },
    create: isLoggedIn,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true, label: 'Товар' },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true, label: 'Автор' },
    { name: 'rating', type: 'number', label: 'Оценка', required: true, min: 1, max: 5 },
    { name: 'text', type: 'textarea', label: 'Текст отзыва', required: true },
    { name: 'approved', type: 'checkbox', label: 'Одобрен', defaultValue: false, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
