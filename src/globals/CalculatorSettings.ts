import type { GlobalConfig } from 'payload'
import { isAdminOrManager } from '@/access/roles'

export const CalculatorSettings: GlobalConfig = {
  slug: 'calculator-settings',
  label: 'Настройки 3D-калькулятора',
  admin: { group: 'Производство' },
  access: { read: () => true, update: isAdminOrManager },
  fields: [
    {
      name: 'materials',
      type: 'array',
      label: 'Материалы и цены',
      fields: [
        { name: 'name', type: 'text', label: 'Название материала', required: true },
        { name: 'slug', type: 'text', label: 'Ключ (slug)', required: true },
        { name: 'pricePerGram', type: 'number', label: 'Цена за 1 грамм (BYN)', required: true, min: 0 },
        { name: 'pricePerCm3', type: 'number', label: 'Цена за 1 см³ (BYN)', min: 0 },
        { name: 'density', type: 'number', label: 'Плотность (г/см³)' },
        {
          name: 'colors',
          type: 'array',
          label: 'Доступные цвета',
          fields: [
            { name: 'colorName', type: 'text', label: 'Цвет' },
            { name: 'colorHex', type: 'text', label: 'HEX' },
            { name: 'available', type: 'checkbox', label: 'В наличии', defaultValue: true },
          ],
        },
      ],
    },
    {
      name: 'coefficients',
      type: 'group',
      label: 'Коэффициенты',
      fields: [
        { name: 'infill25', type: 'number', label: 'Коэфф. заполнение 25%', defaultValue: 1.0 },
        { name: 'infill50', type: 'number', label: 'Коэфф. заполнение 50%', defaultValue: 1.3 },
        { name: 'infill75', type: 'number', label: 'Коэфф. заполнение 75%', defaultValue: 1.6 },
        { name: 'infill100', type: 'number', label: 'Коэфф. заполнение 100%', defaultValue: 2.0 },
        { name: 'supportMultiplier', type: 'number', label: 'Множитель поддержек', defaultValue: 1.15 },
        { name: 'engineeringMaterialMultiplier', type: 'number', label: 'Множитель инж. пластиков', defaultValue: 1.5 },
      ],
    },
    {
      name: 'limits',
      type: 'group',
      label: 'Лимиты',
      fields: [
        { name: 'minOrderAmount', type: 'number', label: 'Мин. сумма заказа (BYN)', defaultValue: 20 },
        { name: 'maxFileSizeMb', type: 'number', label: 'Макс. размер файла (МБ)', defaultValue: 100 },
        { name: 'maxDimensionMm', type: 'number', label: 'Макс. габарит (мм)', defaultValue: 300 },
      ],
    },
  ],
}
