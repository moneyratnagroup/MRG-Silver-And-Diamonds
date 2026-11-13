import { getStockStatus } from '../utils/stock';
import './StockBadge.css';

export default function StockBadge({ product }) {
  const status = getStockStatus(product);
  if (!status) return null;
  return <span className={`product-stock-status product-stock-status--${status.type}`}>{status.text}</span>;
}
