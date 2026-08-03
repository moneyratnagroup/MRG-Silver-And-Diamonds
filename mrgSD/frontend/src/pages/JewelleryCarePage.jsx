import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Sparkles, ShieldCheck, Droplet, Sun, CheckCircle2, Shield, Gem, Package, RotateCcw } from 'lucide-react';
import './Pages.css';
import './JewelleryCarePage.css';

const JewelleryCarePage = () => {
  return (
    <>
      {/* Header Banner */}
      <div className="text-center mb-5 d-flex align-items-center justify-content-center flex-column animate-fade-up" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.7)), url("/jcarebg.png")', 
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center',
        borderBottom: '1px solid #eaeaea',
        minHeight: '450px',
        padding: '0 20px'
      }}>
        <Container>
          <h1 className="page-title" style={{ fontWeight: 'bold', color: '#2C3E50', fontSize: '3rem', marginTop: '20px' }}>Jewellery Care Guide</h1>
          <div className="gold-divider"></div>
          <p className="lead" style={{ maxWidth: '700px', margin: '0 auto', color: '#333', marginTop: '1.5rem' }}>
            At Moneyratna, every piece is crafted with utmost care. Follow these simple guidelines to ensure your Gold, Silver, and Diamond jewellery remains as breathtaking as the day you bought it.
          </p>
        </Container>
      </div>

      <div className="page-container pb-5">
        <Container>
          
          {/* Quote Section */}
          <div className="text-center my-5 py-5 animate-fade-up delay-100">
             <p className="care-quote">
               "Proper care preserves not just the beauty of jewellery, but the memories it carries."
             </p>
          </div>

          {/* General Care */}
          <div className="mb-5 py-4 animate-fade-up delay-200">
            <h3 className="text-center" style={{ color: '#2C3E50', fontWeight: '600' }}>Golden Rules of Care</h3>
            <div className="gold-divider mb-5"></div>
            
            <Row>
              <Col md={3} sm={6} className="text-center mb-4">
                <div className="rule-card p-4 h-100 bg-white shadow-sm border border-light">
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(184, 145, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Droplet size={30} style={{ color: '#B89146' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Keep it Dry</h5>
                  <p className="text-muted small">Remove your jewellery before swimming, bathing, or engaging in strenuous physical activities.</p>
                </div>
              </Col>
              <Col md={3} sm={6} className="text-center mb-4">
                <div className="rule-card p-4 h-100 bg-white shadow-sm border border-light">
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(184, 145, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={30} style={{ color: '#B89146' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Last On, First Off</h5>
                  <p className="text-muted small">Apply perfumes, lotions, and cosmetics before putting on your jewellery.</p>
                </div>
              </Col>
              <Col md={3} sm={6} className="text-center mb-4">
                <div className="rule-card p-4 h-100 bg-white shadow-sm border border-light">
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(184, 145, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sun size={30} style={{ color: '#B89146' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Proper Storage</h5>
                  <p className="text-muted small">Store pieces individually in their original boxes or soft pouches to avoid scratches.</p>
                </div>
              </Col>
              <Col md={3} sm={6} className="text-center mb-4">
                <div className="rule-card p-4 h-100 bg-white shadow-sm border border-light">
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(184, 145, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={30} style={{ color: '#B89146' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Gentle Cleaning</h5>
                  <p className="text-muted small">Wipe with a soft, lint-free cloth after every use to remove naturally occurring oils and sweat.</p>
                </div>
              </Col>
            </Row>
          </div>

          {/* Specific Material Care */}
          <div className="mt-5 pt-5 animate-fade-up delay-300">
            <h3 className="text-center" style={{ color: '#2C3E50', fontWeight: '600' }}>Material Specific Guidelines</h3>
            <div className="gold-divider mb-5"></div>
            
            <Row className="mt-4">
              <Col lg={4} className="mb-4">
                <div className="care-card p-5 h-100 border bg-white shadow-sm" style={{ borderTop: '4px solid #FFD700 !important' }}>
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFD700', marginRight: '15px' }}></div>
                    <h4 className="mb-0 fw-bold" style={{ color: '#2C3E50' }}>Gold Jewellery</h4>
                  </div>
                  <ul className="material-list">
                    <li><CheckCircle2 size={18} /> Gold is a naturally soft metal; handle with care to prevent dents and scratches.</li>
                    <li><CheckCircle2 size={18} /> Clean periodically with a solution of warm water and mild dish soap.</li>
                    <li><CheckCircle2 size={18} /> Use a baby-soft toothbrush to gently scrub intricate patterns.</li>
                    <li><CheckCircle2 size={18} /> Strictly avoid exposure to chlorine, which can permanently weaken gold's structure.</li>
                  </ul>
                </div>
              </Col>
              
              <Col lg={4} className="mb-4">
                <div className="care-card p-5 h-100 border bg-white shadow-sm" style={{ borderTop: '4px solid #C0C0C0 !important' }}>
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#C0C0C0', marginRight: '15px' }}></div>
                    <h4 className="mb-0 fw-bold" style={{ color: '#2C3E50' }}>Silver Jewellery</h4>
                  </div>
                  <ul className="material-list">
                    <li><CheckCircle2 size={18} /> Silver naturally tarnishes when exposed to air. Wearing it often keeps tarnishing at bay!</li>
                    <li><CheckCircle2 size={18} /> When not in use, store in an airtight zip-lock bag with an anti-tarnish strip.</li>
                    <li><CheckCircle2 size={18} /> Polish exclusively with a specialized silver polishing cloth.</li>
                    <li><CheckCircle2 size={18} /> Keep away from harsh chemicals, bleach, and rubber bands to avoid discoloration.</li>
                  </ul>
                </div>
              </Col>
              
              <Col lg={4} className="mb-4">
                <div className="care-card p-5 h-100 border bg-white shadow-sm" style={{ borderTop: '4px solid #b9f2ff !important' }}>
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#b9f2ff', marginRight: '15px' }}></div>
                    <h4 className="mb-0 fw-bold" style={{ color: '#2C3E50' }}>Diamond Jewellery</h4>
                  </div>
                  <ul className="material-list">
                    <li><CheckCircle2 size={18} /> Even though diamonds are hard, they can still chip if struck at a specific angle.</li>
                    <li><CheckCircle2 size={18} /> Clean with a mix of warm water and a few drops of ammonia-based cleaner.</li>
                    <li><CheckCircle2 size={18} /> Ensure the settings and prongs are checked annually by a professional.</li>
                    <li><CheckCircle2 size={18} /> Never let diamonds touch each other in storage to prevent scratching.</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>

        </Container>

        {/* Trust Section */}
        <div className="trust-section mt-5 animate-fade-up delay-300">
          <Container>
            <Row className="justify-content-center">
              <Col md={3} sm={6} className="mb-4">
                <div className="trust-item">
                  <Shield size={40} className="mb-3" strokeWidth={1} style={{ color: '#B89146' }} />
                  <h6 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>BIS Hallmarked</h6>
                  <span className="small text-muted">100% Certified Jewellery</span>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <div className="trust-item">
                  <Gem size={40} className="mb-3" strokeWidth={1} style={{ color: '#B89146' }} />
                  <h6 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Certified Diamonds</h6>
                  <span className="small text-muted">IGI & SGL Certification</span>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <div className="trust-item">
                  <Package size={40} className="mb-3" strokeWidth={1} style={{ color: '#B89146' }} />
                  <h6 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Secure Packaging</h6>
                  <span className="small text-muted">Insured & Safe Transit</span>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-4">
                <div className="trust-item">
                  <RotateCcw size={40} className="mb-3" strokeWidth={1} style={{ color: '#B89146' }} />
                  <h6 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Easy Returns</h6>
                  <span className="small text-muted">14-Day Return Policy</span>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default JewelleryCarePage;
