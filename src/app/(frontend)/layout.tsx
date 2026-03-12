import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: '3D Partner — Экосистема 3D-печати',
    template: '%s — 3D Partner',
  },
  description: 'Профессиональная платформа аддитивных технологий в Беларуси. 3D-принтеры, филамент, услуги 3D-печати, портал инженеров.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="text-slate-800 font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
