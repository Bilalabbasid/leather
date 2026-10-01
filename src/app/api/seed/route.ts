import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          image: cat.image,
          displayPriority: cat.displayPriority,
        },
        create: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          displayPriority: cat.displayPriority,
        },
      });
    }

    // 2. Seed Products
    for (const p of INITIAL_PRODUCTS) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: p.slug },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            id: p.id,
            title: p.title,
            slug: p.slug,
            styleCode: p.styleCode,
            description: p.description,
            craftNotes: p.craftNotes,
            careDetails: p.careDetails,
            sizeChartImage: p.sizeChartImage ?? null,
            leatherGrade: p.leatherGrade,
            material: p.material,
            colorFamily: p.colorFamily,
            priceInPence: p.priceInPence,
            currency: p.currency,
            status: p.status,
            isTopSelling: p.isTopSelling,
            isNewArrival: p.isNewArrival,
            isFeaturedHero: p.isFeaturedHero,
            displayPriority: p.displayPriority,
            categoryId: p.categoryId,
            images: {
              create: p.images.map((img) => ({
                url: img.url,
                altText: img.altText,
                isPrimary: img.isPrimary,
                position: img.position,
              })),
            },
            variants: {
              create: p.variants.map((v) => ({
                size: v.size,
                color: v.color,
                colorHex: v.colorHex,
                materialVariation: v.materialVariation,
                stockQuantity: v.stockQuantity,
                sku: v.sku,
                displayPriority: v.displayPriority,
              })),
            },
          },
        });
      } else if (p.sizeChartImage) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: { sizeChartImage: p.sizeChartImage },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'ACEMEN luxury database successfully seeded.',
    });
  } catch (err: any) {
    console.error('Seed API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
