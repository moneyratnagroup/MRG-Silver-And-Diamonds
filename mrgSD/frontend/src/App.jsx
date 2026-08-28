import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShopProvider } from './context/ShopContext'
import { AuthProvider } from './context/AuthContext'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'

// User Pages
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CollectionPage from './pages/CollectionPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import FAQPage from './pages/FAQPage'
import CareersPage from './pages/CareersPage'
import JewelleryCarePage from './pages/JewelleryCarePage'
import DiamondsPage from './pages/DiamondsPage'
import SilverPage from './pages/SilverPage'
import GoldPage from './pages/GoldPage'
import InvestmentPage from './pages/InvestmentPage'
import CheckoutPage from './pages/CheckoutPage'
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMetalRates from './pages/admin/AdminMetalRates'
import AdminAddMetal from './pages/admin/AdminAddMetal'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminHomepage from './pages/admin/AdminHomepage'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminTestimonialForm from './pages/admin/AdminTestimonialForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetails from './pages/admin/AdminOrderDetails'
import AdminInventory from './pages/admin/AdminInventory'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <ScrollToTopButton />
          <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="rates" element={<AdminMetalRates />} />
                <Route path="rates/new" element={<AdminAddMetal />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="testimonials/new" element={<AdminTestimonialForm />} />
                <Route path="testimonials/edit/:id" element={<AdminTestimonialForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetails />} />
                <Route path="inventory" element={<AdminInventory />} />
              </Route>

              {/* User Routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="products" element={<CollectionPage />} />
                <Route path="silver/:collectionId" element={<SilverPage />} />
                <Route path="silver" element={<SilverPage />} />
                <Route path="product/:productId" element={<ProductDetailsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="care-guide" element={<JewelleryCarePage />} />
                <Route path="diamonds/:collectionId" element={<DiamondsPage />} />
                <Route path="diamonds" element={<DiamondsPage />} />
                <Route path="investment" element={<InvestmentPage />} />
                <Route path="investment/:type" element={<InvestmentPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ShopProvider>
    </AuthProvider>
  )
}

export default App
