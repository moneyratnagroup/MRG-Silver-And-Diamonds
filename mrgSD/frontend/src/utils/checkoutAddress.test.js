import test from 'node:test';
import assert from 'node:assert/strict';
import { saveCheckoutAddress } from './checkoutAddress.js';

const form = { addressLine1: ' 12 Main Road ', addressLine2: '', landmark: '', city: 'Kochi', state: 'Kerala', zip: '682001', country: 'India' };

test('saves delivery fields using the account address API', async () => {
  const calls = [];
  const result = await saveCheckoutAddress(form, async (path, options) => {
    calls.push({ path, options });
    return { ok: true, json: async () => options ? { id: 1, ...JSON.parse(options.body) } : [] };
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].path, '/api/v1/auth/me/addresses');
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(result.address_line_1, '12 Main Road');
  assert.equal(result.zip_code, '682001');
  assert.equal(result.is_default, false);
});

test('payment retries reuse an existing address despite casing and spacing', async () => {
  let calls = 0;
  const existing = { id: 2, address_line_1: '12  MAIN road', address_line_2: null, city: 'kochi', state: 'Kerala', zip_code: '682001', country: 'India' };
  const result = await saveCheckoutAddress(form, async () => {
    calls++;
    return { ok: true, json: async () => [existing] };
  });
  assert.equal(result.id, 2);
  assert.equal(calls, 1);
});

test('failed lookup does not attempt to create a duplicate address', async () => {
  let calls = 0;
  await assert.rejects(saveCheckoutAddress(form, async () => { calls++; return { ok: false }; }), /Unable to check/);
  assert.equal(calls, 1);
});

test('failed save reports a retryable error', async () => {
  await assert.rejects(saveCheckoutAddress(form, async (path, options) => options ? { ok: false } : { ok: true, json: async () => [] }), /Unable to save/);
});
