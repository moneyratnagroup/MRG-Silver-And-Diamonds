import React from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />
      <main className="main-content" style={{ flexGrow: 1 }}>
        <section className="hero-section" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h1>Discover Elegance</h1>
          <p>Explore our exquisite collection of silver and diamonds.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
