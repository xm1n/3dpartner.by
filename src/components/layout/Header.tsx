import Link from 'next/link'
import { TopBar } from './TopBar'
import { HeaderActions } from '@/components/ui/HeaderActions'
import { ContactPopup } from '@/components/ui/ContactPopup'
import { SearchBar } from '@/components/ui/SearchBar'
import { CatalogMenu } from '@/components/ui/CatalogMenu'
import { EngineersNavLink } from '@/components/ui/EngineersNavLink'
import { getSiteSettings, getNavigation } from '@/lib/globals'
import { getPayload } from '@/lib/payload'

async function getCatalogsWithCategories() {
  const payload = await getPayload()
  const [catalogsRes, categoriesRes] = await Promise.all([
    payload.find({ collection: 'catalogs', sort: 'sortOrder', limit: 20, depth: 1 }),
    payload.find({ collection: 'categories', sort: 'sortOrder', limit: 200, depth: 0 }),
  ])

  return catalogsRes.docs
    .filter((c: any) => c.showInNav !== false)
    .map((c: any) => {
      const cats = categoriesRes.docs.filter((cat: any) => {
        const catCatalogId = typeof cat.catalog === 'object' ? cat.catalog?.id : cat.catalog
        return catCatalogId === c.id && !cat.parent
      })
      return { ...c, _categories: cats }
    })
}

export async function Header() {
  const [settings, navigation, catalogs] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getCatalogsWithCategories(),
  ])
  const phone = settings.contacts?.phone
  const workingHours = settings.contacts?.workingHours

  const staticLinks = [
    { label: 'Услуги 3D-печати', url: '/calculator' },
    { label: 'Биржа Инженеров', url: '/engineers', accent: true },
    { label: 'База знаний', url: '/knowledge' },
  ]

  return (
    <>
      <TopBar />
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200 relative">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-6 max-w-[1400px]">
          <Link href="/" className="text-xl font-black tracking-tight shrink-0 flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm shadow-sm">3D</div>
            <span className="hidden sm:block text-slate-900">PARTNER</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2">
            <CatalogMenu />
            <SearchBar />
          </div>

          <div className="flex items-center gap-5 shrink-0">
            {phone && (
              <ContactPopup
                phone={phone}
                workingHours={workingHours}
                email={settings.contacts?.email}
                telegram={settings.socials?.telegram}
                whatsapp={settings.socials?.whatsapp}
                managers={settings.managers}
              />
            )}
            <HeaderActions />
          </div>
        </div>

        {/* Sub-navigation with mega-menus */}
        <nav className="border-t border-slate-100 bg-white relative z-40">
          <div className="container mx-auto px-4 max-w-[1400px] hidden md:flex justify-between gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-full">

            {/* Catalog items with mega-menus */}
            {catalogs.map((catalog: any, idx: number) => {
              const categories: any[] = catalog._categories || []
              const banner = catalog.megamenuBanner
              const bannerImg = typeof banner?.bannerImage === 'object' ? banner.bannerImage?.url : undefined
              const hasBanner = !!(banner?.bannerTitle || banner?.bannerText || bannerImg)
              const hasMegamenu = categories.length > 0 || hasBanner

              const colCount = Math.min(3, Math.max(1, Math.ceil(categories.length / 4)))
              const columns: any[][] = Array.from({ length: colCount }, () => [])
              categories.forEach((cat: any, i: number) => {
                columns[i % colCount].push(cat)
              })

              const gridClass = colCount === 1 ? 'grid-cols-1' : colCount === 2 ? 'grid-cols-2' : 'grid-cols-3'

              return (
                <div key={catalog.id} className="group">
                  <Link
                    href={`/catalog/${catalog.slug}`}
                    className={`py-3 flex items-center gap-1 border-b-2 ${idx === 0 ? 'border-slate-900 text-slate-900' : 'border-transparent hover:border-slate-900 hover:text-slate-900'} transition whitespace-nowrap cursor-pointer`}
                  >
                    {catalog.title}
                    {hasMegamenu && (
                      <span className="text-[9px] opacity-50 transition-transform duration-300 group-hover:rotate-180">▼</span>
                    )}
                  </Link>

                  {hasMegamenu && (
                    <div className="absolute left-0 top-[100%] w-full bg-white border-b border-slate-200 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 cursor-default">
                      <div className="container mx-auto px-4 max-w-[1400px] py-8 flex gap-10">
                        {categories.length > 0 && (
                          <div className={`flex-1 grid ${gridClass} gap-8`}>
                            {columns.map((col, colIdx) => (
                              <div key={colIdx}>
                                <ul className="space-y-3 text-[13px] normal-case tracking-normal font-semibold text-slate-600">
                                  {col.map((cat: any) => (
                                    <li key={cat.id}>
                                      <Link href={`/catalog/${catalog.slug}/${cat.slug}`} className="hover:text-blue-600 transition flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                                        {cat.title}
                                      </Link>
                                    </li>
                                  ))}
                                  {colIdx === 0 && (
                                    <li className="pt-2">
                                      <Link href={`/catalog/${catalog.slug}`} className="text-blue-600 hover:text-blue-800 transition">
                                        Смотреть все →
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {hasBanner && (
                          <div className="w-[340px] shrink-0">
                            <Link href={banner.bannerLink || `/catalog/${catalog.slug}`} className="relative block rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 group/banner shadow-sm">
                              {bannerImg ? (
                                <img src={bannerImg} alt={banner.bannerTitle || ''} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover/banner:scale-105 group-hover/banner:opacity-60 transition-all duration-500" />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                              <div className="relative z-10 p-5 flex flex-col h-full justify-end text-white">
                                {banner.bannerBadge && (
                                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded w-max mb-2 uppercase tracking-wider shadow-sm normal-case">
                                    {banner.bannerBadge}
                                  </span>
                                )}
                                {banner.bannerTitle && (
                                  <h5 className="text-lg font-black leading-tight mb-1 normal-case">{banner.bannerTitle}</h5>
                                )}
                                {banner.bannerText && (
                                  <p className="text-xs text-slate-300 normal-case tracking-normal mb-3">{banner.bannerText}</p>
                                )}
                                <span className="text-sm font-bold text-blue-400 group-hover/banner:text-blue-300 transition flex items-center gap-1 normal-case tracking-normal">
                                  {banner.bannerLinkText || 'Подробнее'} <span>→</span>
                                </span>
                              </div>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Static nav items */}
            {staticLinks.map((item, i) => (
              <div key={i} className="relative flex items-center">
                {item.url === '/engineers' ? (
                  <EngineersNavLink
                    label={item.label}
                    accent={item.accent}
                    className={`py-3 flex items-center gap-1.5 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap ${
                      item.accent ? 'text-purple-600' : ''
                    }`}
                  />
                ) : (
                  <Link
                    href={item.url}
                    className={`py-3 flex items-center gap-1.5 border-b-2 border-transparent hover:border-slate-900 hover:text-slate-900 transition whitespace-nowrap ${
                      item.accent ? 'text-purple-600' : ''
                    }`}
                  >
                    {item.accent && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>
    </>
  )
}
