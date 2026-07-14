import { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/services-data';
import { getMaquinaria } from '@/lib/maquinaria';
import { medusa } from '@/lib/medusa';

const BASE_URL = 'https://gruporubio.es';
const LOCALES = ['es', 'en', 'fr', 'eu'] as const;
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;

const STATIC_ROUTES = [
  '',
  '/servicios',
  '/tienda',
  '/alquiler',
  '/nosotros',
  '/contacto',
  '/presupuesto',
];

async function getProductHandles(): Promise<string[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await medusa.store.product.list({
      region_id: REGION_ID,
      fields: 'handle',
      limit: 200,
    } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result.products ?? []) as any[]).map((p) => p.handle).filter(Boolean);
  } catch {
    return [];
  }
}

async function getCategoryHandles(): Promise<string[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await medusa.store.category.list({ fields: 'handle', limit: 100 } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result.product_categories ?? []) as any[]).map((c) => c.handle).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const [productHandles, categoryHandles, maquinaria] = await Promise.all([
    getProductHandles(),
    getCategoryHandles(),
    getMaquinaria(),
  ]);

  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    }

    for (const service of SERVICES) {
      entries.push({
        url: `${BASE_URL}/${locale}/servicios/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    for (const maquina of maquinaria) {
      entries.push({
        url: `${BASE_URL}/${locale}/alquiler/${maquina.handle}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    for (const handle of categoryHandles) {
      entries.push({
        url: `${BASE_URL}/${locale}/tienda/categoria/${handle}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }

    for (const handle of productHandles) {
      entries.push({
        url: `${BASE_URL}/${locale}/tienda/${handle}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
