import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2 } from 'lucide-react';
import './Pages.css';

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist, addToCart } = useShop();

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
              <div className="wishlist-card-img">
                <img src={item.img} alt={item.name} />
                <button className="btn-remove-absolute" onClick={() => toggleWishlist(item)}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="wishlist-card-details">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <button 
                  className="btn-primary w-100 mt-2" 
                  onClick={() => {
                    addToCart(item);
                    toggleWishlist(item);
                  }}
                >
                  Move to Cart
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
