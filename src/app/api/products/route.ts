import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const productCreateSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().optional(),
  styleCode: z.string().min(2, 'Style code/SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(5, 'Description is required'),
  craftNotes: z.string().optional().nullable(),
  careDetails: z.string().optional().nullable(),
  sizeChartImage: z.string().optional().nullable(),
  leatherGrade: z.string().optional().nullable(),
  material: z.string().default('Genuine Leather'),
  colorFamily: z.string().default('Black'),
  priceInPence: z.number().int().positive('Price must be greater than 0 pence'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).default('ACTIVE'),
  isTopSelling: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isFeaturedHero: z.boolean().default(false),
  displayPriority: z.number().int().default(0),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
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
        sku: z.string().min(1),
        size: z.string().min(1),
        color: z.string().min(1),
        colorHex: z.string().optional().nullable(),
        materialVariation: z.string().optional().nullable(),
        priceOverrideInPence: z.number().int().optional().nullable(),
        stockQuantity: z.number().int().min(0),
        isActive: z.boolean().default(true),
        displayPriority: z.number().int().default(0),
      })
    )
    .min(1, 'At least one variant/size is required'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const hero = searchParams.get('hero');
    const topSelling = searchParams.get('topSelling');
    const newArrival = searchParams.get('newArrival');
    const query = searchParams.get('q');
    const sort = searchParams.get('sort'); // 'featured', 'price-asc', 'price-desc', 'top-selling'
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const statusParam = searchParams.get('status');

    const where: any = {};

    // Filter by active status unless specifically requesting admin status
    if (statusParam) {
      where.status = statusParam;
    } else {
      where.status = 'ACTIVE';
    }

    if (categorySlug === 'shoes') {
      where.category = {
        slug: {
          in: ['shoes', 'shoes-oxford', 'shoes-chelsea', 'shoes-derby', 'shoes-loafer', 'shoes-monk', 'shoes-boots'],
        },
      };
    } else if (categorySlug === 'bags') {
      where.category = {
        slug: {
          in: ['bags', 'bags-laptop', 'bags-handbag', 'bags-weekender', 'bags-backpack', 'bags-messenger'],
        },
      };
    } else if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (hero === 'true') {
      where.isFeaturedHero = true;
    }

    if (topSelling === 'true') {
      where.isTopSelling = true;
    }

    if (newArrival === 'true') {
      where.isNewArrival = true;
    }

    if (color) {
      where.colorFamily = { contains: color };
    }

    if (minPrice || maxPrice) {
      where.priceInPence = {};
      if (minPrice) where.priceInPence.gte = parseInt(minPrice);
      if (maxPrice) where.priceInPence.lte = parseInt(maxPrice);
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { leatherGrade: { contains: query } },
        { material: { contains: query } },
        { styleCode: { contains: query } },
      ];
    }

    // Determine sorting
    let orderBy: any = [{ displayPriority: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'price-asc') {
      orderBy = [{ priceInPence: 'asc' }];
    } else if (sort === 'price-desc') {
      orderBy = [{ priceInPence: 'desc' }];
    } else if (sort === 'top-selling') {
      orderBy = [{ isTopSelling: 'desc' }, { displayPriority: 'desc' }];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
        variants: {
          orderBy: { displayPriority: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    console.error('[API Products GET Error]', err);
    return NextResponse.json({ error: 'Failed to retrieve catalog' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
    }

    const json = await req.json();
    const result = productCreateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProduct = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        styleCode: data.styleCode,
        description: data.description,
        craftNotes: data.craftNotes,
        careDetails: data.careDetails,
        sizeChartImage: data.sizeChartImage,
        leatherGrade: data.leatherGrade,
        material: data.material,
        colorFamily: data.colorFamily,
        priceInPence: data.priceInPence,
        status: data.status,
        isTopSelling: data.isTopSelling,
        isNewArrival: data.isNewArrival,
        isFeaturedHero: data.isFeaturedHero,
        displayPriority: data.displayPriority,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        categoryId: data.categoryId,
        images: {
          create: (data.images || []).map((img, idx) => ({
            url: img.url,
            altText: img.altText,
            position: img.position ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        },
        variants: {
          create: data.variants.map((v, idx) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            materialVariation: v.materialVariation,
            priceOverrideInPence: v.priceOverrideInPence,
            stockQuantity: v.stockQuantity,
            isActive: v.isActive,
            displayPriority: v.displayPriority ?? idx,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    console.error('[API Products POST Error]', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
