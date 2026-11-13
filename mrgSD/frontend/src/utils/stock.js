export const getStockStatus = (product) => {
  const value = product?.stockQuantity;
  if (value === undefined || value === null || value === '') return null;
  const quantity = Number(value);
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  if (quantity === 0) return { type: 'out', text: 'Out of Stock' };
  const threshold = Number(product.lowStockThreshold ?? 5);
  if (quantity <= threshold) return { type: 'low', text: `Low Stock - Only ${quantity} left` };
  return null;
};

export const isOutOfStock = (product) => getStockStatus(product)?.type === 'out';
