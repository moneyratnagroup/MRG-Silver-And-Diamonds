import React from 'react';
import { Outlet } from 'react-router-dom';
import MetalRatesBar from '../components/MetalRatesBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import WishlistDrawer from '../components/WishlistDrawer';
import CartDrawer from '../components/CartDrawer';
import MobileBottomNav from '../components/MobileBottomNav';
import Breadcrumbs from '../components/Breadcrumbs';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const UserLayout = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const { isEcommerceEnabled } = useShop();

  return (
    <>
      <MetalRatesBar />
      <Navbar />
      <Breadcrumbs />
      <main className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />

      {isEcommerceEnabled && (
        <>
          <WishlistDrawer />
          <CartDrawer />
        </>
      )}
      <MobileBottomNav />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
};

export default UserLayout;
