import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';

const UserLayout = () => {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
};

export default UserLayout;
