import test from 'node:test';
import assert from 'node:assert/strict';
import { createPaymentSession } from './paymentSession.js';

function environment() {
  function element() {
    const values = new Map();
    return {
      style: {
        getPropertyValue: name => values.get(name)?.value || '',
        getPropertyPriority: name => values.get(name)?.priority || '',
        setProperty: (name, value, priority = '') => values.set(name, { value, priority }),
        removeProperty: name => values.delete(name),
      },
    };
  }
  const overlays = [];
  const frames = [];
  const doc = { body: element(), documentElement: element(), querySelectorAll: () => overlays.filter(node => !node.removed) };
  return {
    doc, win: { requestAnimationFrame: callback => frames.push(callback) },
    overlay() { const node = { removed: false, remove() { this.removed = true; } }; overlays.push(node); return node; },
    flush() { frames.splice(0).forEach(callback => callback()); },
  };
}

test('failure cleanup closes checkout, removes its overlay and restores scrolling', () => {
  const { doc, win, overlay, flush } = environment();
  doc.body.style.setProperty('overflow-x', 'clip');
  doc.body.style.setProperty('padding-right', '8px', 'important');
  const session = createPaymentSession(doc, win);
  let closed = 0;
  session.attach({ close() { closed++; } });
  const modal = overlay();
  doc.body.style.setProperty('overflow', 'hidden');
  doc.documentElement.style.setProperty('overflow-y', 'hidden');
  doc.body.style.setProperty('padding-right', '24px');
  session.dispose();
  flush();
  assert.equal(closed, 1);
  assert.equal(modal.removed, true);
  assert.equal(doc.body.style.getPropertyValue('overflow'), '');
  assert.equal(doc.documentElement.style.getPropertyValue('overflow-y'), '');
  assert.equal(doc.body.style.getPropertyValue('overflow-x'), 'clip');
  assert.equal(doc.body.style.getPropertyValue('padding-right'), '8px');
  assert.equal(doc.body.style.getPropertyPriority('padding-right'), 'important');
});

test('cleanup is safe when SDK close triggers dismissal again or throws', () => {
  const { doc, win, overlay } = environment();
  const session = createPaymentSession(doc, win);
  const modal = overlay();
  let closed = 0;
  session.attach({ close() { closed++; session.dispose(); throw new Error('SDK failure'); } });
  doc.body.style.setProperty('overflow', 'hidden');
  session.dispose();
  session.dispose();
  assert.equal(closed, 1);
  assert.equal(modal.removed, true);
  assert.equal(doc.body.style.getPropertyValue('overflow'), '');
});

test('cleanup after navigation also works before SDK initialisation finishes', () => {
  const { doc, win, overlay } = environment();
  const session = createPaymentSession(doc, win);
  const modal = overlay();
  doc.body.style.setProperty('position', 'fixed');
  session.dispose();
  assert.equal(modal.removed, true);
  assert.equal(doc.body.style.getPropertyValue('position'), '');
});

test('deferred SDK style changes are restored without removing pre-existing overlays', () => {
  const { doc, win, overlay, flush } = environment();
  const existing = overlay();
  const session = createPaymentSession(doc, win);
  session.dispose();
  doc.body.style.setProperty('overflow', 'hidden');
  flush();
  assert.equal(doc.body.style.getPropertyValue('overflow'), '');
  assert.equal(existing.removed, false);
});

test('old deferred cleanup cannot unlock or remove a newer payment popup', () => {
  const { doc, win, overlay, flush } = environment();
  const first = createPaymentSession(doc, win);
  first.dispose();
  const second = createPaymentSession(doc, win);
  const modal = overlay();
  doc.body.style.setProperty('overflow', 'hidden');
  flush();
  assert.equal(doc.body.style.getPropertyValue('overflow'), 'hidden');
  assert.equal(modal.removed, false);
  second.dispose();
  assert.equal(doc.body.style.getPropertyValue('overflow'), '');
});
