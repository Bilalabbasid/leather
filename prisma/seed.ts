import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, ALL_SUBCATEGORIES } from '../src/lib/data';

const prisma = new PrismaClient();

async function main() {
  console.log('[ACEMEN Seed] Beginning database initialization...');

  // 1. Seed Admin User
  const adminEmail = 'director@acemen.uk';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('AcemenLuxury2026!', 10);
    await prisma.adminUser.create({
      data: {
        name: 'Executive Director',
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log(`[ACEMEN Seed] Super Admin created: ${adminEmail}`);
  }

  // 2. Seed Top-Level Categories
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        displayPriority: cat.displayPriority,
        isActive: cat.isActive,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayPriority: cat.displayPriority,
        isActive: cat.isActive,
      },
    });
  }
  console.log(`[ACEMEN Seed] ${INITIAL_CATEGORIES.length} Top-Level Categories seeded.`);

  // 3. Seed Shoe & Bag Subcategories
  for (const cat of ALL_SUBCATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        displayPriority: cat.displayPriority,
        isActive: cat.isActive,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayPriority: cat.displayPriority,
        isActive: cat.isActive,
      },
    });
  }
  console.log(`[ACEMEN Seed] ${ALL_SUBCATEGORIES.length} Subcategories seeded.`);


  // 3. Seed Products, Images, and Variants
  for (const prod of INITIAL_PRODUCTS) {
    const upsertedProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        styleCode: prod.styleCode,
        description: prod.description,
        craftNotes: prod.craftNotes,
        careDetails: prod.careDetails,
        leatherGrade: prod.leatherGrade,
        material: prod.material,
        colorFamily: prod.colorFamily,
        priceInPence: prod.priceInPence,
        currency: prod.currency,
        status: prod.status,
        isTopSelling: prod.isTopSelling,
        isNewArrival: prod.isNewArrival,
        isFeaturedHero: prod.isFeaturedHero,
        displayPriority: prod.displayPriority,
        metaTitle: prod.metaTitle,
        metaDescription: prod.metaDescription,
        categoryId: prod.categoryId,
      },
      create: {
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        styleCode: prod.styleCode,
        description: prod.description,
        craftNotes: prod.craftNotes,
        careDetails: prod.careDetails,
        leatherGrade: prod.leatherGrade,
        material: prod.material,
        colorFamily: prod.colorFamily,
        priceInPence: prod.priceInPence,
        currency: prod.currency,
        status: prod.status,
        isTopSelling: prod.isTopSelling,
        isNewArrival: prod.isNewArrival,
        isFeaturedHero: prod.isFeaturedHero,
        displayPriority: prod.displayPriority,
        metaTitle: prod.metaTitle,
        metaDescription: prod.metaDescription,
        categoryId: prod.categoryId,
      },
    });

    // Delete existing images & variants for clean seed sync
    await prisma.productImage.deleteMany({
      where: { productId: upsertedProduct.id },
    });
    await prisma.variant.deleteMany({
      where: { productId: upsertedProduct.id },
    });

    // Create Images
    for (const img of prod.images) {
      await prisma.productImage.create({
        data: {
          id: img.id,
          url: img.url,
          altText: img.altText,
          position: img.position,
          isPrimary: img.isPrimary,
          productId: upsertedProduct.id,
        },
      });
    }

    // Create Variants
    for (const v of prod.variants) {
      await prisma.variant.create({
        data: {
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
          productId: upsertedProduct.id,
        },
      });
    }
  }

  console.log(`[ACEMEN Seed] ${INITIAL_PRODUCTS.length} Products, Images & Variants synchronized.`);
  console.log('[ACEMEN Seed] Complete.');
}

main()
  .catch((e) => {
    console.error('[ACEMEN Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
