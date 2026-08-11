import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import WishlistDrawer from '../components/WishlistDrawer';
import MobileBottomNav from '../components/MobileBottomNav';
import Breadcrumbs from '../components/Breadcrumbs';

const UserLayout = () => {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Breadcrumbs />
      <main className="main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />

      <WishlistDrawer />
      <MobileBottomNav />
    </>
  );
};

export default UserLayout;
