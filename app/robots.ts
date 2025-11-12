import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/billing/'],
      },
    ],
    sitemap: 'https://likebutter.io/sitemap.xml',
  };
}
