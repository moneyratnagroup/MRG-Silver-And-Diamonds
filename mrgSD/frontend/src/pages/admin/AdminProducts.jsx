import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminProducts.css';

const AdminProducts = () => {
  const { adminProducts, deleteProduct, updateProduct } = useShop();
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleStatusChange = async (product, newStatus) => {
    if (product.status === newStatus) return;
    const result = await updateProduct({ id: product.id, status: newStatus });
    if (!result.success) {
      alert(result.error || "Failed to update status");
    }
  };

  return (
    <div className="admin-products-container">
      <div className="admin-page-header">
        <div className="header-actions">
          <div>
            <h1>Product Management</h1>
            <p>View, add, edit, or delete inventory.</p>
          </div>
          <button className="btn-add-product" onClick={handleAddProduct}>
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>

      <div className="admin-products-table-container">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Hover Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Collection</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="table-img-wrapper">
                    <div className="table-img-container">
                      <img loading="lazy" src={product.img} alt={product.name} />
                    </div>
                    <div className="img-hover-preview">
                      <img loading="lazy" src={product.img} alt={product.name} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="table-img-wrapper">
                    <div className="table-img-container">
                      {product.hoverImage ? (
                        <img loading="lazy" src={product.hoverImage} alt="Hover" />
                      ) : (
                        <span style={{color: '#aaa', fontSize: '0.85rem'}}>None</span>
                      )}
                    </div>
                    {product.hoverImage && (
                      <div className="img-hover-preview">
                        <img loading="lazy" src={product.hoverImage} alt="Hover" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="font-medium">{product.name}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600' }}>{product.price}</span>
                    {product.originalPrice && (
                      <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.85rem' }}>
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </td>
                <td><span className="badge-pill">{product.category}</span></td>
                <td>
                  {product.collections && product.collections.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {product.collections.map(c => (
                        <span key={c.id} className="badge-pill collection">{c.name}</span>
                      ))}
                    </div>
                  ) : (
                    <span style={{color: '#aaa', fontSize: '0.85rem'}}>None</span>
                  )}
                </td>
                <td>
                  <select 
                    value={product.status || 'DRAFT'} 
                    onChange={(e) => handleStatusChange(product, e.target.value)}
                    className={`status-select status-${product.status?.toLowerCase() || 'draft'}`}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon edit" onClick={() => handleEditProduct(product)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeleteProduct(product.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {adminProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center empty-table">
                  No products found. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
