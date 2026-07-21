import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminProducts.css';

const AdminProducts = () => {
  const { products, deleteProduct } = useShop();
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
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Collection</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="table-img-container">
                    <img src={product.img} alt={product.name} />
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
                <td><span className="badge-pill collection">{product.collection}</span></td>
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
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center empty-table">
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
