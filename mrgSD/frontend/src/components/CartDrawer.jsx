import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import './Drawers.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateCartQuantity } = useShop();

  const handleClose = () => setIsCartOpen(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Very basic price parsing for prototype: strip currency and commas
      const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + (priceVal * item.quantity);
    }, 0);
  };

  return (
    <Offcanvas show={isCartOpen} onHide={handleClose} placement="end" className="custom-drawer">
      <Offcanvas.Header>
        <Offcanvas.Title className="drawer-title">
          <ShoppingBag size={20} className="me-2" />
          YOUR CART
        </Offcanvas.Title>
        <button className="drawer-close-btn" onClick={handleClose}>
          <X size={24} />
        </button>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="drawer-body">
        {cartItems.length === 0 ? (
          <div className="empty-drawer">
            <ShoppingBag size={48} className="empty-icon" />
            <p>Your cart is currently empty.</p>
            <button className="btn-continue" onClick={handleClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">{item.price}</p>
                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="drawer-footer">
              <div className="subtotal-row">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
              </div>
              <p className="shipping-note">Taxes and shipping calculated at checkout</p>
              <button className="btn-checkout">Checkout</button>
              <Link to="/cart" className="btn-view-cart" onClick={handleClose}>View Full Cart</Link>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;
