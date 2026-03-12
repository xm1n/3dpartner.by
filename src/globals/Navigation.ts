import type { GlobalConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Навигация',
  admin: { group: 'Контент' },
  access: { read: () => true, update: isAdminOrManager },
  fields: [
    {
      name: 'topBar',
      type: 'array',
      label: 'Верхняя панель (ссылки)',
      fields: [
        { name: 'label', type: 'text', label: 'Текст', required: true },
        { name: 'url', type: 'text', label: 'Ссылка', required: true },
        { name: 'highlight', type: 'checkbox', label: 'Акцент (цветная)', defaultValue: false },
      ],
    },
    {
      name: 'mainMenu',
      type: 'array',
      label: 'Главное меню',
      fields: [
        { name: 'label', type: 'text', label: 'Пункт меню', required: true },
        { name: 'url', type: 'text', label: 'Ссылка', required: true },
        { name: 'hasMegamenu', type: 'checkbox', label: 'Мега-меню', defaultValue: false },
        {
          name: 'megamenuColumns',
          type: 'array',
          label: 'Колонки мега-меню',
          admin: { condition: (data, siblingData) => siblingData?.hasMegamenu },
          fields: [
            { name: 'heading', type: 'text', label: 'Заголовок колонки' },
            {
              name: 'links',
              type: 'array',
              label: 'Ссылки',
              fields: [
                { name: 'label', type: 'text', label: 'Текст', required: true },
                { name: 'url', type: 'text', label: 'Ссылка', required: true },
              ],
            },
          ],
        },
        { name: 'banner', type: 'relationship', relationTo: 'banners', label: 'Баннер в мега-меню' },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Колонки футера',
      fields: [
        { name: 'heading', type: 'text', label: 'Заголовок' },
        {
          name: 'links',
          type: 'array',
          label: 'Ссылки',
          fields: [
            { name: 'label', type: 'text', label: 'Текст', required: true },
            { name: 'url', type: 'text', label: 'Ссылка', required: true },
          ],
        },
      ],
    },
  ],
}
