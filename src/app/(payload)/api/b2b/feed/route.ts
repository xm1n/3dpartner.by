import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import type { Where } from 'payload'

const DISCOUNT_PERCENT: Record<string, number> = {
  base: 0,
  partner_5: 5,
  dealer_10: 10,
  distributor_15: 15,
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const format = request.nextUrl.searchParams.get('format') ?? 'xml'

  if (!token) {
    return NextResponse.json({ error: 'Не указан token' }, { status: 400 })
  }
  const fmt = format.toLowerCase()
  if (fmt !== 'xml' && fmt !== 'csv' && fmt !== 'json') {
    return NextResponse.json({ error: 'Формат должен быть xml, csv или json' }, { status: 400 })
  }

  const payload = await getPayload()

  const clientsResult = await payload.find({
    collection: 'b2b-clients',
    where: { apiToken: { equals: token } },
    limit: 1,
    depth: 0,
  })
  const client = clientsResult.docs[0]
  if (!client) {
    return NextResponse.json({ error: 'Неверный токен' }, { status: 401 })
  }

  const pricelistsResult = await payload.find({
    collection: 'b2b-pricelists',
    where: {
      client: { equals: client.id },
      format: { equals: fmt },
      active: { equals: true },
    },
    limit: 1,
    depth: 0,
  })
  const pricelist = pricelistsResult.docs[0]

  const where: Where = {
    _status: { equals: 'published' },
  }
  if (pricelist) {
    if (pricelist.onlyB2BAvailable) {
      where.availableForB2B = { equals: true }
    }
    if (!pricelist.includeOutOfStock) {
      where.inStock = { equals: true }
    }
    const filterCategories = pricelist.filterCategories
    if (Array.isArray(filterCategories) && filterCategories.length > 0) {
      const ids = filterCategories.map((c) => (typeof c === 'object' && c?.id ? c.id : c))
      if (ids.length) where.categories = { in: ids }
    }
    const filterBrands = pricelist.filterBrands
    if (Array.isArray(filterBrands) && filterBrands.length > 0) {
      const ids = filterBrands.map((b) => (typeof b === 'object' && b?.id ? b.id : b))
      if (ids.length) where.brand = { in: ids }
    }
  } else {
    // Нет конфига прайса — выгружаем по умолчанию: все опубликованные в наличии (без фильтра «только для опта»)
    where.inStock = { equals: true }
  }

  const productsResult = await payload.find({
    collection: 'products',
    where,
    limit: 10000,
    depth: 0,
  })
  const products = productsResult.docs

  const discountPercent =
    (client as { discountColumn?: string; customDiscountPercent?: number }).discountColumn === 'custom'
      ? Number((client as { customDiscountPercent?: number }).customDiscountPercent) || 0
      : DISCOUNT_PERCENT[(client as { discountColumn?: string }).discountColumn ?? 'base'] ?? 0

  const priceRule = pricelist
    ? ((pricelist as { priceRule?: string }).priceRule ?? 'base')
    : 'base'
  const markupPercent = pricelist
    ? Number((pricelist as { markupPercent?: number }).markupPercent) || 0
    : 0

  type Row = { id: string; sku: string; title: string; price: number; inStock: boolean; url?: string }
  const baseUrl = request.nextUrl.origin
  const rows: Row[] = products.map((p) => {
    const basePrice = Number((p as { price?: number }).price) ?? 0
    let price = basePrice
    if (priceRule === 'client_discount') price = basePrice * (1 - discountPercent / 100)
    else if (priceRule === 'markup') price = basePrice * (1 + markupPercent / 100)
    const slug = (p as { slug?: string }).slug
    return {
      id: String((p as { id?: string }).id ?? ''),
      sku: String((p as { sku?: string }).sku ?? ''),
      title: String((p as { title?: string }).title ?? ''),
      price: Math.round(price * 100) / 100,
      inStock: Boolean((p as { inStock?: boolean }).inStock),
      url: slug ? `${baseUrl}/product/${slug}` : undefined,
    }
  })

  if (fmt === 'json') {
    return NextResponse.json(
      { products: rows, generatedAt: new Date().toISOString() },
      {
        headers: {
          'Content-Disposition': 'attachment; filename="pricelist.json"',
        },
      }
    )
  }

  if (fmt === 'csv') {
    const header = 'id;sku;title;price;inStock;url'
    const lines = [
      header,
      ...rows.map((r) =>
        [r.id, r.sku, `"${String(r.title).replace(/"/g, '""')}"`, r.price, r.inStock, r.url ?? ''].join(';')
      ),
    ]
    const body = '\uFEFF' + lines.join('\n')
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="pricelist.csv"',
      },
    })
  }

  const yml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<yml_catalog date="' + new Date().toISOString() + '">',
    '  <shop>',
    '    <name>3D Partner</name>',
    '    <offers>',
    ...rows.map(
      (r) =>
        `      <offer id="${escapeXml(r.id)}" available="${r.inStock ? 'true' : 'false'}">
        <url>${r.url ? escapeXml(r.url) : ''}</url>
        <price>${r.price}</price>
        <sku>${escapeXml(r.sku)}</sku>
        <name>${escapeXml(r.title)}</name>
      </offer>`
    ),
    '    </offers>',
    '  </shop>',
    '</yml_catalog>',
  ].join('\n')

  return new NextResponse(yml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="pricelist.xml"',
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
