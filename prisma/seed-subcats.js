const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const subcats = [
  { id: 'cat-shoes-oxford', name: 'Oxford Shoes', slug: 'shoes-oxford', description: 'Closed-lacing Goodyear-welted Oxford dress shoes in mirror-burnished French box calfskin. Shown as complete matching pairs.', image: '/images/products/oxford_pair_front.jpg', displayPriority: 89, isActive: true },
  { id: 'cat-shoes-chelsea', name: 'Chelsea Boots', slug: 'shoes-chelsea', description: 'Architectural wholecut Chelsea boots in full-grain Florentine calfskin with storm-welted weather resistance.', image: '/images/products/chelsea_pair_front.jpg', displayPriority: 88, isActive: true },
  { id: 'cat-shoes-derby', name: 'Derby Shoes', slug: 'shoes-derby', description: 'Open-lacing derby silhouettes in vegetable-tanned calf. Versatile for City or country.', image: '/images/products/oxford_pair_front.jpg', displayPriority: 87, isActive: true },
  { id: 'cat-shoes-loafer', name: 'Loafers', slug: 'shoes-loafer', description: 'Hand-sewn penny and tassel loafers in buttery soft calfskin with flexible leather soles.', image: '/images/products/oxford_pair_top.jpg', displayPriority: 86, isActive: true },
  { id: 'cat-shoes-monk', name: 'Monk Straps', slug: 'shoes-monk', description: 'Single and double monk strap shoes with solid brass buckles and Goodyear-welted construction.', image: '/images/products/oxford_pair_front.jpg', displayPriority: 85, isActive: true },
  { id: 'cat-shoes-boots', name: 'Dress Boots', slug: 'shoes-boots', description: 'Lace-up dress boots in full-grain calf and antiqued leathers with storm-welted soles.', image: '/images/products/chelsea_pair_back.jpg', displayPriority: 84, isActive: true },
  { id: 'cat-bags-laptop', name: 'Laptop Bags & Briefcases', slug: 'bags-laptop', description: 'Structured full-grain leather briefcases and laptop bags built for daily City use.', image: '/images/products/duffel_front.jpg', displayPriority: 79, isActive: true },
  { id: 'cat-bags-handbag', name: 'Handbags & Totes', slug: 'bags-handbag', description: 'Architectural totes and handbags in pebbled full-grain cowhide with brass hardware.', image: '/images/products/duffel_angle.jpg', displayPriority: 78, isActive: true },
  { id: 'cat-bags-weekender', name: 'Weekender & Duffel', slug: 'bags-weekender', description: 'Executive travel duffels and weekender bags engineered to international carry-on dimensions.', image: '/images/products/duffel_front.jpg', displayPriority: 77, isActive: true },
  { id: 'cat-bags-backpack', name: 'Backpacks', slug: 'bags-backpack', description: 'Full-grain leather rucksacks combining function with refined atelier aesthetics.', image: '/images/products/duffel_angle.jpg', displayPriority: 76, isActive: true },
  { id: 'cat-bags-messenger', name: 'Messenger Bags', slug: 'bags-messenger', description: 'Single-strap messenger bags in bridle leather with adjustable canvas webbing straps.', image: '/images/products/duffel_front.jpg', displayPriority: 75, isActive: true },
];

async function run() {
  console.log('[Seed] Seeding subcategories...');
  for (const cat of subcats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        displayPriority: cat.displayPriority,
        isActive: cat.isActive,
      },
      create: cat,
    });
    console.log('  ✓', cat.name);
  }
  console.log('[Seed] Done —', subcats.length, 'subcategories created.');
  await prisma.$disconnect();
}

run().catch(function(e) {
  console.error(e);
  process.exit(1);
});
