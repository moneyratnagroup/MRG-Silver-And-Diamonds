import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQPage.css';

const faqs = [
  {
    question: "Can I purchase jewelry directly from this website?",
    answer: "No, purchases cannot be made directly through the website. Our website serves as a digital catalog for you to explore our exquisite collections, inquire about specific ornaments, and get a clear view of what we offer. To make a purchase, please download our mobile app or visit our physical store."
  },
  {
    question: "Where can I buy your ornaments?",
    answer: "You can purchase our jewelry exclusively through our official mobile app or by visiting our physical retail store."
  },
  {
    question: "How can I inquire about a specific ornament I saw on the website?",
    answer: "You can use the contact forms or inquiry buttons provided on the product details pages, or reach out to our customer support via phone or email for more information about any specific piece."
  },
  {
    question: "Is the catalog on the website up to date?",
    answer: "Yes, our website is regularly updated to give you a clear-cut view of our latest collections and designs. However, for real-time inventory and purchasing, please check our mobile app."
  },
  {
    question: "Do you offer customization for your jewelry?",
    answer: "We do offer customization services. Please visit our store or contact us through the app to discuss your specific requirements with our expert artisans."
  }
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page-wrapper">
      {/* Hero Banner Section */}
      <div className="about-hero" style={{ height: '40vh', minHeight: '300px' }}>
        <div className="about-hero-image">
          <img src="/faqbg.png" alt="FAQ Support" style={{ filter: 'brightness(0.4)' }} />
        </div>
        <div className="about-hero-overlay">
          <h1 className="about-title" style={{ color: '#fff', fontSize: '3.5rem', marginBottom: 0 }}>Help & FAQ</h1>
        </div>
      </div>

      <Container className="py-5" style={{ maxWidth: '800px' }}>
        <div className="faq-list mt-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {openIndex === index ? <ChevronUp size={20} className="faq-icon" /> : <ChevronDown size={20} className="faq-icon" />}
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default FAQPage;
