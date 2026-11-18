// Local layout audit. Uses synthetic API responses; never sends account or payment requests.
// Install playwright-core in a temporary directory or set MRG_PLAYWRIGHT_PATH to its module path.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require(process.env.MRG_PLAYWRIGHT_PATH || path.join(os.tmpdir(), 'mrg-responsive-tools/node_modules/playwright-core'));
const output = path.join(os.tmpdir(), 'mrg-responsive-audit');
fs.mkdirSync(output, { recursive: true });
const categories = [{ id: 1, name: 'Rings' }, { id: 2, name: 'Earrings' }, { id: 3, name: 'Bracelets' }];
const collections = [{ id: 1, name: "Women's Collection" }, { id: 2, name: "Men's Collection" }, { id: 3, name: 'Kids Collection' }];
const products = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1, sku: `AUDIT-${index + 1}`, name: `${['Silver', 'Gold', 'Diamond'][index % 3]} ${index % 2 ? 'Floral Earrings' : 'Classic Ring'}`,
  description: 'A finely crafted piece for everyday wear and special occasions.',
  category: categories[index % 3], collections: [collections[index % 3]], occasions: [],
  metal: { id: index % 3 + 1, name: ['Silver', 'Gold', 'Diamond'][index % 3] }, purity: { name: '925' },
  selling_price: 3500 + index * 100, mrp_price: 5000, status: 'PUBLISHED',
  stock_quantity: index === 0 ? 0 : index === 1 ? 2 : 10, low_stock_threshold: 5,
  is_featured: true, is_new_arrival: true, is_offer_available: false,
  images: [{ image_url: '/src/assets/cat_rings_layout.webp', is_primary: true }],
}));
const user = { id: 1, full_name: 'Test Customer', email: 'customer@example.test', phone_number: '+919000000000', is_active: true, addresses: [] };
const rates = [{ id: 1, metal_name: 'gold22', metal_type: 'Gold', purity: '22K', unit: 'g', rate: 8500, is_active: true, created_at: '2026-11-13T09:00:00Z' }];
const base = process.env.MRG_AUDIT_URL || 'http://127.0.0.1:5173';
const routes = process.env.MRG_AUDIT_ROUTES ? process.env.MRG_AUDIT_ROUTES.split(',') : ['/', '/products', '/silver', '/silver/women', '/gold', '/gold/men', '/diamonds', '/diamonds/women', '/product/1', '/about', '/contact', '/faq', '/careers', '/care-guide', '/cart', '/wishlist', '/checkout', '/account'];
const widths = process.env.MRG_AUDIT_WIDTHS ? process.env.MRG_AUDIT_WIDTHS.split(',').map(Number) : [320, 375, 430, 768, 1024, 1440];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.MRG_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const report = [];
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') localStorage.setItem('mrg_access_token', 'layout-audit-token');
    });
    await context.route('**/api/v1/**', async route => {
      const pathname = new URL(route.request().url()).pathname.replace(/\/$/, '');
      let body = [];
      if (pathname === '/api/v1/auth/me') body = user;
      else if (pathname === '/api/v1/carts') body = products.slice(0, 2).map(product => ({ id: product.id, quantity: 1, product }));
      else if (pathname === '/api/v1/wishlists') body = products.slice(0, 3).map(product => ({ id: product.id, product }));
      else if (pathname === '/api/v1/products/categories') body = categories;
      else if (pathname === '/api/v1/products/collections') body = collections;
      else if (pathname === '/api/v1/products/metals') body = [{ id: 1, name: 'Silver' }, { id: 2, name: 'Gold' }];
      else if (pathname === '/api/v1/products') body = products;
      else if (/\/reviews\/product\//.test(pathname)) body = { average_rating: 4, total_reviews: 1, reviews: [{ id: 1, user_name: 'Test customer', title: 'Beautiful jewellery', comment: 'Lovely design and comfortable to wear.', rating: 4, created_at: '2026-11-13T09:00:00Z' }] };
      else if (pathname.startsWith('/api/v1/metal-rates')) body = rates;
      else if (pathname === '/api/v1/banners') body = [{ id: 1, title: 'Jewellery for every occasion', subtitle: 'Discover our collection', image: '/src/assets/gold_hero2.webp', status: 'publish', link: '/silver' }];
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body), headers: { 'access-control-allow-origin': '*' } });
    });
    const checkWidth = async width => {
      const page = await context.newPage();
      await page.setViewportSize({ width, height: 844 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const route of process.env.MRG_AUDIT_INTERACTIONS === 'only' ? [] : routes) {
        errors.length = 0;
        if (process.env.MRG_AUDIT_SPA && page.url().startsWith(base)) {
          await page.evaluate(route => {
            history.pushState({}, '', route);
            dispatchEvent(new PopStateEvent('popstate'));
          }, route);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(200);
        } else {
          await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
        }
        await page.evaluate(async () => {
          await document.fonts.ready;
          document.documentElement.style.scrollBehavior = 'auto';
          document.querySelectorAll('*').forEach(element => { element.style.animationPlayState = 'paused'; });
        });
        // Exercise lazy sections as well as content above the fold.
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(150);
        await page.evaluate(() => window.scrollTo(0, 0));
        const result = await page.evaluate(() => {
          const width = document.documentElement.clientWidth;
          const overflows = [];
          for (const element of document.querySelectorAll('main *, header *, footer *, nav *')) {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height || style.visibility === 'hidden' || style.opacity === '0' || style.position === 'fixed') continue;
            if (rect.left >= -2 && rect.right <= width + 2) continue;
            let clipped = false;
            for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
              const parentStyle = getComputedStyle(parent);
              if (['hidden', 'clip', 'scroll', 'auto'].includes(parentStyle.overflowX) || parentStyle.visibility === 'hidden' || parentStyle.opacity === '0') { clipped = true; break; }
            }
            if (!clipped && !overflows.some(item => item.selector === element.tagName + '.' + String(element.className).replaceAll(' ', '.'))) {
              overflows.push({ selector: element.tagName + '.' + String(element.className).replaceAll(' ', '.'), left: Math.round(rect.left), right: Math.round(rect.right), text: element.textContent?.trim().slice(0, 65) });
            }
          }
          const textClipping = [...document.querySelectorAll('main h1, main h2, main button, main select')].filter(element => {
            const style = getComputedStyle(element);
            return style.color !== 'rgba(0, 0, 0, 0)' && element.getBoundingClientRect().width && element.scrollWidth > element.clientWidth + 3 && style.textOverflow !== 'ellipsis' && !['auto', 'scroll'].includes(style.overflowX);
          }).map(element => ({ selector: element.tagName + '.' + element.className, text: element.textContent.trim().slice(0, 65) }));
          const clippedContent = [];
          for (const element of document.querySelectorAll('main a, main button, main h1, main h2, main .benefit-card, footer .subscribe-btn')) {
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height || rect.right <= 0 || rect.left >= width || element.closest('.swiper, .editorial-gateway-track')) continue;
            let hidden = false;
            let clippedBy;
            for (let parent = element; parent && parent !== document.body; parent = parent.parentElement) {
              const style = getComputedStyle(parent);
              if (style.visibility === 'hidden' || style.opacity === '0' || style.display === 'none') { hidden = true; break; }
              const bounds = parent.getBoundingClientRect();
              if (parent !== element && ['hidden', 'clip'].includes(style.overflowX) && (rect.left < bounds.left - 2 || rect.right > bounds.right + 2)) clippedBy = parent.className;
            }
            if (!hidden && clippedBy) clippedContent.push({ selector: element.tagName + '.' + element.className, clippedBy, text: element.textContent.trim().slice(0, 65) });
          }
          window.scrollTo(0, 400);
          return { documentWidth: document.documentElement.scrollWidth, viewport: width, pageHeight: document.body.scrollHeight,
            canScroll: document.body.scrollHeight <= innerHeight || window.scrollY > 0,
            mainTextLength: document.querySelector('main')?.innerText.length || 0,
            overflows: overflows.slice(0, 14), textClipping: textClipping.slice(0, 8), clippedContent: clippedContent.slice(0, 8) };
        });
        report.push({ route, width, ...result, errors: [...errors] });
        if (result.documentWidth > result.viewport + 2 || result.overflows.length || result.textClipping.length || result.clippedContent.length || errors.length || !result.canScroll || process.env.MRG_AUDIT_CAPTURE === 'all') {
          console.log(JSON.stringify(report.at(-1)));
          await page.screenshot({ path: path.join(output, `${width}-${route.replaceAll('/', '_') || 'home'}.png`), fullPage: true });
        }
      }
      if (process.env.MRG_AUDIT_INTERACTIONS) {
        const visit = route => page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        const measure = async (state, selector) => {
          await page.waitForTimeout(350);
          const result = await page.locator(selector).evaluate(element => {
            const rect = element.getBoundingClientRect();
            const viewport = document.documentElement.clientWidth;
            const overflowingControls = [...element.querySelectorAll('input:not([type=hidden]), select, button, textarea')].filter(control => {
              const bounds = control.getBoundingClientRect();
              return bounds.width && (bounds.left < rect.left - 2 || bounds.right > rect.right + 2);
            }).map(control => ({ tag: control.tagName, name: control.name || control.className }));
            return { left: rect.left, right: rect.right, viewport, overflowingControls, fits: rect.left >= -2 && rect.right <= viewport + 2 && overflowingControls.length === 0 };
          });
          report.push({ state, width, ...result });
          console.log(JSON.stringify(report.at(-1)));
          await page.screenshot({ path: path.join(output, `${width}-state-${state}.png`) });
        };
        await visit('/silver');
        if (width < 992) {
          await page.locator('.custom-toggler').click();
          await measure('mobile-menu', '#basic-navbar-nav');
          await page.getByRole('button', { name: 'Close menu' }).click();
          await page.locator('.silver-filter-btn').click();
          await measure('filters', '.new-filter-drawer.show');
          await page.locator('.drawer-close-btn-custom').click();
          await page.waitForTimeout(400);
          const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflowY !== 'hidden');
          report.push({ state: 'filters-close-scroll', width, fits: unlocked });
        }
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await page.locator('.search-modal-input').fill('Silver');
        await measure('search', '.search-modal-content');
        await page.locator('.search-close-btn').click();
        await visit('/account');
        await page.getByRole('button', { name: 'Edit', exact: true }).first().click();
        await measure('edit-profile', '.account-content');
        await page.locator('.account-tab').filter({ hasText: 'Saved Addresses' }).click();
        await page.getByRole('button', { name: '+ Add New', exact: true }).click();
        await measure('add-address', '.account-content');
        await visit('/checkout');
        await page.locator('label').filter({ has: page.locator('input[name=billingSameAsShipping]') }).click();
        await measure('billing-address', '.checkout-form-section');
      }
      await page.close();
      console.log(`Completed ${width}px`);
    };
    const queue = [...widths];
    await Promise.all(Array.from({ length: process.env.MRG_AUDIT_INTERACTIONS ? 1 : 2 }, async () => {
      while (queue.length) await checkWidth(queue.shift());
    }));
    const failures = report.filter(item => item.fits === false || item.errors?.length || item.overflows?.length || item.textClipping?.length || item.clippedContent?.length || item.canScroll === false || item.documentWidth > item.viewport + 2);
    console.log(`${report.length} checks, ${failures.length} failures`);
    if (failures.length) process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(output, process.env.MRG_AUDIT_INTERACTIONS ? 'interactions.json' : process.env.MRG_AUDIT_SPA ? 'navigation.json' : 'report.json'), JSON.stringify(report, null, 2));
    await browser.close();
    console.log(`Report: ${output}`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
