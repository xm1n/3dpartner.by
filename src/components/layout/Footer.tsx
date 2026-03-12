import Link from 'next/link'
import { EngineersNavLink } from '@/components/ui/EngineersNavLink'
import { B2BNavLink } from '@/components/ui/B2BNavLink'
import { getSiteSettings, getNavigation } from '@/lib/globals'

export async function Footer() {
  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigation()])
  const c = settings.contacts
  const s = settings.socials
  const footerCols = navigation.footerColumns ?? []
  const year = new Date().getFullYear()

  const defaultColumns = [
    {
      heading: 'Магазин',
      links: [
        { label: 'Каталог товаров', url: '/catalog' },
        { label: 'Оплата и доставка', url: '/knowledge' },
        { label: 'Гарантия и возврат', url: '/knowledge' },
        { label: 'Бренды', url: '/catalog' },
      ],
    },
    {
      heading: 'Экосистема',
      links: [
        { label: 'Калькулятор 3D-печати', url: '/calculator' },
        { label: 'B2B Оптовый портал', url: '/b2b', accent: 'blue' },
        { label: 'Портал Инженеров', url: '/engineers', accent: 'purple' },
        { label: 'База знаний', url: '/knowledge' },
      ],
    },
  ]
  const columns = footerCols.length > 0 ? footerCols : defaultColumns

  return (
    <footer className="bg-white text-slate-500 py-12 border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-2 mb-4 text-slate-900 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm shadow-sm">3D</div>
            <span>PARTNER</span>
          </Link>
          <p className="text-xs mb-6 max-w-sm leading-relaxed">
            Профессиональная платформа аддитивных технологий. Поставка оборудования, серийное производство и инженерные разработки.
          </p>
          <div className="flex gap-3">
            {s?.telegram && (
              <a href={s.telegram} target="_blank" rel="noopener noreferrer" title="Telegram" className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
              </a>
            )}
            {s?.whatsapp && (
              <a href={s.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-green-50 text-slate-400 hover:text-green-500 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 .002 5.383.002 12.03c0 2.126.551 4.195 1.6 6.02L.031 24l6.113-1.603c1.748.956 3.738 1.46 5.887 1.46 6.646 0 12.03-5.383 12.03-12.03S18.677 0 12.031 0zm6.185 17.382c-.261.737-1.503 1.425-2.091 1.488-.553.058-1.25.138-3.52-.803-2.73-1.13-4.506-3.92-4.644-4.103-.138-.184-1.11-1.472-1.11-2.81 0-1.337.691-1.99.94-2.266.248-.276.543-.346.728-.346s.368.005.53.013c.19.009.444-.075.696.533.264.639.873 2.128.95 2.285.076.157.126.342.033.526-.093.184-.139.3-.276.46-.139.16-.29.351-.415.475-.138.138-.282.29-.126.565.157.276.697 1.15 1.492 1.802.946.776 1.79 1.042 2.065 1.166.276.124.437.106.602-.083.166-.188.718-.834.912-1.12.194-.286.387-.238.636-.145.249.092 1.576.745 1.844.87.268.124.447.184.512.286.065.101.065.594-.196 1.33z"/></svg>
              </a>
            )}
            {s?.vk && (
              <a href={s.vk} target="_blank" rel="noopener noreferrer" title="ВКонтакте" className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.368 1.259 2.183 1.815.616.42 1.084.328 1.084.328l2.175-.03s1.138-.07.598-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.119-.332-.856-.244-.856-.244l-2.45.015s-.182-.025-.317.056c-.131.079-.216.263-.216.263s-.387 1.03-.903 1.906c-1.089 1.85-1.524 1.949-1.702 1.834-.415-.267-.311-1.073-.311-1.645 0-1.789.271-2.535-.528-2.729-.266-.064-.461-.107-1.14-.114-.87-.009-1.606.003-2.023.207-.278.136-.492.439-.361.456.161.021.526.098.72.363.25.342.241 1.11.241 1.11s.144 2.105-.335 2.367c-.329.18-.78-.187-1.748-1.867-.495-.86-.869-1.81-.869-1.81s-.072-.177-.2-.272c-.155-.115-.372-.151-.372-.151l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.82 4.258 3.88 6.404c1.889 1.968 4.033 1.838 4.033 1.838h.972z"/></svg>
              </a>
            )}
            {s?.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-pink-50 text-slate-400 hover:text-pink-500 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
          </div>
        </div>

        {columns.map((col: any, i: number) => (
          <div key={i}>
            {col.heading && <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-[10px]">{col.heading}</h4>}
            <ul className="space-y-2.5 text-xs font-medium">
              {col.links?.map((link: any, j: number) => {
                const accentClass =
                  link.accent === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                  link.accent === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                  'hover:text-blue-600'
                return (
                  <li key={j}>
                    {link.url === '/engineers' ? (
                      <EngineersNavLink label={link.label} accent={false} className={`transition ${accentClass}`} />
                    ) : link.url === '/b2b' ? (
                      <B2BNavLink label={link.label} className={`transition ${accentClass}`} />
                    ) : (
                      <Link href={link.url} className={`transition ${accentClass}`}>{link.label}</Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-[10px]">Контакты</h4>
          <ul className="space-y-3 text-xs font-medium">
            {c?.phone && (
              <li>
                <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className="text-slate-900 font-bold hover:text-blue-600 transition">{c.phone}</a>
                {c.workingHours && <div className="text-[10px] mt-0.5">{c.workingHours}</div>}
              </li>
            )}
            {c?.email && (
              <li><a href={`mailto:${c.email}`} className="hover:text-blue-600 transition">{c.email}</a></li>
            )}
            {c?.address && <li>{c.address}</li>}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] mt-10 pt-6 border-t border-slate-100 text-[10px] flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {year} {settings.legal?.companyFullName || 'ООО "3Д Партнер"'}. Все права защищены.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-900 transition">Политика конфиденциальности</a>
          <a href="#" className="hover:text-slate-900 transition">Договор оферты</a>
        </div>
      </div>
    </footer>
  )
}
