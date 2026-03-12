import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrManager, isEngineer } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Медиатека' },
  upload: {
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
      'model/stl',
      'application/octet-stream',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre' },
      { name: 'card', width: 600, height: 600, position: 'centre' },
      { name: 'hero', width: 1200, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Система',
    description: 'Изображения, документы, 3D-модели',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!(data as any).alt && (data as any).filename) {
          (data as any).alt = (data as any).filename
        }
        return data
      },
    ],
  },
  access: {
    read: anyone,
    create: (args) => isAdminOrManager(args) || isEngineer(args),
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt текст',
      admin: { description: 'Подставляется из имени файла, если не указан' },
    },
  ],
}
