import { MetadataRoute } from 'next';

const SITE_URL = 'https://likebutter.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['ko', 'en'];

  const routes = [
    '',
    '/studio',
    '/studio?tool=virtual-casting',
    '/studio?tool=butter-cover',
    '/studio?tool=fanmeeting-studio',
    '/studio?tool=digital-goods',
    '/studio?tool=stylist',
    '/studio/archive',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${SITE_URL}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route.startsWith('/studio') ? 0.8 : 0.6,
        alternates: {
          languages: {
            ko: `${SITE_URL}/ko${route}`,
            en: `${SITE_URL}/en${route}`,
          },
        },
      });
    });
  });

  return sitemap;
}
