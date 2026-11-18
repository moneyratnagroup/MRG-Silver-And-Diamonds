import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Clock, Package, ArrowUpRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAdminAccess } from '../../context/AdminAccessContext';
import './AdminDashboard.css';

const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
const day = value => new Date(value).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });
const dateKey = value => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
const paidSale = order => order.paymentStatus === 'Paid' && order.fulfillmentStatus !== 'Cancelled' && !['Refunded', 'Partially Refunded'].includes(order.refundStatus);

const AdminDashboard = () => {
  const { orders = [], adminProducts = [], activeMetals = [] } = useShop();
  const { canAccess } = useAdminAccess();
  const [period, setPeriod] = useState('30');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const today = dateKey(new Date());
  const firstDay = new Date(`${today}T12:00:00+05:30`);
  firstDay.setUTCDate(firstDay.getUTCDate() - (Number(period) - 1));
  const from = period === 'custom' ? start : dateKey(firstDay);
  const until = period === 'custom' ? end : today;
  const invalidRange = period === 'custom' && (!start || !end || start > end);
  const selected = invalidRange ? [] : orders.filter(order => {
    const key = dateKey(order.date);
    return key >= from && key <= until;
  });
  const recent = [...selected].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const awaiting = orders.filter(order => ['New', 'Processing'].includes(order.fulfillmentStatus));
  const pending = orders.filter(order => ['Pending', 'COD'].includes(order.paymentStatus) && order.fulfillmentStatus !== 'Cancelled');
  const stock = adminProducts.filter(product => product.stockQuantity != null && product.stockQuantity <= product.lowStockThreshold).sort((a, b) => a.stockQuantity - b.stockQuantity);
  const low = stock.filter(product => product.stockQuantity > 0);
  const out = stock.filter(product => product.stockQuantity <= 0);
  const stale = activeMetals.filter(metal => !metal.created_at || dateKey(metal.created_at) !== today);
  const cards = [
    ...(canAccess('orders') ? [
      { label: 'Sales · Demo', value: money(selected.filter(paidSale).reduce((sum, order) => sum + Number(order.total || 0), 0)), note: 'Paid, non-cancelled, unrefunded orders', icon: IndianRupee, to: '/admin/orders' },
      { label: 'Orders · Demo', value: selected.length, note: 'Placed in the selected period', icon: ShoppingBag, to: '/admin/orders' },
      { label: 'Awaiting action · Demo', value: awaiting.length, note: 'New and processing orders · All dates', icon: Clock, to: '/admin/orders' },
    ] : []),
    ...(canAccess('inventory') ? [{ label: 'Low-stock products', value: low.length, note: `${out.length} out of stock · Current inventory`, icon: Package, to: '/admin/inventory?tab=management' }] : []),
  ];
  const alerts = [
    ...(canAccess('orders') ? [
      { count: awaiting.length, text: 'orders awaiting dispatch', to: '/admin/orders' },
      { count: pending.length, text: 'payments pending or cash on delivery', to: '/admin/orders' },
    ] : []),
    ...(canAccess('inventory') ? [{ count: out.length, text: 'products out of stock', to: '/admin/inventory?tab=management' }] : []),
    ...(canAccess('rates') ? [{ count: stale.length, text: 'metal rates not updated today', to: '/admin/rates' }] : []),
  ].filter(alert => alert.count > 0);
  return (
    <div className="mrg-dashboard">
      <header className="mrg-dash-header">
        <div><h1>Dashboard</h1><p>Your store at a glance · {day(new Date())}</p></div>
        {canAccess('orders') && <div className="mrg-dash-filters">
          <label>Order period<select value={period} onChange={event => setPeriod(event.target.value)}><option value="1">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="custom">Custom range</option></select></label>
          {period === 'custom' && <><label>From<input type="date" value={start} max={end || today} onChange={event => setStart(event.target.value)} /></label><label>To<input type="date" value={end} min={start} max={today} onChange={event => setEnd(event.target.value)} /></label></>}
        </div>}
      </header>
      {canAccess('orders') && <p className="mrg-dash-notice">Demo order data: sales and orders use the same sample records as the Orders page. Live order reporting is not connected yet.</p>}
      {invalidRange && <p role="alert" className="mrg-dash-notice">Choose a valid start and end date to view orders.</p>}
      <div className="mrg-dash-stats">{cards.map(({ label, value, note, icon: Icon, to }) => <Link className="mrg-dash-stat" to={to} key={label}><span className="mrg-dash-stat-label"><Icon size={19} />{label}<ArrowUpRight size={16} /></span><strong>{invalidRange && label.startsWith('Sales') ? '—' : value}</strong><small>{note}</small></Link>)}</div>
      <section className="mrg-dash-panel"><div className="mrg-dash-panel-heading"><h2>Needs attention</h2><span>All dates · Current status</span></div>{alerts.length ? <div className="mrg-dash-alerts">{alerts.map(alert => <Link to={alert.to} key={alert.text}><strong>{alert.count}</strong><span>{alert.text}</span><ArrowUpRight size={17} /></Link>)}</div> : <p className="mrg-dash-empty">No alerts in the sections you can access.</p>}</section>
      {canAccess('orders') && <section className="mrg-dash-panel"><div className="mrg-dash-panel-heading"><div><h2>Recent orders <small>Demo</small></h2><p>Orders placed in the selected period</p></div><Link to="/admin/orders">View all orders →</Link></div><div className="mrg-dash-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th><th><span className="mrg-dash-sr">Action</span></th></tr></thead><tbody>{recent.map(order => <tr key={order.id}><td>{order.id}</td><td>{order.customer?.name || 'Customer'}</td><td>{day(order.date)}</td><td>{money(order.total)}</td><td><span className="mrg-dash-badge">{order.paymentStatus}</span></td><td>{order.fulfillmentStatus}</td><td><Link aria-label={`View order ${order.id}`} to={`/admin/orders/${order.id}`}>View</Link></td></tr>)}</tbody></table>{!recent.length && <p className="mrg-dash-empty">{invalidRange ? 'Select a valid date range.' : 'No orders in this period.'}</p>}</div><p className="mrg-dash-footnote">Sales include paid orders by order date, after discounts; cancelled and refunded orders are excluded. Pending and COD payments are excluded.</p></section>}
      <div className="mrg-dash-columns">
        {canAccess('inventory') && <section className="mrg-dash-panel"><div className="mrg-dash-panel-heading"><h2>Stock alerts</h2><Link to="/admin/inventory?tab=management">Manage stock →</Link></div>{stock.slice(0, 5).map(product => <div className="mrg-dash-list-row" key={product.id}><div><strong>{product.name}</strong><small>{product.sku || 'No SKU'}</small></div><span className={`mrg-dash-badge ${product.stockQuantity <= 0 ? 'mrg-dash-danger' : ''}`}>{product.stockQuantity <= 0 ? 'Out of stock' : `${product.stockQuantity} left`}</span></div>)}{!stock.length && <p className="mrg-dash-empty">No stock alerts available.</p>}</section>}
        {canAccess('rates') && <section className="mrg-dash-panel"><div className="mrg-dash-panel-heading"><h2>Current metal rates</h2><Link to="/admin/rates">Manage rates →</Link></div>{activeMetals.map(metal => <div className="mrg-dash-list-row" key={metal.id || metal.metal_name}><div><strong>{[metal.purity, metal.metal_type].filter(Boolean).join(' ') || metal.metal_name}</strong><small>{metal.created_at ? `Updated ${day(metal.created_at)}` : 'Update date unavailable'}</small></div><strong>{money(metal.rate)}<small> / {metal.unit || 'g'}</small></strong></div>)}{!activeMetals.length && <p className="mrg-dash-empty">No active metal rates available.</p>}</section>}
      </div>
    </div>
  );
};

export default AdminDashboard;
