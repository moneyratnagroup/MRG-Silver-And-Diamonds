import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist } = useShop();
  const navigate = useNavigate();

  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  const handleEnquire = (item) => {
    const phoneNumber = '+919876543210';
    const message = `Hi, I would like to know more about ${item.name} (Price: ${item.price}) that I saw on your website.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Your Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-page-state">
          <p>Your wishlist is currently empty.</p>
          <a href="/" className="btn-primary">Explore Collections</a>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-card-img" onClick={() => handleProductClick(item)} style={{ cursor: 'pointer' }}>
                <img src={item.img} alt={item.name} />
                <button className="btn-remove-absolute" onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="wishlist-card-details">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <button 
                  className="btn-primary w-100 mt-2" 
                  onClick={() => handleEnquire(item)}
                  style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }}
                >
                  Enquire on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
