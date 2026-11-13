import test from 'node:test';
import assert from 'node:assert/strict';
import { getStockStatus, isOutOfStock } from './stock.js';

test('zero stock is out of stock', () => {
  assert.deepEqual(getStockStatus({ stockQuantity: 0 }), { type: 'out', text: 'Out of Stock' });
  assert.equal(isOutOfStock({ stockQuantity: 0 }), true);
});
test('low stock includes the threshold and displays the remaining quantity', () => {
  assert.equal(getStockStatus({ stockQuantity: 5, lowStockThreshold: 5 }).text, 'Low Stock - Only 5 left');
  assert.equal(getStockStatus({ stockQuantity: 1 }).type, 'low');
  assert.equal(isOutOfStock({ stockQuantity: 1 }), false);
});
test('healthy and unknown stock do not display a warning', () => {
  for (const product of [{ stockQuantity: 6 }, {}, { stockQuantity: null }, { stockQuantity: '' }, { stockQuantity: 'invalid' }]) {
    assert.equal(getStockStatus(product), null);
  }
});
test('per-product threshold is respected', () => {
  assert.equal(getStockStatus({ stockQuantity: 8, lowStockThreshold: 10 }).type, 'low');
  assert.equal(getStockStatus({ stockQuantity: 1, lowStockThreshold: 0 }), null);
});
