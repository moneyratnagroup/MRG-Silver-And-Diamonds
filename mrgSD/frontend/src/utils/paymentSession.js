const sessions = new WeakMap();
const scrollProperties = ['overflow', 'overflow-x', 'overflow-y', 'position', 'top', 'left', 'width', 'height', 'padding-right', 'margin-right', 'touch-action'];
const paymentElements = '.razorpay-container, .razorpay-backdrop';

// Own only the styles and payment overlays created during this checkout attempt.
export function createPaymentSession(doc = document, win = window) {
  sessions.get(doc)?.dispose();
  const originalElements = new Set(doc.querySelectorAll(paymentElements));
  const snapshots = [doc.body, doc.documentElement].map(element => ({
    element,
    properties: scrollProperties.map(property => [property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]),
  }));
  let checkout;
  let disposed = false;
  const session = {
    attach(instance) { checkout = instance; },
    dispose() {
      if (disposed) return;
      disposed = true;
      try {
        checkout?.close();
      } catch {
        // A partially initialised SDK can throw while closing; still unlock the page.
      } finally {
        restore();
        // The SDK may also update styles after invoking its dismissal callback.
        win.requestAnimationFrame?.(restore);
      }
    },
  };
  function restore() {
    if (sessions.get(doc) !== session) return;
    doc.querySelectorAll(paymentElements).forEach(element => {
      if (!originalElements.has(element)) element.remove();
    });
    snapshots.forEach(({ element, properties }) => {
      properties.forEach(([property, value, priority]) => {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      });
    });
  }
  sessions.set(doc, session);
  return session;
}
