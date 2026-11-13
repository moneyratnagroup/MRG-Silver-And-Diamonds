import { toast } from 'react-toastify';
import { isOutOfStock } from '../utils/stock';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchWithAuth, API_URL } from '../utils/api';
import imgBanner11 from '../assets/Banner1.png';
import imgbanner12 from '../assets/banner12.webp';
import imgbanner3 from '../assets/banner3.webp';

// Create Context
const ShopContext = createContext();

// Check if online e-commerce features (Cart, Wishlist, Checkout) are enabled
export const isEcommerceEnabled = import.meta.env.VITE_ENABLE_ECOMMERCE !== 'false';

// Custom hook to use the context
export const useShop = () => {
  return useContext(ShopContext);
};

// Product Title Capitalization Formatter
export const formatProductTitle = (name) => {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Specific corrections requested
  if (lower === 'earings' || lower === 'earrings') return "Earrings";
  if (lower === 'men ring' || lower === "men's ring") return "Men's Ring";
  if (lower === 'kids bracelets' || lower === "kids' bracelets" || lower === "kid's bracelets") return "Kids' Bracelets";
  if (lower === 'silver bracelets men') return "Silver Bracelets Men";

  // General Title Case
  return trimmed
    .split(' ')
    .filter(Boolean)
    .map(word => {
      const wLower = word.toLowerCase();
      if (wLower === 'men') return "Men's";
      if (wLower === 'kids') return "Kids'";
      if (wLower === 'earings') return "Earrings";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export const ShopProvider = ({ children }) => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metals, setMetals] = useState([]);
  const [collections, setCollections] = useState([]);
  const [occasions, setOccasions] = useState([]);
  
  // Fetch Wishlist from Backend
  const fetchWishlist = useCallback(async () => {
    if (user && user.id) {
      try {
        const res = await fetchWithAuth('/api/v1/wishlists/', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          // The backend returns an array of WishlistItemSchema
          // which has { id, user_id, created_at, product: { ... } }
          setWishlistItems(data.map(item => item.product ? ({
            ...item.product,
            name: formatProductTitle(item.product.name)
          }) : item.product));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    }
  }, [user]);

  // Fetch Cart from Backend
  const fetchCart = useCallback(async () => {
    if (user && user.id) {
      try {
        const res = await fetchWithAuth('/api/v1/carts/', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          const mappedCart = data.map(item => {
            const p = item.product;
            return {
              id: p.id,
              sku: p.sku,
              name: formatProductTitle(p.name),
              originalPrice: p.mrp_price ? `₹${p.mrp_price}` : null,
              price: `₹${p.selling_price}`,
              category: p.category?.name || '',
              collections: p.collections || [],
              occasions: p.occasions || [],
              desc: p.description,
              metal: p.metal?.name || 'Silver',
              purity: p.purity?.name || '925',
              img: p.images && p.images.length > 0 ? p.images[0].image_url : '',
              hoverImage: p.images && p.images.length > 1 ? p.images[1].image_url : null,
              images: p.images ? p.images.map(img => img.image_url) : [],
              stockQuantity: p.stock_quantity,
              lowStockThreshold: p.low_stock_threshold ?? 5,
              status: p.status,
              isOfferAvailable: p.is_offer_available,
              offerCouponCode: p.offer_coupon_code,
              isActive: p.status === 'PUBLISHED',
              quantity: item.quantity
            };
          });
          setCartItems(mappedCart);
        }
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    }
  }, [user]);

  // Sync Cart and Wishlist with Backend/Local Storage
  useEffect(() => {
    if (user && user.id) {
      fetchCart();
      fetchWishlist();
    } else {
      const savedGuestCart = localStorage.getItem('cart_guest');
      if (savedGuestCart) {
        try { setCartItems(JSON.parse(savedGuestCart)); } catch (e) {}
      } else {
        setCartItems([]);
      }
      const savedGuestWishlist = localStorage.getItem('wishlist_guest');
      if (savedGuestWishlist) {
        try { setWishlistItems(JSON.parse(savedGuestWishlist)); } catch (e) {}
      } else {
        setWishlistItems([]);
      }
    }
  }, [user, fetchWishlist, fetchCart]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart_guest', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (user && user.id && wishlistItems.length >= 0) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems));
    } else if (!user && wishlistItems.length >= 0) {
      localStorage.setItem('wishlist_guest', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);
  
  // Drawer UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Metal Rates (Global State for Admin & Frontend)
  const [activeMetals, setActiveMetals] = useState([]);
  const [allCreatedMetals, setAllCreatedMetals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [metalRateHistory, setMetalRateHistory] = useState([]);

  const fetchRates = useCallback(async () => {
    try {
      let activeData = [];
      const activeRes = await fetchWithAuth(`/api/v1/metal-rates/active`);
      if (activeRes.ok) {
        activeData = await activeRes.json();
        setActiveMetals(activeData);
        
        let lastUpdatedTime = "";
        activeData.forEach(item => {
           if (!lastUpdatedTime || new Date(item.created_at) > new Date(lastUpdatedTime)) {
              lastUpdatedTime = item.created_at;
           }
        });
        setLastUpdated(lastUpdatedTime ? new Date(lastUpdatedTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : "");
      }

      const historyRes = await fetchWithAuth(`/api/v1/metal-rates/`);
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

        // Derive unique created metals with their latest status and details
        const latestBySlug = {};
        historyData.forEach(item => {
          const slug = (item.metal_name || '').toLowerCase();
          if (slug) {
            if (!latestBySlug[slug] || new Date(item.created_at) >= new Date(latestBySlug[slug].created_at)) {
              latestBySlug[slug] = item;
            }
          }
        });
        // Override with active list (ensuring is_active is synced)
        activeData.forEach(activeItem => {
          const slug = (activeItem.metal_name || '').toLowerCase();
          if (slug) {
            latestBySlug[slug] = { ...latestBySlug[slug], ...activeItem, is_active: true };
          }
        });
        setAllCreatedMetals(Object.values(latestBySlug));
      }
    } catch (err) {
      console.error("Failed to fetch metal rates", err);
    }
  }, []);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`/api/v1/testimonials/`);
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map(t => ({
          id: t.id,
          customerName: t.customer_name,
          place: t.location,
          image: t.image_key ? (t.image_key.startsWith('http') ? t.image_key : `${API_URL}${t.image_key}`) : null,
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

  const fetchTaxonomies = useCallback(async () => {
    try {
      const catRes = await fetchWithAuth(`/api/v1/products/categories`);
      if (catRes.ok) setCategories(await catRes.json());
      
      const metalRes = await fetchWithAuth(`/api/v1/products/metals`);
      if (metalRes.ok) setMetals(await metalRes.json());

      const colRes = await fetchWithAuth(`/api/v1/products/collections`);
      if (colRes.ok) setCollections(await colRes.json());

      const occRes = await fetchWithAuth(`/api/v1/products/occasions`);
      if (occRes.ok) setOccasions(await occRes.json());
    } catch (err) {
      console.error("Failed to fetch taxonomies", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/v1/products/');
      if (res.ok) {
        const data = await res.json();
        const mappedProducts = data.map(p => ({
          id: p.id,
          sku: p.sku,
          name: formatProductTitle(p.name),
          originalPrice: p.mrp_price ? `₹${p.mrp_price}` : null,
          price: `₹${p.selling_price}`,
          category: p.category?.name || '',
          collections: p.collections || [],
          occasions: p.occasions || [],
          desc: p.description,
          metal: p.metal?.name || 'Silver',
          purity: p.purity?.name || '925',
          img: p.images.length > 0 ? p.images[0].image_url : '',
          hoverImage: p.images.length > 1 ? p.images[1].image_url : null,
          images: p.images.map(img => img.image_url),
          stockQuantity: p.stock_quantity,
          lowStockThreshold: p.low_stock_threshold ?? 5,
          status: p.status,
          isOfferAvailable: p.is_offer_available,
          offerCouponCode: p.offer_coupon_code,
          isActive: p.status === 'PUBLISHED'
        }));
        setAdminProducts(mappedProducts);
        setProducts(mappedProducts.filter(p => p.isActive));
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, []);

  const fetchAdminProducts = useCallback(async () => {
    try {
      const res = await fetchWithAuth(window.location.pathname.startsWith('/admin') ? '/api/v1/products/?status=ALL' : '/api/v1/products/');
      if (res.ok) {
        const data = await res.json();
        const mappedProducts = data.map(p => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          originalPrice: p.mrp_price ? `₹${p.mrp_price}` : null,
          price: `₹${p.selling_price}`,
          category: p.category?.name || '',
          collections: p.collections || [],
          occasions: p.occasions || [],
          desc: p.description,
          metal: p.metal?.name || 'Silver',
          purity: p.purity?.name || '925',
          img: p.images.length > 0 ? p.images[0].image_url : '',
          hoverImage: p.images.length > 1 ? p.images[1].image_url : null,
          images: p.images.map(img => img.image_url),
          stockQuantity: p.stock_quantity,
          lowStockThreshold: p.low_stock_threshold ?? 5,
          status: p.status,
          isOfferAvailable: p.is_offer_available,
          offerCouponCode: p.offer_coupon_code
        }));
        setAdminProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Failed to fetch admin products", err);
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`/api/v1/coupons/`);
      if (res.ok) {
        const data = await res.json();
        const mappedCoupons = data.map(c => ({
          id: c.id,
          code: c.code,
          type: c.type,
          value: c.value,
          minCartValue: c.min_cart_value,
          expiryDate: c.expiry_date,
          isActive: c.is_active
        }));
        setCoupons(mappedCoupons);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    fetchTestimonials();
    fetchTaxonomies();
    fetchProducts();
    fetchAdminProducts();
    fetchCoupons();
    const refreshAdminData = () => {
      fetchAdminProducts();
      fetchCoupons();
    };
    window.addEventListener('admin-access-ready', refreshAdminData);
    return () => window.removeEventListener('admin-access-ready', refreshAdminData);
  }, [fetchRates, fetchTestimonials, fetchTaxonomies, fetchProducts, fetchAdminProducts, fetchCoupons]);

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
        const res = await fetchWithAuth(`/api/v1/metal-rates/batch`, {
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
        const res = await fetchWithAuth(`/api/v1/metal-rates/batch-delete`, {
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
        const res = await fetchWithAuth(`/api/v1/metal-rates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMetal)
        });
        if (res.ok) {
            await fetchRates();
            return { success: true };
        }
        return { success: false };
    } catch (err) {
        console.error("Failed to add new metal type", err);
        return { success: false, error: err.message };
    }
  };

  const updateMetalType = async (id, updatedMetal) => {
    try {
      const res = await fetchWithAuth(`/api/v1/metal-rates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMetal)
      });
      if (res.ok) {
        await fetchRates();
        return { success: true };
      }
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.detail || "Failed to update metal" };
    } catch (err) {
      console.error("Failed to update metal", err);
      return { success: false, error: err.message };
    }
  };

  const deleteMetalType = async (id, metalName) => {
    try {
      const historyRes = await fetchWithAuth(`/api/v1/metal-rates/`);
      let idsToDelete = [id];
      if (historyRes.ok) {
        const allHistory = await historyRes.json();
        const matching = allHistory.filter(r => r.metal_name?.toLowerCase() === metalName?.toLowerCase());
        if (matching.length > 0) {
          idsToDelete = matching.map(r => r.id);
        }
      }
      const res = await fetchWithAuth(`/api/v1/metal-rates/batch-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idsToDelete)
      });
      if (res.ok) {
        await fetchRates();
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Failed to delete metal type", err);
      return { success: false, error: err.message };
    }
  };

  const toggleMetalVisibility = async (metal) => {
    try {
      const newActive = !metal.is_active;
      const res = await fetchWithAuth(`/api/v1/metal-rates/${metal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metal_name: metal.metal_name,
          metal_type: metal.metal_type,
          purity: metal.purity,
          unit: metal.unit,
          rate: parseFloat(metal.rate),
          is_active: newActive
        })
      });
      if (res.ok) {
        await fetchRates();
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Failed to toggle metal visibility", err);
      return { success: false, error: err.message };
    }
  };

  // Homepage Content (Admin)
  const [announcementText, setAnnouncementText] = useState('<span>FREE SHIPPING OVER ₹5000</span> &nbsp;&nbsp;|&nbsp;&nbsp; <span style="color: #C7A66A">USE CODE WELCOME10</span>');
  
  const [heroBanners, setHeroBanners] = useState([]);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`/api/v1/banners/`);
      if (res.ok) {
        const data = await res.json();
        setHeroBanners(data);
      }
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

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
      
      const res = await fetchWithAuth(`/api/v1/testimonials/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchTestimonials();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add testimonial", error);
      return false;
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
      
      const res = await fetchWithAuth(`/api/v1/testimonials/${updatedTestimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchTestimonials();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update testimonial", error);
      return false;
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/testimonials/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
  };

  // Collections are now fetched dynamically from backend

  const addCategory = async (name) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const newCategory = await res.json();
        setCategories(prev => [...prev, newCategory]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addCollection = async (name, displayName, categoryIds = []) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName || name, category_ids: categoryIds })
      });
      if (res.ok) {
        const newCollection = await res.json();
        setCollections(prev => [...prev, newCollection]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCollection = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/collections/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) setCollections(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateCollection = async (id, name, displayName, categoryIds = []) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName || name, category_ids: categoryIds })
      });
      if (res.ok) {
        const updatedCollection = await res.json();
        setCollections(prev => prev.map(c => c.id === id ? updatedCollection : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Coupons (Admin & Frontend)
  const [coupons, setCoupons] = useState([]);

  const addCoupon = async (newCoupon) => {
    try {
      const payload = {
        code: newCoupon.code,
        type: newCoupon.type,
        value: newCoupon.value,
        min_cart_value: newCoupon.minCartValue || null,
        expiry_date: newCoupon.expiryDate || null,
        is_active: newCoupon.isActive !== undefined ? newCoupon.isActive : true
      };
      const res = await fetchWithAuth(`/api/v1/coupons/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Failed to add coupon:", error);
    }
  };

  const updateCoupon = async (updatedCoupon) => {
    try {
      const payload = {
        code: updatedCoupon.code,
        type: updatedCoupon.type,
        value: updatedCoupon.value,
        min_cart_value: updatedCoupon.minCartValue || null,
        expiry_date: updatedCoupon.expiryDate || null,
        is_active: updatedCoupon.isActive
      };
      const res = await fetchWithAuth(`/api/v1/coupons/${updatedCoupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Failed to update coupon:", error);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/coupons/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/coupons/${id}/toggle`, {
        method: "PATCH"
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Failed to toggle coupon:", error);
    }
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
  const addProduct = async (newProduct) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        await fetchProducts();
        await fetchAdminProducts();
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.detail || "Failed to add product" };
    } catch (error) {
      console.error("Failed to add product", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const { id, ...payload } = updatedProduct;
      const res = await fetchWithAuth(`/api/v1/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchProducts();
        await fetchAdminProducts();
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.detail || "Failed to update product" };
    } catch (error) {
      console.error("Failed to update product", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAdminProducts(prev => prev.filter(p => p.id !== id));
        setProducts(prev => prev.filter(p => p.id !== id));
        return { success: true };
      }
      return { success: false, error: "Failed to delete product" };
    } catch (error) {
      console.error("Failed to delete product", error);
      return { success: false, error: "Network error" };
    }
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

  const updateInventory = async (productId, adjustment) => {
    try {
      const res = await fetchWithAuth(`/api/v1/admin/inventory/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ type: adjustment.type, quantity: Number(adjustment.quantity) })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || 'Failed to update stock.');
        return false;
      }
      const update = p => p.id === productId ? { ...p, stockQuantity: data.stock_quantity, lowStockThreshold: data.low_stock_threshold } : p;
      setAdminProducts(prev => prev.map(update));
      setProducts(prev => prev.map(update));
      setInventoryMovements(prev => [{
        id: Date.now(), date: new Date().toISOString(), productId,
        productName: data.name, ...adjustment, quantity: Number(adjustment.quantity)
      }, ...prev]);
      toast.success('Stock updated.');
      return true;
    } catch {
      toast.error('Unable to update stock. Please try again.');
      return false;
    }
  };

  // Add to cart
  const addToCart = async (product, authMessage = "Please sign in or create an account to add items to your cart.") => {
    if (isOutOfStock(product)) {
      toast.info('This product is currently out of stock.');
      return;
    }
    if (!isAuthenticated) {
      openAuthModal(authMessage);
      return;
    }

    try {
      const res = await fetchWithAuth('/api/v1/carts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });
      if (res.ok) {
        fetchCart();
        setIsCartOpen(true);
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Unable to add this product to your cart.');
      }
    } catch (e) { console.error(e); }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/v1/carts/${productId}`, { method: 'DELETE' });
      if (res.ok) fetchCart();
    } catch (e) { console.error(e); }
  };

  // Update cart quantity
  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    if (!isAuthenticated) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/v1/carts/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (res.ok) fetchCart();
      else {
        const data = await res.json();
        toast.error(data.detail || 'Unable to update cart quantity.');
      }
    } catch (e) { console.error(e); }
  };

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in or create an account to save items to your wishlist.");
      return;
    }

    const exists = wishlistItems.find((item) => item.id === product.id);

    if (exists) {
      try {
        const res = await fetchWithAuth(`/api/v1/wishlists/${product.id}`, { method: 'DELETE' });
        if (res.ok) {
          setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== product.id));
        }
      } catch (e) { console.error(e); }
    } else {
      try {
        const res = await fetchWithAuth(`/api/v1/wishlists/${product.id}`, { method: 'POST' });
        if (res.ok) {
          setWishlistItems((prevItems) => [...prevItems, product]);
        }
      } catch (e) { console.error(e); }
    }
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
    isEcommerceEnabled,
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
    allCreatedMetals,
    lastUpdated,
    addNewMetalType,
    updateMetalType,
    deleteMetalType,
    toggleMetalVisibility,
    updateMetalRates,
    metalRateHistory,
    deleteMetalRatesHistory,
    products,
    adminProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    inventoryMovements,
    announcementText,
    updateAnnouncementText,
    heroBanners,
    updateHeroBanners,
    fetchBanners,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    categories,
    metals,
    occasions,
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
