import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Pages.css';

const ContactPage = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>

      <div className="contact-page-layout">
        <div className="contact-left">
          <div className="contact-info-block">
            <h3>Get In Touch</h3>

            <div className="contact-item-new">
              <MapPin size={22} color="#dc3545" strokeWidth={2.5} />
              <div className="contact-text-new">
                <h4>Our Outlet</h4>
                <p>MoneyRatna Gold & Diamonds<br />Anakkara,<br />Idukki, Kerala</p>
              </div>
            </div>

            <div className="contact-item-new">
              <Phone size={22} color="#dc3545" strokeWidth={2.5} />
              <div className="contact-text-new">
                <h4>Call Us</h4>
                <p>+91 0000000000<br />+91 0000000000<br />+91 0000000000</p>
              </div>
            </div>

            <div className="contact-item-new">
              <Mail size={22} color="#dc3545" strokeWidth={2.5} />
              <div className="contact-text-new">
                <h4>Email Support</h4>
                <p>mrginfo@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="map-container">
            {/* Embedded Google Map */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113645.16104445831!2d72.76672365922312!3d19.011666993181822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce307a0487bd%3A0xb71e16fdf9ce2bd!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1689255716911!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </div>
        </div>

        <div className="contact-right">
          <div className="contact-form-container">
            <h3>Send an Enquiry</h3>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your full name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input type="tel" id="mobile" placeholder="Enter your mobile number" pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" placeholder="What is this regarding?" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Write your message here..." required></textarea>
              </div>

              <button type="submit" className="btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
