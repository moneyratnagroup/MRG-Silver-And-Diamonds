import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [activeMetals, setActiveMetals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [metalRateHistory, setMetalRateHistory] = useState([]);

  const fetchRates = useCallback(async () => {
    try {
      const activeRes = await fetch("http://localhost:8000/api/v1/metal-rates/active");
      if (activeRes.ok) {
        const data = await activeRes.json();
        setActiveMetals(data);
        
        let lastUpdatedTime = "";
        data.forEach(item => {
           if (!lastUpdatedTime || new Date(item.created_at) > new Date(lastUpdatedTime)) {
              lastUpdatedTime = item.created_at;
           }
        });
        setLastUpdated(lastUpdatedTime ? new Date(lastUpdatedTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : "");
      }

      const historyRes = await fetch("http://localhost:8000/api/v1/metal-rates");
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const groupedByDate = {};
        historyData.forEach(item => {
           const date = item.created_at.split('T')[0];
           if (!groupedByDate[date]) {
               groupedByDate[date] = { date, ids: [] };
           }
           const key = item.metal_name;
           if (key) {
               groupedByDate[date][key] = parseFloat(item.rate);
               groupedByDate[date].ids.push(item.id);
           }
        });
        
        const historyArr = Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
        setMetalRateHistory(historyArr);
      }
    } catch (err) {
      console.error("Failed to fetch metal rates", err);
    }
  }, []);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/testimonials");
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map(t => ({
          id: t.id,
          customerName: t.customer_name,
          place: t.location,
          image: t.image_key ? `http://localhost:8000${t.image_key}` : null,
          imageKey: t.image_key,
          rating: t.rating,
          message: t.message,
          isActive: t.is_active,
          displayOrder: t.display_order,
          adminNotes: t.admin_notes
        }));
        setTestimonials(mappedData);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    fetchTestimonials();
  }, [fetchRates, fetchTestimonials]);

  const updateMetalRates = async (newRates) => {
    const cleanRates = {};

    for (const [key, val] of Object.entries(newRates)) {
      // Safe string conversion before replace
      const strVal = String(val);
      const num = parseFloat(strVal.replace(/[₹,]/g, ''));
      if (!isNaN(num)) {
          cleanRates[key] = num;
      }
    }

    try {
        const res = await fetch("http://localhost:8000/api/v1/metal-rates/batch", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rates: cleanRates })
        });
        if (res.ok) {
            await fetchRates();
        }
    } catch (err) {
        console.error("Failed to update metal rates", err);
    }
  };

  const deleteMetalRatesHistory = async (ids) => {
    try {
        const res = await fetch("http://localhost:8000/api/v1/metal-rates/batch-delete", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        });
        if (res.ok) {
            await fetchRates();
        }
    } catch (err) {
        console.error("Failed to delete metal rates", err);
    }
  };

  const addNewMetalType = async (newMetal) => {
    try {
        const res = await fetch("http://localhost:8000/api/v1/metal-rates", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMetal)
        });
        if (res.ok) {
            await fetchRates();
        }
    } catch (err) {
        console.error("Failed to add new metal type", err);
    }
  };

  // Homepage Content (Admin)
  const [announcementText, setAnnouncementText] = useState('<span>FREE SHIPPING OVER ₹5000</span> &nbsp;&nbsp;|&nbsp;&nbsp; <span style="color: #C7A66A">USE CODE WELCOME10</span>');
  
  const [heroBanners, setHeroBanners] = useState([
    {
      id: 1,
      image: "/Banner11.jpg",
      preTitle: "925 STERLING SILVER",
      title: "Pure Silver.<br/>Timeless Beauty.",
      subtitle: "Discover handcrafted sterling silver jewellery designed with elegance, purity, and modern luxury.",
      buttonText: "SHOP COLLECTION",
      status: "publish"
    },
    {
      id: 2,
      image: "/banner12.png",
      preTitle: "NATURAL DIAMOND COLLECTION",
      title: "Where Every<br/>Diamond Tells<br/>A Story",
      subtitle: "Handcrafted diamond jewellery designed to celebrate life's most precious moments.",
      buttonText: "EXPLORE DIAMONDS",
      status: "publish"
    },
    {
      id: 3,
      image: "/banner3.png",
      title: "Silver & Diamonds.<br/>Perfect Harmony.",
      subtitle: "Find the perfect balance of classic silver elegance and the brilliant shine of hand-set diamonds.",
      buttonText: "SHOP NOW",
      status: "publish"
    }
  ]);

  const updateAnnouncementText = (newText) => {
    setAnnouncementText(newText);
  };

  const updateHeroBanners = (newBanners) => {
    setHeroBanners(newBanners);
  };

  // Testimonials (Admin)
  const [testimonials, setTestimonials] = useState([]);

  const addTestimonial = async (newTestimonial) => {
    try {
      const payload = {
        customer_name: newTestimonial.customerName,
        location: newTestimonial.place,
        image_key: newTestimonial.imageKey || null, // Updated from AdminTestimonialForm
        rating: newTestimonial.rating,
        message: newTestimonial.message,
        is_active: newTestimonial.isActive,
        display_order: newTestimonial.displayOrder,
        admin_notes: newTestimonial.adminNotes
      };
      
      const res = await fetch("http://localhost:8000/api/v1/testimonials", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to add testimonial", error);
    }
  };

  const updateTestimonial = async (updatedTestimonial) => {
    try {
      const payload = {
        customer_name: updatedTestimonial.customerName,
        location: updatedTestimonial.place,
        image_key: updatedTestimonial.imageKey || null, // Will keep old if not updated
        rating: updatedTestimonial.rating,
        message: updatedTestimonial.message,
        is_active: updatedTestimonial.isActive,
        display_order: updatedTestimonial.displayOrder,
        admin_notes: updatedTestimonial.adminNotes
      };
      
      const res = await fetch(`http://localhost:8000/api/v1/testimonials/${updatedTestimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to update testimonial", error);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/testimonials/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
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
    { id: 1, name: 'women', displayName: "Women's Collection", categoryIds: [1, 2, 3] },
    { id: 2, name: 'men', displayName: "Men's Collection", categoryIds: [1, 3, 4] },
    { id: 3, name: 'kids', displayName: "Kids Collection", categoryIds: [2, 4, 6] },
    { id: 4, name: 'religious', displayName: "Religious", categoryIds: [5, 7] },
    { id: 5, name: 'investment', displayName: "Investment", categoryIds: [8] },
    { id: 6, name: 'special', displayName: "Special/Bridal", categoryIds: [9, 1, 2] }
  ]);

  const addCategory = (name) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { id: newId, name }]);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addCollection = (name, displayName, categoryIds = []) => {
    const newId = collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1;
    setCollections([...collections, { id: newId, name, displayName, categoryIds }]);
  };

  const deleteCollection = (id) => {
    setCollections(collections.filter(c => c.id !== id));
  };

  const updateCollection = (id, name, displayName, categoryIds = []) => {
    setCollections(collections.map(c => 
      c.id === id ? { ...c, name, displayName, categoryIds } : c
    ));
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
      tracking: { courier: '', trackingId: '', url: '', shippingDate: '', expectedDelivery: '', deliveredDate: '' },
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
      tracking: { courier: '', trackingId: '', url: '', shippingDate: '', expectedDelivery: '', deliveredDate: '' },
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
      tracking: { 
        courier: 'BlueDart', 
        trackingId: 'BD987654321', 
        url: 'https://bluedart.com/tracking', 
        shippingDate: '2026-07-20', 
        expectedDelivery: '2026-07-24', 
        deliveredDate: '2026-07-23' 
      },
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

  // Inventory Movements
  const [inventoryMovements, setInventoryMovements] = useState([
    {
      id: 1,
      date: new Date().toISOString(),
      productId: 1,
      productName: "Classic Silver Charm Bracelet",
      type: "add",
      quantity: 12,
      reason: "Initial Stock",
      reference: "PO-001",
      notes: "Initial inventory setup"
    }
  ]);

  const updateInventory = (productId, adjustment) => {
    // adjustment is an object: { type: 'add'|'remove', quantity: number, reason: string, reference: string, notes: string }
    const qty = parseInt(adjustment.quantity, 10);
    if (isNaN(qty) || qty <= 0) return;

    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === productId) {
        let newStock = p.stockQuantity;
        if (adjustment.type === 'add') newStock += qty;
        else if (adjustment.type === 'remove') newStock = Math.max(0, newStock - qty);
        
        // Log movement
        const newMovement = {
          id: Date.now(),
          date: new Date().toISOString(),
          productId: p.id,
          productName: p.name,
          type: adjustment.type,
          quantity: qty,
          reason: adjustment.reason,
          reference: adjustment.reference,
          notes: adjustment.notes
        };
        setInventoryMovements(prev => [newMovement, ...prev]);

        return { ...p, stockQuantity: newStock };
      }
      return p;
    }));
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
    activeMetals,
    lastUpdated,
    addNewMetalType,
    updateMetalRates,
    metalRateHistory,
    deleteMetalRatesHistory,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    inventoryMovements,
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
    updateCollection,
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
