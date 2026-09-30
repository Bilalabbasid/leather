const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newProducts = [
  // 7. The Marylebone Derby Brogue
  {
    id: 'prod-marylebone-derby',
    title: 'The Marylebone Derby Brogue',
    slug: 'the-marylebone-derby-brogue',
    styleCode: 'ACM-SH-003',
    description: 'Open-lacing brogue silhouette in rich chocolate full-grain calfskin. Defined by hand-punched wingtip medallions and Goodyear-welted storm construction. Versatile enough for City boardrooms and country estates alike.',
    craftNotes: 'Each brogue perforation is hand-punched by master craftsmen in our Northamptonshire workshop. The open-lacing derby construction allows generous fitting across all widths.',
    careDetails: 'Polish with matching shade cream. Use cedar shoe trees immediately after wear. Re-sole at 18-month intervals at our London atelier.',
    leatherGrade: 'Full-Grain Chocolate Calfskin (Annonay Tannery)',
    material: 'Full-Grain Calfskin & Oak Bark Leather Sole',
    colorFamily: 'Brown',
    priceInPence: 72000,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: false,
    isNewArrival: true,
    isFeaturedHero: false,
    displayPriority: 82,
    categoryId: 'cat-shoes-derby',
    metaTitle: 'The Marylebone Derby Brogue | ACEMEN Footwear',
    metaDescription: 'Goodyear-welted hand-punched brogue derby shoe in full-grain Annonay calfskin. Northamptonshire craftsmanship.',
    images: [
      {
        id: 'img-drb-1',
        url: '/images/products/derby_shoes_pair.jpg',
        altText: 'ACEMEN Marylebone Derby Brogue pair on marble',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-drb-1', sku: 'ACM-SH-003-7', size: 'UK 7 / EU 41', color: 'Chocolate Brown', colorHex: '#3D1F0A', stockQuantity: 5, isActive: true, displayPriority: 1 },
      { id: 'var-drb-2', sku: 'ACM-SH-003-8', size: 'UK 8 / EU 42', color: 'Chocolate Brown', colorHex: '#3D1F0A', stockQuantity: 8, isActive: true, displayPriority: 2 },
      { id: 'var-drb-3', sku: 'ACM-SH-003-9', size: 'UK 9 / EU 43', color: 'Chocolate Brown', colorHex: '#3D1F0A', stockQuantity: 6, isActive: true, displayPriority: 3 },
      { id: 'var-drb-4', sku: 'ACM-SH-003-10', size: 'UK 10 / EU 44', color: 'Chocolate Brown', colorHex: '#3D1F0A', stockQuantity: 3, isActive: true, displayPriority: 4 },
    ],
  },

  // 8. The Mayfair Cognac Loafer
  {
    id: 'prod-mayfair-loafer',
    title: 'The Mayfair Cognac Loafer',
    slug: 'the-mayfair-cognac-loafer',
    styleCode: 'ACM-SH-004',
    description: 'Hand-sewn moccasin construction in warm cognac calfskin. The signature brass coin medallion at the vamp is hand-cast in solid brass and polished to a mirror sheen. Flexible leather sole with rubber tread insert.',
    craftNotes: 'The upper is wet-moulded over the last for 72 hours before assembly, ensuring a glove-like fit from the first wear.',
    careDetails: 'Condition monthly with matching cognac leather cream. Use shoe bags when travelling. Avoid prolonged wet conditions.',
    leatherGrade: 'Cognac Full-Grain Calfskin',
    material: 'Full-Grain Calfskin & Flexible Leather Sole',
    colorFamily: 'Tan',
    priceInPence: 58000,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: true,
    isNewArrival: false,
    isFeaturedHero: false,
    displayPriority: 81,
    categoryId: 'cat-shoes-loafer',
    metaTitle: 'The Mayfair Cognac Loafer | ACEMEN Footwear',
    metaDescription: 'Hand-sewn cognac calfskin penny loafer with solid brass coin medallion. London atelier.',
    images: [
      {
        id: 'img-lof-1',
        url: '/images/products/loafer_shoes_pair.jpg',
        altText: 'ACEMEN Mayfair Cognac Loafer pair on stone',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-lof-1', sku: 'ACM-SH-004-7', size: 'UK 7 / EU 41', color: 'Cognac Tan', colorHex: '#B8763D', stockQuantity: 7, isActive: true, displayPriority: 1 },
      { id: 'var-lof-2', sku: 'ACM-SH-004-8', size: 'UK 8 / EU 42', color: 'Cognac Tan', colorHex: '#B8763D', stockQuantity: 10, isActive: true, displayPriority: 2 },
      { id: 'var-lof-3', sku: 'ACM-SH-004-9', size: 'UK 9 / EU 43', color: 'Cognac Tan', colorHex: '#B8763D', stockQuantity: 6, isActive: true, displayPriority: 3 },
      { id: 'var-lof-4', sku: 'ACM-SH-004-10', size: 'UK 10 / EU 44', color: 'Cognac Tan', colorHex: '#B8763D', stockQuantity: 2, isActive: true, displayPriority: 4 },
    ],
  },

  // 9. The Westminster Double Monk
  {
    id: 'prod-westminster-monk',
    title: 'The Westminster Double Monk',
    slug: 'the-westminster-double-monk',
    styleCode: 'ACM-SH-005',
    description: 'Architectural double-buckle monk strap in deep espresso calfskin. Solid cast-brass buckles with a satin-brushed finish. Cap-toe seam adds structural drama to the chisel silhouette.',
    craftNotes: 'The twin-buckle closure is a hallmark of Continental elegance — no lacing, no compromise. Storm-welted and finished with 240-step hand-burnishing.',
    careDetails: 'Condition with dark espresso leather cream. Polish buckles with soft brass cloth. Insert cedar trees after each wear.',
    leatherGrade: 'Dark Espresso Full-Grain Calfskin',
    material: 'Full-Grain Calfskin & Goodyear Welt',
    colorFamily: 'Dark Brown',
    priceInPence: 78000,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: false,
    isNewArrival: true,
    isFeaturedHero: false,
    displayPriority: 80,
    categoryId: 'cat-shoes-monk',
    metaTitle: 'The Westminster Double Monk Strap | ACEMEN Footwear',
    metaDescription: 'Goodyear-welted double monk strap in espresso calfskin with solid brass buckles.',
    images: [
      {
        id: 'img-mnk-1',
        url: '/images/products/monk_strap_shoes_pair.jpg',
        altText: 'ACEMEN Westminster Double Monk strap shoes pair',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-mnk-1', sku: 'ACM-SH-005-7', size: 'UK 7 / EU 41', color: 'Espresso Dark Brown', colorHex: '#2A1208', stockQuantity: 4, isActive: true, displayPriority: 1 },
      { id: 'var-mnk-2', sku: 'ACM-SH-005-8', size: 'UK 8 / EU 42', color: 'Espresso Dark Brown', colorHex: '#2A1208', stockQuantity: 7, isActive: true, displayPriority: 2 },
      { id: 'var-mnk-3', sku: 'ACM-SH-005-9', size: 'UK 9 / EU 43', color: 'Espresso Dark Brown', colorHex: '#2A1208', stockQuantity: 5, isActive: true, displayPriority: 3 },
    ],
  },

  // 10. The Knightsbridge Dress Boot
  {
    id: 'prod-knightsbridge-boot',
    title: 'The Knightsbridge Dress Boot',
    slug: 'the-knightsbridge-dress-boot',
    styleCode: 'ACM-SH-006',
    description: 'A refined lace-up dress boot that bridges formal and field with authority. Executed in midnight black full-grain calfskin with storm-welted Goodyear construction. The seven-eyelet profile provides commanding ankle structure.',
    craftNotes: 'The military-inspired last is exclusive to ACEMEN. Hand-lasted over 96 hours and finished with a high-shine toe cap mirror glaze.',
    careDetails: 'Polish with black wax cream. Treat welt seam annually with saddle soap. Insert shoe trees after every wear.',
    leatherGrade: 'Midnight Black Full-Grain Calfskin',
    material: 'Full-Grain Calfskin & Storm-Welted Sole',
    colorFamily: 'Black',
    priceInPence: 86000,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: false,
    isNewArrival: false,
    isFeaturedHero: false,
    displayPriority: 79,
    categoryId: 'cat-shoes-boots',
    metaTitle: 'The Knightsbridge Dress Boot | ACEMEN Footwear',
    metaDescription: 'Storm-welted Goodyear dress boot in midnight black calfskin with military-inspired construction.',
    images: [
      {
        id: 'img-kbt-1',
        url: '/images/products/dress_boots_pair.jpg',
        altText: 'ACEMEN Knightsbridge Dress Boot pair on marble',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-kbt-1', sku: 'ACM-SH-006-7', size: 'UK 7 / EU 41', color: 'Midnight Black', colorHex: '#0A0A0A', stockQuantity: 4, isActive: true, displayPriority: 1 },
      { id: 'var-kbt-2', sku: 'ACM-SH-006-8', size: 'UK 8 / EU 42', color: 'Midnight Black', colorHex: '#0A0A0A', stockQuantity: 6, isActive: true, displayPriority: 2 },
      { id: 'var-kbt-3', sku: 'ACM-SH-006-9', size: 'UK 9 / EU 43', color: 'Midnight Black', colorHex: '#0A0A0A', stockQuantity: 5, isActive: true, displayPriority: 3 },
      { id: 'var-kbt-4', sku: 'ACM-SH-006-10', size: 'UK 10 / EU 44', color: 'Midnight Black', colorHex: '#0A0A0A', stockQuantity: 2, isActive: true, displayPriority: 4 },
    ],
  },

  // 11. The City Leather Briefcase
  {
    id: 'prod-city-briefcase',
    title: 'The City Leather Briefcase',
    slug: 'the-city-leather-briefcase',
    styleCode: 'ACM-BG-003',
    description: 'Structured single-compartment briefcase in warm cognac full-grain leather. Fits a 15" laptop and A4 documents. Brass stud feet, solid D-ring for optional strap, and antiqued brass turn-lock closure.',
    craftNotes: 'Hand-stitched with 0.8mm waxed linen thread. Full leather interior lining in matching cognac. Corner gussets are double-layered for structural integrity.',
    careDetails: 'Wipe with damp cloth only. Condition with neutral leather balm annually. Store with tissue paper padding when not in use.',
    leatherGrade: 'Cognac Vegetable-Tanned Full-Grain Cowhide',
    material: 'Full-Grain Cowhide & Brass Hardware',
    colorFamily: 'Tan',
    priceInPence: 49500,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: true,
    isNewArrival: false,
    isFeaturedHero: false,
    displayPriority: 76,
    categoryId: 'cat-bags-laptop',
    metaTitle: 'The City Leather Briefcase | ACEMEN Bags',
    metaDescription: 'Structured full-grain cognac leather briefcase with brass hardware. Fits 15" laptop.',
    images: [
      {
        id: 'img-bfc-1',
        url: '/images/products/leather_briefcase.jpg',
        altText: 'ACEMEN City Leather Briefcase in cognac standing upright',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-bfc-1', sku: 'ACM-BG-003-COG', size: 'One Size (38 x 28 x 10 cm)', color: 'Cognac Tan', colorHex: '#B8763D', stockQuantity: 8, isActive: true, displayPriority: 1 },
    ],
  },

  // 12. The Kensington Structured Handbag
  {
    id: 'prod-kensington-handbag',
    title: 'The Kensington Structured Handbag',
    slug: 'the-kensington-structured-handbag',
    styleCode: 'ACM-BG-004',
    description: 'Architectural chocolate pebbled calfskin handbag. Trapeze silhouette with dual rolled leather handles and detachable shoulder strap. Gold-plated turn-lock and four solid base studs protect the base.',
    craftNotes: 'The silhouette is held rigid by a hand-bent internal steel frame — ensuring the architectural shape is preserved even when empty.',
    careDetails: 'Stuff with tissue paper when stored. Condition with neutral balm. Avoid contact with light-coloured fabrics.',
    leatherGrade: 'Pebbled Full-Grain Calfskin',
    material: 'Full-Grain Calfskin & Gold Hardware',
    colorFamily: 'Dark Brown',
    priceInPence: 67500,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: false,
    isNewArrival: true,
    isFeaturedHero: false,
    displayPriority: 75,
    categoryId: 'cat-bags-handbag',
    metaTitle: 'The Kensington Structured Handbag | ACEMEN Bags',
    metaDescription: 'Architectural pebbled calfskin handbag with gold-plated hardware and rigid internal frame.',
    images: [
      {
        id: 'img-hbg-1',
        url: '/images/products/leather_handbag.jpg',
        altText: 'ACEMEN Kensington Structured Handbag on marble plinth',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-hbg-1', sku: 'ACM-BG-004-CHO', size: 'One Size (32 x 24 x 12 cm)', color: 'Chocolate Dark Brown', colorHex: '#2A1A0E', stockQuantity: 6, isActive: true, displayPriority: 1 },
    ],
  },

  // 13. The Fitzrovia Leather Backpack
  {
    id: 'prod-fitzrovia-backpack',
    title: 'The Fitzrovia Leather Backpack',
    slug: 'the-fitzrovia-leather-backpack',
    styleCode: 'ACM-BG-005',
    description: 'Architect-grade navy full-grain leather rucksack with padded laptop compartment. Solid brass antique-finish buckle closures. Padded back panel with moisture-wicking canvas. Hand-stitched reinforced base panel.',
    craftNotes: 'The triple-buckle closure system is rated for 40kg load bearing. Interior has dedicated 15" laptop sleeve and three organiser pockets.',
    careDetails: 'Wipe exterior with damp cloth. Condition brass hardware quarterly. Avoid overfilling to preserve strap integrity.',
    leatherGrade: 'Navy Full-Grain Leather',
    material: 'Full-Grain Leather & Canvas Lining',
    colorFamily: 'Navy',
    priceInPence: 44500,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: false,
    isNewArrival: true,
    isFeaturedHero: false,
    displayPriority: 74,
    categoryId: 'cat-bags-backpack',
    metaTitle: 'The Fitzrovia Leather Backpack | ACEMEN Bags',
    metaDescription: 'Full-grain navy leather backpack with solid brass hardware and padded laptop compartment.',
    images: [
      {
        id: 'img-bpk-1',
        url: '/images/products/leather_backpack.jpg',
        altText: 'ACEMEN Fitzrovia Leather Backpack on marble plinth',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-bpk-1', sku: 'ACM-BG-005-NAV', size: 'One Size (35 x 45 x 15 cm)', color: 'Navy Black', colorHex: '#1A1F2E', stockQuantity: 10, isActive: true, displayPriority: 1 },
    ],
  },

  // 14. The Shoreditch Messenger
  {
    id: 'prod-shoreditch-messenger',
    title: 'The Shoreditch Messenger',
    slug: 'the-shoreditch-messenger',
    styleCode: 'ACM-BG-006',
    description: 'Rugged saddle-tan vegetable-tanned leather messenger bag with dual antiqued brass buckle closure. Wide adjustable canvas shoulder strap. Three external pockets and full main compartment with padded divider.',
    craftNotes: 'Vegetable-tanned leather is naturally water-resistant and develops a rich patina unique to each owner — it only improves with age and use.',
    careDetails: 'Allow to air dry naturally if wet. Oil with neatsfoot conditioner in winter. Brass fittings can be polished with standard brass cleaner.',
    leatherGrade: 'Saddle Tan Vegetable-Tanned Cowhide',
    material: 'Vegetable-Tanned Cowhide & Brass Hardware',
    colorFamily: 'Tan',
    priceInPence: 38500,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: true,
    isNewArrival: false,
    isFeaturedHero: false,
    displayPriority: 73,
    categoryId: 'cat-bags-messenger',
    metaTitle: 'The Shoreditch Messenger Bag | ACEMEN Bags',
    metaDescription: 'Saddle tan vegetable-tanned leather messenger bag with antique brass hardware.',
    images: [
      {
        id: 'img-msg-1',
        url: '/images/products/leather_messenger_bag.jpg',
        altText: 'ACEMEN Shoreditch Messenger Bag on concrete',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-msg-1', sku: 'ACM-BG-006-TAN', size: 'One Size (38 x 28 x 8 cm)', color: 'Saddle Tan', colorHex: '#B87333', stockQuantity: 12, isActive: true, displayPriority: 1 },
    ],
  },

  // 15. The Mayfair Bridle Belt
  {
    id: 'prod-mayfair-belt',
    title: 'The Mayfair Bridle Belt',
    slug: 'the-mayfair-bridle-belt',
    styleCode: 'ACM-BLT-001',
    description: 'Hand-cut from a single hide of dark chocolate English bridle leather. Solid cast-brass rectangular buckle with antique finish. 30mm width — the exact right proportion for formal trousers and business suits.',
    craftNotes: 'Bridle leather is traditional English tannage — impregnated with tallows and waxes for supreme weather resistance. Edges are hand-burnished over an open flame.',
    careDetails: 'Apply neatsfoot oil annually. Roll rather than fold when storing. Buckle can be repolished with brass cloth.',
    leatherGrade: 'English Bridle Leather (Sedgwick Tannery)',
    material: 'Bridle Leather & Solid Cast Brass',
    colorFamily: 'Dark Brown',
    priceInPence: 18500,
    currency: 'GBP',
    status: 'ACTIVE',
    isTopSelling: false,
    isNewArrival: false,
    isFeaturedHero: false,
    displayPriority: 65,
    categoryId: 'cat-belts',
    metaTitle: 'The Mayfair Bridle Belt | ACEMEN Accessories',
    metaDescription: 'Hand-cut English bridle leather belt with solid brass buckle from Sedgwick tannery.',
    images: [
      {
        id: 'img-blt-1',
        url: '/images/products/leather_belt_product.jpg',
        altText: 'ACEMEN Mayfair Bridle Belt coiled on marble surface',
        position: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-blt-1', sku: 'ACM-BLT-001-30', size: '30" / 76cm', color: 'Dark Chocolate', colorHex: '#2A1208', stockQuantity: 8, isActive: true, displayPriority: 1 },
      { id: 'var-blt-2', sku: 'ACM-BLT-001-32', size: '32" / 81cm', color: 'Dark Chocolate', colorHex: '#2A1208', stockQuantity: 12, isActive: true, displayPriority: 2 },
      { id: 'var-blt-3', sku: 'ACM-BLT-001-34', size: '34" / 86cm', color: 'Dark Chocolate', colorHex: '#2A1208', stockQuantity: 10, isActive: true, displayPriority: 3 },
      { id: 'var-blt-4', sku: 'ACM-BLT-001-36', size: '36" / 91cm', color: 'Dark Chocolate', colorHex: '#2A1208', stockQuantity: 6, isActive: true, displayPriority: 4 },
      { id: 'var-blt-5', sku: 'ACM-BLT-001-38', size: '38" / 97cm', color: 'Dark Chocolate', colorHex: '#2A1208', stockQuantity: 4, isActive: true, displayPriority: 5 },
    ],
  },
];

async function seedProducts() {
  console.log('[Seed] Seeding 9 new luxury products...');

  for (const prod of newProducts) {
    const upserted = await prisma.product.upsert({
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

    // Clean sync images & variants
    await prisma.productImage.deleteMany({
      where: { productId: upserted.id },
    });
    await prisma.variant.deleteMany({
      where: { productId: upserted.id },
    });

    for (const img of prod.images) {
      await prisma.productImage.create({
        data: {
          id: img.id,
          url: img.url,
          altText: img.altText,
          position: img.position,
          isPrimary: img.isPrimary,
          productId: upserted.id,
        },
      });
    }

    for (const v of prod.variants) {
      await prisma.variant.create({
        data: {
          id: v.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stockQuantity: v.stockQuantity,
          isActive: v.isActive,
          displayPriority: v.displayPriority,
          productId: upserted.id,
        },
      });
    }

    console.log(`  ✓ Seeded: ${prod.title} (${prod.slug})`);
  }

  const total = await prisma.product.count();
  console.log(`[Seed] Complete! Total products in database: ${total}`);
  await prisma.$disconnect();
}

seedProducts().catch(function(e) {
  console.error('[Seed Error]:', e);
  process.exit(1);
});
