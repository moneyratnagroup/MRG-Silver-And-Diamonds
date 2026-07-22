import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ShopProvider } from './context/ShopContext'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// User Pages
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CollectionPage from './pages/CollectionPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMetalRates from './pages/admin/AdminMetalRates'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminHomepage from './pages/admin/AdminHomepage'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminCategories from './pages/admin/AdminCategories'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetails from './pages/admin/AdminOrderDetails'
import AdminInventory from './pages/admin/AdminInventory'

import './App.css'

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="rates" element={<AdminMetalRates />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="homepage" element={<AdminHomepage />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
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
              <Route path="collections/:collectionId" element={<CollectionPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ShopProvider>
  )
}

export default App
