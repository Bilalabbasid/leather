import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const productUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().optional(),
  styleCode: z.string().optional(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  craftNotes: z.string().optional().nullable(),
  careDetails: z.string().optional().nullable(),
  leatherGrade: z.string().optional().nullable(),
  material: z.string().optional(),
  colorFamily: z.string().optional(),
  priceInPence: z.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  isTopSelling: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isFeaturedHero: z.boolean().optional(),
  displayPriority: z.number().int().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().min(1),
        altText: z.string().optional().nullable(),
        position: z.number().int().default(0),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string(),
        size: z.string(),
        color: z.string(),
        colorHex: z.string().optional().nullable(),
        materialVariation: z.string().optional().nullable(),
        priceOverrideInPence: z.number().int().optional().nullable(),
        stockQuantity: z.number().int(),
        isActive: z.boolean().default(true),
        displayPriority: z.number().int().default(0),
      })
    )
    .optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: { displayPriority: 'asc' } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const json = await req.json();
    const result = productUpdateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', issues: result.error.issues }, { status: 400 });
    }

    const data = result.data;

    // Transaction to update product, replace or update images and variants
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      const p = await tx.product.update({
        where: { id: params.id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.slug && { slug: data.slug }),
          ...(data.styleCode && { styleCode: data.styleCode }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.description && { description: data.description }),
          ...(data.craftNotes !== undefined && { craftNotes: data.craftNotes }),
          ...(data.careDetails !== undefined && { careDetails: data.careDetails }),
          ...(data.leatherGrade !== undefined && { leatherGrade: data.leatherGrade }),
          ...(data.material && { material: data.material }),
          ...(data.colorFamily && { colorFamily: data.colorFamily }),
          ...(data.priceInPence && { priceInPence: data.priceInPence }),
          ...(data.status && { status: data.status }),
          ...(data.isTopSelling !== undefined && { isTopSelling: data.isTopSelling }),
          ...(data.isNewArrival !== undefined && { isNewArrival: data.isNewArrival }),
          ...(data.isFeaturedHero !== undefined && { isFeaturedHero: data.isFeaturedHero }),
          ...(data.displayPriority !== undefined && { displayPriority: data.displayPriority }),
          ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
          ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        },
      });

      // 2. Images update if provided
      if (data.images) {
        await tx.productImage.deleteMany({ where: { productId: params.id } });
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          await tx.productImage.create({
            data: {
              url: img.url,
              altText: img.altText,
              position: img.position ?? i,
              isPrimary: img.isPrimary ?? i === 0,
              productId: params.id,
            },
          });
        }
      }

      // 3. Variants update if provided
      if (data.variants) {
        for (const v of data.variants) {
          if (v.id) {
            await tx.variant.upsert({
              where: { id: v.id },
              update: {
                sku: v.sku,
                size: v.size,
                color: v.color,
                colorHex: v.colorHex,
                materialVariation: v.materialVariation,
                priceOverrideInPence: v.priceOverrideInPence,
                stockQuantity: v.stockQuantity,
                isActive: v.isActive,
                displayPriority: v.displayPriority,
              },
              create: {
                id: v.id,
                sku: v.sku,
                size: v.size,
                color: v.color,
                colorHex: v.colorHex,
                materialVariation: v.materialVariation,
                priceOverrideInPence: v.priceOverrideInPence,
                stockQuantity: v.stockQuantity,
                isActive: v.isActive,
                displayPriority: v.displayPriority,
                productId: params.id,
              },
            });
          } else {
            await tx.variant.create({
              data: {
                sku: v.sku,
                size: v.size,
                color: v.color,
                colorHex: v.colorHex,
                materialVariation: v.materialVariation,
                priceOverrideInPence: v.priceOverrideInPence,
                stockQuantity: v.stockQuantity,
                isActive: v.isActive,
                displayPriority: v.displayPriority,
                productId: params.id,
              },
            });
          }
        }
      }

      return await tx.product.findUnique({
        where: { id: params.id },
        include: {
          category: true,
          images: { orderBy: { position: 'asc' } },
          variants: { orderBy: { displayPriority: 'asc' } },
        },
      });
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error('[Product PUT Error]', err);
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Soft delete by archiving to preserve historical integrity of existing orders
    await prisma.product.update({
      where: { id: params.id },
      data: { status: 'ARCHIVED' },
    });

    return NextResponse.json({ success: true, message: 'Product archived.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to archive product' }, { status: 500 });
  }
}
