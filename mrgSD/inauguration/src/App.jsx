import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShopProvider, isEcommerceEnabled } from './context/ShopContext'
import { AuthProvider } from './context/AuthContext'
import UserLayout from './layouts/UserLayout'
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
              {/* Redirect any /admin access to home */}
              <Route path="/admin/*" element={<Navigate to="/" replace />} />

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
