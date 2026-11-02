import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Award,
  Send,
  Navigation,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    category: 'Bridal & Fine Jewellery',
    subject: '',
    message: ''
  });

  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (value) => {
    if (value.length > 50) return;
    setFormData(prev => ({ ...prev, email: value }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError('Enter valid email');
    } else {
      setEmailError('');
    }
  };

  const validateMobile = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, mobile: numericValue }));
    if (numericValue && numericValue.length !== 10) {
      setMobileError('Enter 10 digit mobile number');
    } else {
      setMobileError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('Enter valid email');
      valid = false;
    }
    if (formData.mobile.length !== 10) {
      setMobileError('Enter 10 digit mobile number');
      valid = false;
    }

    if (valid) {
      console.log('Form is valid', formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          category: 'Bridal & Fine Jewellery',
          subject: '',
          message: ''
        });
      }, 4000);
    }
  };

  return (
    <div className="contact-luxury-page">
      <div className="contact-luxury-container">

        {/* Hero Header */}
        <div className="contact-hero-header">
          <h1 className="contact-hero-title">
            CONNECT WITH
            <span className="gold-text">MONEYRATNA</span>
          </h1>
          <p className="contact-hero-subtitle">
            Whether you wish to inquire about custom bridal jewelry, our flexible gold savings schemes, or diamond certifications—our dedicated concierge team is delighted to serve you.
          </p>
          <div className="contact-divider-ornament">
            <div className="ornament-line"></div>
            <div className="ornament-diamond"></div>
            <div className="ornament-line right"></div>
          </div>
        </div>

        {/* Two-Column Grid: Form + Concierge Details */}
        <div className="contact-grid-section">

          {/* Left: Send Us A Message Card */}
          <div className="luxury-dark-card">
            <h3 className="card-title-serif">SEND US A MESSAGE</h3>
            <p className="card-subtitle-muted">
              Fill out the form below and our luxury consultant will get back to you within 24 hours.
            </p>

            <form className="contact-luxury-form" onSubmit={handleSubmit}>
              <div className="form-row-2col">
                <div className="form-group-custom">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-custom">
                  <label htmlFor="mobile">Phone Number *</label>
                  <input
                    type="tel"
                    id="mobile"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => validateMobile(e.target.value)}
                    required
                  />
                  {mobileError && <span className="field-error">{mobileError}</span>}
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group-custom">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => validateEmail(e.target.value)}
                    maxLength={50}
                    required
                  />
                  {emailError && <span className="field-error">{emailError}</span>}
                </div>

                <div className="form-group-custom">
                  <label htmlFor="category">Select Inquiry Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Bridal & Fine Jewellery">Bridal & Fine Jewellery</option>
                    <option value="Certified Diamonds">Certified Diamonds</option>
                    <option value="925 Silver Collection">925 Silver Collection</option>
                    <option value="Gold Savings Scheme">Gold Savings Scheme</option>
                    <option value="Store Visit & Appointment">Store Visit & Appointment</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
              </div>

              <div className="form-group-custom">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="message">Your Detailed Message / Requirements *</label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Tell us about the design, metal preference, or assistance you require..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              {isSubmitted && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(46, 125, 50, 0.15)', border: '1px solid #2e7d32', borderRadius: '6px', color: '#81c784', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                  ✓ Thank you! Your message has been sent. Our consultant will contact you shortly.
                </div>
              )}

              <button type="submit" className="btn-luxury-gold">
                SEND MESSAGE <Send size={15} />
              </button>
            </form>
          </div>

          {/* Right: Direct Concierge & Hallmark Guarantee Cards */}
          <div className="concierge-column">

            {/* Card 1: Direct Concierge */}
            <div className="luxury-dark-card">
              <div className="concierge-header">
                <Sparkles size={20} className="concierge-icon-gold" />
                <h3 className="card-title-serif" style={{ margin: 0 }}>DIRECT CONCIERGE</h3>
              </div>

              <div className="concierge-items-list">

                {/* Phone Support */}
                <div className="concierge-item">
                  <div className="item-icon">
                    <Phone size={17} />
                  </div>
                  <div className="concierge-item-content">
                    <h5>CONCIERGE DESK DIRECT</h5>
                    <p>
                      <a href="tel:+917025925916">+91 7025925916</a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="concierge-item">
                  <div className="item-icon">
                    <MessageCircle size={17} />
                  </div>
                  <div className="concierge-item-content">
                    <h5>WHATSAPP SUPPORT</h5>
                    <p>
                      <a
                        href="https://wa.me/917025925916?text=Hi%20Moneyratna%20Jewellery%2C%20I%20would%20like%20to%20inquire%20about%20your%20jewellery%20collection."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                      >
                        Chat with Jewellery Support ↗
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email Support */}
                <div className="concierge-item">
                  <div className="item-icon">
                    <Mail size={17} />
                  </div>
                  <div className="concierge-item-content">
                    <h5>EMAIL INQUIRIES</h5>
                    <p>
                      <a href="mailto:mrginfo@gmail.com">mrginfo@gmail.com</a>
                    </p>
                  </div>
                </div>

                {/* Store Hours */}
                <div className="concierge-item">
                  <div className="item-icon">
                    <Clock size={17} />
                  </div>
                  <div className="concierge-item-content">
                    <h5>SHOWROOM TIMINGS</h5>
                    <p style={{ fontWeight: 500 }}>Monday – Saturday: 09:30 AM – 08:00 PM</p>
                    <p style={{ color: '#8b9fb5', fontSize: '0.82rem' }}>Sunday: Open on special occasions</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 2: 100% BIS Hallmark Guarantee */}
            <div className="luxury-dark-card hallmark-card">
              <div className="hallmark-badge-gold">
                <ShieldCheck size={32} strokeWidth={1.75} />
              </div>
              <h4 className="hallmark-title">100% BIS HALLMARK GUARANTEED</h4>
              <p className="hallmark-desc">
                Every ornament crafted at Moneyratna carries certified purity standards, transparent billing, and lifetime maintenance assurance.
              </p>
            </div>

          </div>

        </div>

        {/* Lower Section: Visit Our Showrooms */}
        <div className="showrooms-section">

          <div className="showrooms-header">
            <h2 className="showrooms-title">VISIT OUR SHOWROOMS</h2>
            <p className="showrooms-subtitle">
              Step into our opulent spaces to explore handcrafted gold, diamond, and silver bridal jewelry in person.
            </p>

            <div className="showroom-pills-row">
              <button type="button" className="showroom-pill-btn active">
                <MapPin size={14} /> ANAKKARA MAIN SHOWROOM
              </button>
            </div>
          </div>

          {/* Split Showroom Card: Left info, Right map */}
          <div className="showroom-split-card">

            <div className="showroom-details-pane">
              <div>
                <span className="showroom-flagship-tag">FLAGSHIP SHOWROOM</span>
                <h3 className="showroom-name">Moneyratna Jewellery</h3>

                <div className="showroom-info-items">
                  <div className="showroom-info-item">
                    <MapPin size={18} className="icon" />
                    <p>
                      Anakkara, Idukki District,<br />
                      Kerala, India
                    </p>
                  </div>

                  <div className="showroom-info-item">
                    <Phone size={18} className="icon" />
                    <p>
                      <a href="tel:+917025925916" style={{ color: 'inherit', textDecoration: 'none' }}>+91 7025925916</a>
                    </p>
                  </div>

                  <div className="showroom-info-item">
                    <Mail size={18} className="icon" />
                    <p>
                      <a href="mailto:mrginfo@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>mrginfo@gmail.com</a>
                    </p>
                  </div>
                </div>

                {/* Amenity Badges */}
                <div className="showroom-amenities-row">
                  <span className="amenity-badge">
                    <Sparkles size={12} /> Valet Parking
                  </span>
                  <span className="amenity-badge">
                    <Award size={12} /> Certified Gemologist
                  </span>
                  <span className="amenity-badge">
                    <ShieldCheck size={12} /> Custom Bespoke Lounge
                  </span>
                </div>
              </div>

              {/* Showroom Actions */}
              <div className="showroom-actions-row">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=9.665110,77.157913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-showroom-action primary"
                >
                  <Navigation size={14} /> GET DIRECTIONS
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="showroom-map-pane">
              <iframe
                src="https://maps.google.com/maps?q=9.665110,77.157913&hl=en&z=17&output=embed"
                title="Moneyratna Jewellery Anakkara Location"
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
