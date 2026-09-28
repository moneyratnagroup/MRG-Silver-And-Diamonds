import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './AdminProducts.css';

const AdminProducts = () => {
  const { adminProducts, deleteProduct, updateProduct, coupons } = useShop();
 
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMetal, setFilterMetal] = useState('All');
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMetal]);

  const uniqueMetals = ['All', ...new Set(adminProducts.map(p => p.metal).filter(Boolean))];

  const filteredProducts = adminProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMetal = filterMetal === 'All' || product.metal === filterMetal;
    return matchesSearch && matchesMetal;
  });
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ccc', flexGrow: 1, maxWidth: '400px', fontSize: '0.9rem' }}
        />
        <select 
          value={filterMetal} 
          onChange={(e) => setFilterMetal(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '180px', fontSize: '0.9rem' }}
        >
          {uniqueMetals.map(metal => (
            <option key={metal} value={metal}>{metal === 'All' ? 'All Metals' : metal}</option>
          ))}
        </select>
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
            {currentProducts.map((product) => (
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: '600' }}>{product.price}</span>
                    {product.isOfferAvailable && product.offerCouponCode && (
                      <span style={{ 
                        backgroundColor: 'rgba(168, 76, 25, 0.1)', 
                        color: '#a84c19', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '0.7rem', 
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        width: 'fit-content'
                      }}>
                        {(() => {
                          const matchedCoupon = coupons?.find(c => c.code === product.offerCouponCode);
                          if (matchedCoupon && matchedCoupon.type === 'percent') {
                            return `${matchedCoupon.value}% OFF`;
                          }
                          return product.offerCouponCode;
                        })()}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.85rem' }}>
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="badge-pill">{product.category}</span>
                  {product.metal && (
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                      {product.metal}
                    </div>
                  )}
                </td>
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
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center empty-table" style={{ padding: '2rem' }}>
                  {adminProducts.length === 0 ? "No products found. Add your first product!" : "No products found matching your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingBottom: '2rem' }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ padding: '0.5rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={18} color={currentPage === 1 ? '#ccc' : '#333'} />
          </button>
          <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '0.5rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight size={18} color={currentPage === totalPages ? '#ccc' : '#333'} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
