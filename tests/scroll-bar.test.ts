import assert from 'node:assert';
import { calculateScrollProgress } from '../src/components/ui/calculate-scroll-progress';

function runScrollProgressBarTests() {
  console.log('================================================================');
  console.log('  ScrollProgressBar Unit Test Suite');
  console.log('================================================================\n');

  console.log('1. Testing initial progress...');
  assert.strictEqual(
    calculateScrollProgress(0, 2000, 1000),
    0,
    'Progress at the top should be 0%',
  );
  console.log('✅ Initial progress verified');

  console.log('\n2. Testing middle-of-page progress...');
  assert.strictEqual(
    calculateScrollProgress(500, 2000, 1000),
    50,
    'Progress at 500px should be 50%',
  );
  console.log('✅ Middle progress verified');

  console.log('\n3. Testing bottom-of-page progress...');
  assert.strictEqual(
    calculateScrollProgress(1000, 2000, 1000),
    100,
    'Progress at the bottom should be 100%',
  );
  console.log('✅ Bottom progress verified');

  console.log('\n4. Testing progress clamping...');
  assert.strictEqual(
    calculateScrollProgress(1100, 2000, 1000),
    100,
    'Progress should not exceed 100%',
  );

  assert.strictEqual(
    calculateScrollProgress(-100, 2000, 1000),
    0,
    'Progress should not fall below 0%',
  );
  console.log('✅ Progress clamping verified');

  console.log('\n5. Testing non-scrollable page...');
  assert.strictEqual(
    calculateScrollProgress(0, 1000, 1000),
    0,
    'Non-scrollable page should have 0% progress',
  );
  console.log('✅ Non-scrollable page verified');

  console.log('\n================================================================');
  console.log('🎉 ALL SCROLL PROGRESS TESTS PASSED');
  console.log('================================================================\n');
}

runScrollProgressBarTests();
