import React, { createContext, useState, useContext } from 'react';
import { allProducts } from '../data/mockProducts';

// Create Context
const ShopContext = createContext();

// Custom hook to use the context
export const useShop = () => {
  return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState(allProducts);
  
  // Drawer UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Metal Rates (Global State for Admin & Frontend)
  const [metalRates, setMetalRates] = useState({
    gold22k: "₹7,250",
    gold24k: "₹7,910",
    silver: "₹92",
    silver999: "₹94",
    lastUpdated: "Today, 10:00 AM"
  });

  const updateMetalRates = (newRates) => {
    setMetalRates({
      ...metalRates,
      ...newRates,
      lastUpdated: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    });
  };

  // Homepage Content (Admin)
  const [announcementText, setAnnouncementText] = useState("USE CODE \"WELCOME10\" FOR 10% OFF YOUR FIRST ORDER | FREE SHIPPING ON ORDERS OVER ₹5000");
  
  const [heroBanners, setHeroBanners] = useState([
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2940&auto=format&fit=crop",
      badge: "New Collection",
      title: "Elegance<br/>Redefined",
      subtitle: "Discover our exclusive silver collection, delicately crafted for the modern muse.",
      buttonText: "Shop Silver"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=2940&auto=format&fit=crop",
      badge: "Certified Pure",
      title: "Timeless<br/>Brilliance",
      subtitle: "Make every moment unforgettable with our ethically sourced, breathtaking diamonds.",
      buttonText: "Explore Diamonds"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940&auto=format&fit=crop",
      badge: "Made For You",
      title: "Bespoke<br/>Masterpieces",
      subtitle: "Celebrate your unique story with custom-designed premium jewelry services.",
      buttonText: "Custom Orders"
    }
  ]);

  const updateAnnouncementText = (newText) => {
    setAnnouncementText(newText);
  };

  const updateHeroBanners = (newBanners) => {
    setHeroBanners(newBanners);
  };

  // Testimonials (Admin)
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      customerName: "Sarah M.",
      message: "The silver necklace I purchased is absolutely stunning. The craftsmanship is flawless and I receive compliments every time I wear it.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5,
      place: "Mumbai, Maharashtra"
    },
    {
      id: 2,
      customerName: "Priya K.",
      message: "MRG has the most beautiful diamond collections. Their customer service helped me pick the perfect ring for my engagement.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5,
      place: "Delhi"
    }
  ]);

  const addTestimonial = (newTestimonial) => {
    const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
    setTestimonials([...testimonials, { ...newTestimonial, id: newId }]);
  };

  const updateTestimonial = (updatedTestimonial) => {
    setTestimonials(testimonials.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t));
  };

  const deleteTestimonial = (id) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  // Categories & Collections
  const [categories, setCategories] = useState([
    { id: 1, name: 'Rings' },
    { id: 2, name: 'Earrings' },
    { id: 3, name: 'Chains' },
    { id: 4, name: 'Bracelets' },
    { id: 5, name: 'Pendants' },
    { id: 6, name: 'Anklets' },
    { id: 7, name: 'Idols' },
    { id: 8, name: 'Bullions' },
    { id: 9, name: 'Bridal' }
  ]);

  const [collections, setCollections] = useState([
    { id: 1, name: 'women', displayName: "Women's Collection" },
    { id: 2, name: 'men', displayName: "Men's Collection" },
    { id: 3, name: 'kids', displayName: "Kids Collection" },
    { id: 4, name: 'religious', displayName: "Religious" },
    { id: 5, name: 'investment', displayName: "Investment" },
    { id: 6, name: 'special', displayName: "Special/Bridal" }
  ]);

  const addCategory = (name) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { id: newId, name }]);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addCollection = (name, displayName) => {
    const newId = collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1;
    setCollections([...collections, { id: newId, name, displayName }]);
  };

  const deleteCollection = (id) => {
    setCollections(collections.filter(c => c.id !== id));
  };

  // Coupons (Admin & Frontend)
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'WELCOME10',
      type: 'percent', // 'percent' or 'fixed'
      value: 10,
      minCartValue: 2000,
      expiryDate: '2026-12-31',
      isActive: true
    },
    {
      id: 2,
      code: 'FLAT500',
      type: 'fixed',
      value: 500,
      minCartValue: 5000,
      expiryDate: '2026-12-31',
      isActive: true
    }
  ]);

  const addCoupon = (newCoupon) => {
    const newId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1;
    setCoupons([...coupons, { ...newCoupon, id: newId }]);
  };

  const updateCoupon = (updatedCoupon) => {
    setCoupons(coupons.map(c => c.id === updatedCoupon.id ? updatedCoupon : c));
  };

  const deleteCoupon = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const toggleCouponStatus = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  // Orders (Admin)
  const [orders, setOrders] = useState([
    {
      id: "ORD-9021",
      date: "2026-07-20T14:30:00",
      customer: {
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        phone: "+91 98765 43210",
        address: "123, Silver Enclave, Andheri West, Mumbai, Maharashtra 400053"
      },
      items: [
        {
          id: 1,
          name: "Classic Silver Charm Bracelet",
          price: "₹2,499",
          quantity: 2,
          img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
          sku: "MRG-BRC-001",
          metal: "Silver",
          purity: "925",
          weight: "15g",
          size: "6.5 inches"
        }
      ],
      subtotal: 4998,
      discount: 0,
      total: 4998,
      paymentStatus: "Paid", // Paid, Pending, COD
      paymentMethod: "Razorpay", // UPI, Card, COD, Razorpay
      fulfillmentStatus: "Processing", // New, Processing, Shipped, Delivered, Cancelled
      tracking: { courier: '', trackingId: '' },
      refundStatus: 'None'
    },
    {
      id: "ORD-9022",
      date: "2026-07-21T09:15:00",
      customer: {
        name: "Anjali Gupta",
        email: "anjali.g@example.com",
        phone: "+91 91234 56789",
        address: "45, Diamond Plaza, Connaught Place, New Delhi 110001"
      },
      items: [
        {
          id: 3,
          name: "Men's Heavy Silver Chain",
          price: "₹4,599",
          quantity: 1,
          img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
          sku: "MRG-CHN-003",
          metal: "Silver",
          purity: "925",
          weight: "45g",
          size: "22 inches"
        }
      ],
      subtotal: 4599,
      discount: 459, // applied 10% coupon
      total: 4140,
      paymentStatus: "COD",
      paymentMethod: "COD",
      fulfillmentStatus: "New",
      tracking: { courier: '', trackingId: '' },
      refundStatus: 'None'
    },
    {
      id: "ORD-9020",
      date: "2026-07-19T11:45:00",
      customer: {
        name: "Vikram Singh",
        email: "vikram.s@example.com",
        phone: "+91 99887 76655",
        address: "88, Pearl Residency, Jayanagar, Bangalore, Karnataka 560041"
      },
      items: [
        {
          id: 7,
          name: "Bridal Silver Diamond Set",
          price: "₹12,999",
          quantity: 1,
          img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
          sku: "MRG-SET-007",
          metal: "Silver/Diamond",
          purity: "925",
          weight: "85g",
          size: "Adjustable"
        }
      ],
      subtotal: 12999,
      discount: 500, // flat 500
      total: 12499,
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      fulfillmentStatus: "Delivered",
      tracking: { courier: 'BlueDart', trackingId: 'BD987654321' },
      refundStatus: 'None'
    }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o));
  };

  const updateOrderTracking = (orderId, trackingData) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, tracking: trackingData } : o));
  };

  const processRefund = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, fulfillmentStatus: 'Cancelled', refundStatus: 'Refunded' } : o));
  };

  // Product Management (Admin)
  const addProduct = (newProduct) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...newProduct, id: newId }]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto-open cart on add
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update cart quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  // Toggle wishlist
  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === product.id);
      if (exists) {
        return prevItems.filter((item) => item.id !== product.id);
      }
      return [...prevItems, product];
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    isInWishlist,
    getCartCount,
    getWishlistCount,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    metalRates,
    updateMetalRates,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    announcementText,
    updateAnnouncementText,
    heroBanners,
    updateHeroBanners,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    categories,
    addCategory,
    deleteCategory,
    collections,
    addCollection,
    deleteCollection,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    orders,
    updateOrderStatus,
    updateOrderTracking,
    processRefund
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
