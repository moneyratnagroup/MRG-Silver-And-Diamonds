import React from 'react';
import { useShop } from '../context/ShopContext';
import { Plus, Minus, Trash2 } from 'lucide-react';
import './Pages.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useShop();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + (priceVal * item.quantity);
    }, 0);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-page-state">
          <p>Your cart is currently empty.</p>
          <a href="/" className="btn-primary">Continue Shopping</a>
        </div>
      ) : (
        <div className="cart-page-layout">
          <div className="cart-items-table">
            <div className="cart-table-header">
              <div className="th-product">Product</div>
              <div className="th-quantity">Quantity</div>
              <div className="th-total">Total</div>
            </div>
            
            {cartItems.map(item => (
              <div key={item.id} className="cart-table-row">
                <div className="td-product">
                  <img src={item.img} alt={item.name} className="cart-table-img" />
                  <div>
                    <h3 className="cart-table-name">{item.name}</h3>
                    <p className="cart-table-price">{item.price}</p>
                    <button className="btn-text-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
                <div className="td-quantity">
                  <div className="quantity-selector">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}><Plus size={14}/></button>
                  </div>
                </div>
                <div className="td-total">
                  ₹{(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
            </div>
            <p className="shipping-note">Taxes and shipping calculated at checkout</p>
            <button className="btn-primary w-100">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
