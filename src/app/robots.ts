import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/success',
          '/checkout/cancel',
        ],
      },
    ],
    sitemap: 'https://acemen.co.uk/sitemap.xml',
    host: 'https://acemen.co.uk',
  };
}
