import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager, isLoggedIn } from '@/access/roles'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  admin: {
    useAsTitle: 'id',
    group: 'Магазин',
    defaultColumns: ['product', 'author', 'rating', 'approved', 'createdAt'],
    description: 'Отзывы покупателей о товарах',
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
    { name: 'authorName', type: 'text', label: 'Имя автора (для отображения)', admin: { readOnly: true, description: 'Заполняется автоматически из профиля пользователя' } },
    { name: 'rating', type: 'number', label: 'Оценка', required: true, min: 1, max: 5 },
    { name: 'text', type: 'textarea', label: 'Текст отзыва', required: true },
    { name: 'approved', type: 'checkbox', label: 'Одобрен', defaultValue: false, admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, payload }) => {
        if (data.authorName) return
        const authorId = data.author && (typeof data.author === 'object' && 'id' in data.author ? data.author.id : data.author)
        if (!authorId) return
        try {
          const user = await payload.findByID({ collection: 'users', id: authorId })
          const u = user as { firstName?: string; lastName?: string }
          data.authorName = [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() || 'Покупатель'
        } catch {
          data.authorName = 'Покупатель'
        }
      },
    ],
  },
  timestamps: true,
}
