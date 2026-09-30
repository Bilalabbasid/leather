import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/', '/api/checkout/'],
      },
    ],
    sitemap: 'https://acemen.uk/sitemap.xml',
  };
}
