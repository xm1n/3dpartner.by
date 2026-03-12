import { getPayload } from './payload'
import { unstable_cache } from 'next/cache'

export type Manager = {
  name: string
  department: string
  phone?: string
  photo?: { url?: string } | null
  isOnline?: boolean
}

export type SiteSettingsData = {
  general: { siteName?: string; tagline?: string; logo?: any }
  contacts: {
    phone?: string
    phoneSecondary?: string
    email?: string
    address?: string
    workingHours?: string
  }
  socials: {
    telegram?: string
    whatsapp?: string
    vk?: string
    instagram?: string
  }
  managers?: Manager[]
  legal: {
    companyFullName?: string
    inn?: string
    tradeRegDate?: string
    tradeRegNumber?: string
    legalAddress?: string
  }
}

export type NavLink = { label: string; url: string }
export type NavTopBarLink = NavLink & { highlight?: boolean }
export type NavMenuItem = NavLink & {
  hasMegamenu?: boolean
  megamenuColumns?: { heading?: string; links?: NavLink[] }[]
  banner?: any
}
export type NavigationData = {
  topBar?: NavTopBarLink[]
  mainMenu?: NavMenuItem[]
  footerColumns?: { heading?: string; links?: NavLink[] }[]
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    const payload = await getPayload()
    const data = await payload.findGlobal({ slug: 'site-settings' })
    return data as unknown as SiteSettingsData
  },
  ['site-settings'],
  { revalidate: 60, tags: ['site-settings'] },
)

export const getNavigation = unstable_cache(
  async (): Promise<NavigationData> => {
    const payload = await getPayload()
    const data = await payload.findGlobal({ slug: 'navigation' })
    return data as unknown as NavigationData
  },
  ['navigation'],
  { revalidate: 60, tags: ['navigation'] },
)
