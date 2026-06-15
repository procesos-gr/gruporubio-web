import { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/services-data';

const BASE_URL = 'https://gruporubio.es';
const LOCALES = ['es', 'en', 'fr', 'eu'] as const;

const STATIC_ROUTES = [
  '',
  '/servicios',
  '/tienda',
  '/alquiler',
  '/nosotros',
  '/contacto',
  '/presupuesto',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

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
  }

  return entries;
}
