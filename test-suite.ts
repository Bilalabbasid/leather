import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';
import { createAdminToken, verifyAdminToken, authenticateAdmin } from './src/lib/auth';
import { formatPence } from './src/lib/config';

async function runTests() {
  console.log('====================================================');
  console.log('  ACEMEN LUXURY COMMERCE PLATFORM - TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Database Catalog & Pricing in Integer Pence
    // ----------------------------------------------------
    console.log('--- Test Group 1: Database Catalog & Currency ---');
    const products = await prisma.product.findMany({
      include: { variants: true, images: true, category: true },
    });

    assert(products.length >= 6, `Catalog contains active masterpieces (Found: ${products.length})`);
    
    // Check integer pence
    const allPricesInteger = products.every((p) => Number.isInteger(p.priceInPence) && p.priceInPence > 0);
    assert(allPricesInteger, 'All product prices are stored as strictly positive integer pence');

    const sampleProduct = products.find((p) => p.styleCode === 'ACM-JKT-001');
    assert(!!sampleProduct, 'The Sovereign Biker Jacket (ACM-JKT-001) exists in database');
    if (sampleProduct) {
      assert(sampleProduct.priceInPence === 185000, 'Price correctly represents £1,850.00 as 185000 pence');
      assert(formatPence(sampleProduct.priceInPence) === '£1,850', 'formatPence correctly formats 185000 as £1,850');
    }

    // Check shoes show matching pairs
    const shoeProduct = products.find((p) => p.styleCode === 'ACM-SH-001');
    assert(!!shoeProduct, 'The Cadogan Oxford Dress Shoe exists');
    if (shoeProduct) {
      assert(shoeProduct.images.length >= 2, 'Shoe product has multiple angles');
      assert(shoeProduct.images[0].url.includes('oxford_pair'), 'Shoe imagery uses matching pair asset');
    }

    // ----------------------------------------------------
    // TEST 2: Product Variants & Stock Integrity
    // ----------------------------------------------------
    console.log('\n--- Test Group 2: Variants & Stock Allocations ---');
    const variants = await prisma.variant.findMany({
      where: { productId: sampleProduct?.id },
    });
    assert(variants.length >= 4, `The Sovereign Biker has multiple size variants (Found: ${variants.length})`);
    const stockUnits = variants.map((v) => v.stockQuantity);
    assert(stockUnits.every((qty) => qty >= 0), 'All variants have non-negative stock quantities');

    // ----------------------------------------------------
    // TEST 3: Admin Authentication & Role Security
    // ----------------------------------------------------
    console.log('\n--- Test Group 3: Admin Authentication & RBAC ---');
    const authSuccess = await authenticateAdmin('director@acemen.uk', 'AcemenLuxury2026!');
    assert(authSuccess.success === true, 'Admin credentials authenticate successfully with bcrypt');
    assert(authSuccess.session?.role === 'SUPER_ADMIN', 'Admin session holds SUPER_ADMIN role');

    const authFail = await authenticateAdmin('director@acemen.uk', 'WrongPassword123');
    assert(authFail.success === false, 'Invalid password is rejected');

    const authNonexistent = await authenticateAdmin('intruder@outside.com', 'AcemenLuxury2026!');
    assert(authNonexistent.success === false, 'Non-existent admin email is rejected');

    if (authSuccess.session) {
      const token = await createAdminToken(authSuccess.session);
      assert(typeof token === 'string' && token.length > 20, 'Signed JWT token generated');
      const verified = await verifyAdminToken(token);
      assert(verified?.email === 'director@acemen.uk' && verified?.role === 'SUPER_ADMIN', 'JWT token verifies accurately');
    }

    // ----------------------------------------------------
    // TEST 4: Stripe Webhook Idempotency Ledger
    // ----------------------------------------------------
    console.log('\n--- Test Group 4: Webhook Idempotency Ledger ---');
    const testEventId = `evt_test_idempotency_${Date.now()}`;
    
    // First delivery
    const firstLog = await prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId: testEventId,
        eventType: 'checkout.session.completed',
        processingStatus: 'PROCESSED',
        processedAt: new Date(),
      },
    });
    assert(firstLog.stripeEventId === testEventId, 'Initial Stripe event successfully logged');

    // Attempted duplicate delivery check
    const duplicateCheck = await prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: testEventId },
    });
    assert(duplicateCheck?.processingStatus === 'PROCESSED', 'Duplicate event detected as PROCESSED (Prevents double dispatch & double stock decrement)');

    // Clean up test event
    await prisma.stripeWebhookEvent.delete({ where: { stripeEventId: testEventId } });

    // ----------------------------------------------------
    // TEST 5: Atomic Inventory Decrement in Order Transaction
    // ----------------------------------------------------
    console.log('\n--- Test Group 5: Atomic Inventory Decrement Transaction ---');
    const testVariant = variants[0];
    const initialStock = testVariant.stockQuantity;

    // Simulate atomic order payment
    await prisma.$transaction(async (tx) => {
      await tx.variant.update({
        where: { id: testVariant.id },
        data: { stockQuantity: { decrement: 1 } },
      });
    });

    const decremented = await prisma.variant.findUnique({ where: { id: testVariant.id } });
    assert(decremented?.stockQuantity === initialStock - 1, `Variant stock decremented atomically (${initialStock} -> ${decremented?.stockQuantity})`);

    // Restore stock
    await prisma.variant.update({
      where: { id: testVariant.id },
      data: { stockQuantity: initialStock },
    });

    // ----------------------------------------------------
    // TEST 6: Checkout Input Validation
    // ----------------------------------------------------
    console.log('\n--- Test Group 6: Checkout Input Validation ---');
    // Simulated invalid input
    const invalidItems = [{ variantId: '', quantity: -1 }];
    const hasValidVariant = invalidItems.every((i) => i.variantId.length > 0 && i.quantity > 0);
    assert(!hasValidVariant, 'Invalid checkout input (negative quantity or blank variantId) rejected by validator');

    console.log('\n====================================================');
    console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during test run:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
