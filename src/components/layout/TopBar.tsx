import { MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { EngineersNavLink } from '@/components/ui/EngineersNavLink'
import { B2BNavLink } from '@/components/ui/B2BNavLink'
import { getSiteSettings, getNavigation } from '@/lib/globals'

export async function TopBar() {
  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigation()])
  const c = settings.contacts
  const topLinks = navigation.topBar ?? []

  return (
    <div className="bg-slate-900 text-slate-400 text-xs py-2 hidden md:block border-b border-slate-800">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-[1400px]">
        <div className="flex gap-6">
          {c?.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {c.address}
            </span>
          )}
          {c?.workingHours && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {c.workingHours}
            </span>
          )}
        </div>
        <div className="flex gap-6 font-medium">
          {topLinks.length > 0
            ? topLinks.map((link: any, i: number) =>
                link.url === '/engineers' ? (
                  <EngineersNavLink
                    key={i}
                    label={link.label}
                    accent={false}
                    className={link.highlight ? 'text-blue-400 hover:text-blue-300 transition' : 'text-purple-400 hover:text-purple-300 transition'}
                  />
                ) : link.url === '/b2b' ? (
                  <B2BNavLink key={i} label={link.label} className={link.highlight ? 'text-blue-400 hover:text-blue-300 transition' : 'hover:text-white transition'} />
                ) : (
                  <Link
                    key={i}
                    href={link.url}
                    className={
                      link.highlight
                        ? 'text-blue-400 hover:text-blue-300 transition'
                        : 'hover:text-white transition'
                    }
                  >
                    {link.label}
                  </Link>
                )
              )
            : (
              <>
                <Link href="/catalog" className="hover:text-white transition">Магазин</Link>
                <Link href="/knowledge" className="hover:text-white transition">Доставка и оплата</Link>
                <B2BNavLink label="B2B Портал" className="text-blue-400 hover:text-blue-300 transition" />
                <EngineersNavLink label="Инженерам" accent={false} className="text-purple-400 hover:text-purple-300 transition" />
              </>
            )}
        </div>
      </div>
    </div>
  )
}
