import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: { group: 'Система' },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      name: 'general',
      type: 'group',
      label: 'Общие',
      fields: [
        { name: 'siteName', type: 'text', label: 'Название сайта', defaultValue: '3D Partner' },
        { name: 'tagline', type: 'text', label: 'Слоган' },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип' },
      ],
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Контакты',
      fields: [
        { name: 'phone', type: 'text', label: 'Телефон', defaultValue: '+375 (29) 111-22-33' },
        { name: 'phoneSecondary', type: 'text', label: 'Доп. телефон' },
        { name: 'email', type: 'email', label: 'E-mail', defaultValue: 'info@3dpartner.by' },
        { name: 'address', type: 'text', label: 'Адрес', defaultValue: 'г. Минск, ул. Технологическая, 1' },
        { name: 'workingHours', type: 'text', label: 'Режим работы', defaultValue: 'Пн-Пт: 9:00 - 18:00' },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      label: 'Соцсети',
      fields: [
        { name: 'telegram', type: 'text', label: 'Telegram' },
        { name: 'whatsapp', type: 'text', label: 'WhatsApp' },
        { name: 'vk', type: 'text', label: 'VK' },
        { name: 'instagram', type: 'text', label: 'Instagram' },
      ],
    },
    {
      name: 'managers',
      type: 'array',
      label: 'Менеджеры (карточка контактов)',
      admin: { description: 'Отображаются во всплывающей карточке при наведении на телефон в шапке' },
      fields: [
        { name: 'name', type: 'text', label: 'Имя и фамилия', required: true },
        { name: 'department', type: 'text', label: 'Отдел / специализация', required: true },
        { name: 'phone', type: 'text', label: 'Прямой телефон' },
        { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото' },
        { name: 'isOnline', type: 'checkbox', label: 'Сейчас онлайн', defaultValue: false },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      label: 'Юридическая информация',
      fields: [
        { name: 'companyFullName', type: 'text', label: 'Полное наименование юрлица' },
        { name: 'inn', type: 'text', label: 'УНП' },
        { name: 'tradeRegDate', type: 'text', label: 'Дата регистрации в Торговом реестре' },
        { name: 'tradeRegNumber', type: 'text', label: 'Номер в Торговом реестре' },
        { name: 'legalAddress', type: 'textarea', label: 'Юридический адрес' },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Аналитика',
      fields: [
        { name: 'googleAnalyticsId', type: 'text', label: 'Google Analytics ID' },
        { name: 'yandexMetrikaId', type: 'text', label: 'Яндекс.Метрика ID' },
      ],
    },
  ],
}
