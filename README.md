# 3D Partner

B2B/B2C портал и админ-панель на Next.js + Payload CMS.

## Разработка

```bash
pnpm install
cp .env.example .env
# Заполните PAYLOAD_SECRET в .env (минимум 32 символа)
pnpm run generate:importmap   # обязательно перед первым запуском админки
pnpm dev
```

- Сайт: http://localhost:3000  
- Админ-панель: http://localhost:3000/admin  

Если при открытии `/admin` появляется ошибка **«Cannot read properties of undefined (reading 'Component')»**, снова выполните `pnpm run generate:importmap` и перезапустите `pnpm dev`.
