import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from '@/collections/system/Users'
import { Media } from '@/collections/system/Media'
import { CallbackRequests } from '@/collections/system/CallbackRequests'
import { Catalogs } from '@/collections/shop/Catalogs'
import { Products } from '@/collections/shop/Products'
import { Categories } from '@/collections/shop/Categories'
import { Brands } from '@/collections/shop/Brands'
import { Orders } from '@/collections/shop/Orders'
import { Reviews } from '@/collections/shop/Reviews'
import { PrintOrders } from '@/collections/production/PrintOrders'
import { ProductionCards } from '@/collections/production/ProductionCards'
import { Printers } from '@/collections/production/Printers'
import { FarmMaterials } from '@/collections/production/FarmMaterials'
import { EngineerProjects } from '@/collections/engineers/EngineerProjects'
import { EngineerTasks } from '@/collections/engineers/EngineerTasks'
import { B2BClients } from '@/collections/b2b/B2BClients'
import { B2BPriceLists } from '@/collections/b2b/B2BPriceLists'
import { B2BApplications } from '@/collections/b2b/B2BApplications'
import { Promotions } from '@/collections/marketing/Promotions'
import { Banners } from '@/collections/marketing/Banners'
import { Pages } from '@/collections/content/Pages'
import { Articles } from '@/collections/content/Articles'
import { SlicerProfiles } from '@/collections/content/SlicerProfiles'
import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'
import { CalculatorSettings } from '@/globals/CalculatorSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Endpoint = process.env.S3_ENDPOINT

export default buildConfig({
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '3dpartner',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        ...(s3Endpoint && {
          endpoint: s3Endpoint,
          forcePathStyle: true,
        }),
      },
    }),
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — 3D Partner Admin',
    },
    avatar: 'default',
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    // Магазин
    Catalogs,
    Products,
    Categories,
    Brands,
    Orders,
    Reviews,
    // Производство
    PrintOrders,
    ProductionCards,
    Printers,
    FarmMaterials,
    // Биржа Инженеров
    EngineerProjects,
    EngineerTasks,
    // B2B / Опт
    B2BClients,
    B2BPriceLists,
    B2BApplications,
    // Маркетинг
    Promotions,
    Banners,
    // Контент
    Pages,
    Articles,
    SlicerProfiles,
    // Система
    Users,
    Media,
    CallbackRequests,
  ],
  globals: [SiteSettings, CalculatorSettings, Navigation],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
