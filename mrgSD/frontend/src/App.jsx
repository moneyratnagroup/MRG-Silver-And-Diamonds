import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShopProvider, isEcommerceEnabled } from './context/ShopContext'
import { AuthProvider } from './context/AuthContext'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'

// User Pages
const Home = React.lazy(() => import('./pages/Home'))
const CartPage = React.lazy(() => import('./pages/CartPage'))
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'))
const CollectionPage = React.lazy(() => import('./pages/CollectionPage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const ProductDetailsPage = React.lazy(() => import('./pages/ProductDetailsPage'))
const FAQPage = React.lazy(() => import('./pages/FAQPage'))
const CareersPage = React.lazy(() => import('./pages/CareersPage'))
const JewelleryCarePage = React.lazy(() => import('./pages/JewelleryCarePage'))
const DiamondsPage = React.lazy(() => import('./pages/DiamondsPage'))
const SilverPage = React.lazy(() => import('./pages/SilverPage'))
const GoldPage = React.lazy(() => import('./pages/GoldPage'))
const InvestmentPage = React.lazy(() => import('./pages/InvestmentPage'))
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'))
const AccountPage = React.lazy(() => import('./pages/AccountPage'))
// Admin Pages
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'))
const AdminMetalRates = React.lazy(() => import('./pages/admin/AdminMetalRates'))
const AdminAddMetal = React.lazy(() => import('./pages/admin/AdminAddMetal'))
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'))
const AdminProductForm = React.lazy(() => import('./pages/admin/AdminProductForm'))
const AdminHomepage = React.lazy(() => import('./pages/admin/AdminHomepage'))
const AdminTestimonials = React.lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminTestimonialForm = React.lazy(() => import('./pages/admin/AdminTestimonialForm'))
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories'))
const AdminCoupons = React.lazy(() => import('./pages/admin/AdminCoupons'))
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'))
const AdminOrderDetails = React.lazy(() => import('./pages/admin/AdminOrderDetails'))
const AdminInventory = React.lazy(() => import('./pages/admin/AdminInventory'))
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'))
const AdminReviews = React.lazy(() => import('./pages/admin/AdminReviews'))

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <div className="spinner-border" style={{ color: '#1F2A44' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

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
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

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
                <Route path="users" element={<AdminUsers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="settings" element={<Navigate to="/admin/settings/password" replace />} />
                <Route path="settings/password" element={<AdminSettings key="password" section="password" />} />
                <Route path="settings/permissions" element={<AdminSettings key="permissions" section="permissions" />} />
              </Route>

              {/* User Routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                {isEcommerceEnabled ? (
                  <>
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                  </>
                ) : (
                  <>
                    <Route path="cart" element={<Navigate to="/" replace />} />
                    <Route path="wishlist" element={<Navigate to="/" replace />} />
                    <Route path="checkout" element={<Navigate to="/" replace />} />
                  </>
                )}
                <Route path="products" element={<CollectionPage />} />
                <Route path="silver/:collectionId" element={<SilverPage />} />
                <Route path="silver" element={<SilverPage />} />
                <Route path="gold/:collectionId" element={<GoldPage />} />
                <Route path="gold" element={<GoldPage />} />
                <Route path="product/:productId" element={<ProductDetailsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="care-guide" element={<JewelleryCarePage />} />
                <Route path="diamonds/:collectionId" element={<DiamondsPage />} />
                <Route path="diamonds" element={<DiamondsPage />} />
                {/* <Route path="investment" element={<InvestmentPage />} />
                <Route path="investment/:type" element={<InvestmentPage />} /> */}
                <Route path="account" element={<AccountPage />} />
              </Route>
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ShopProvider>
    </AuthProvider>
  )
}

export default App
