import React from 'react';
import { Outlet } from 'react-router-dom';
import MetalRatesBar from '../components/MetalRatesBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import Breadcrumbs from '../components/Breadcrumbs';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

const UserLayout = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <>
      <MetalRatesBar />
      <Navbar />
      <Breadcrumbs />
      <main className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
};

export default UserLayout;
