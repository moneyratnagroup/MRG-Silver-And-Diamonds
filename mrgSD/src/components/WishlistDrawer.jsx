import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { X, Heart, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import './Drawers.css';

const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlistItems, toggleWishlist, addToCart } = useShop();

  const handleClose = () => setIsWishlistOpen(false);

  // Requirement: Max 5-8 products preview in the drawer
  const previewItems = wishlistItems.slice(0, 5);
  const hiddenCount = wishlistItems.length - 5;

  return (
    <Offcanvas show={isWishlistOpen} onHide={handleClose} placement="end" className="custom-drawer">
      <Offcanvas.Header>
        <Offcanvas.Title className="drawer-title">
          <Heart size={20} className="me-2" />
          YOUR WISHLIST
        </Offcanvas.Title>
        <button className="drawer-close-btn" onClick={handleClose}>
          <X size={24} />
        </button>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="drawer-body">
        {wishlistItems.length === 0 ? (
          <div className="empty-drawer">
            <Heart size={48} className="empty-icon" />
            <p>Your wishlist is currently empty.</p>
            <button className="btn-continue" onClick={handleClose}>Explore Collections</button>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              {previewItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">{item.price}</p>
                    <div className="wishlist-item-actions">
                      <button 
                        className="btn-move-to-cart" 
                        onClick={() => {
                          addToCart(item);
                          toggleWishlist(item); // Remove from wishlist after moving to cart
                        }}
                      >
                        Move to Cart
                      </button>
                      <button className="btn-remove-icon" onClick={() => toggleWishlist(item)} aria-label="Remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {hiddenCount > 0 && (
                <div className="hidden-items-notice">
                  +{hiddenCount} more items in your wishlist
                </div>
              )}
            </div>
            
            <div className="drawer-footer">
              <Link to="/wishlist" className="btn-checkout" onClick={handleClose}>
                View All Wishlist
              </Link>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default WishlistDrawer;
