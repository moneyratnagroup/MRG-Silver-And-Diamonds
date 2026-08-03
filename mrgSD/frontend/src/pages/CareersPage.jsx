import React from 'react';
import { Container } from 'react-bootstrap';
import './Pages.css';

const CareersPage = () => {
  return (
    <div className="page-container py-5">
      <Container>
        <h1 className="text-center mb-4">Careers at Moneyratna</h1>
        <div className="content-section text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="lead mb-4">
            Join our team at Moneyratna Silver & Diamonds. 
            We are always looking for talented individuals who are passionate about jewellery, exceptional craftsmanship, and outstanding customer service.
          </p>
          <div className="mt-5 p-4 bg-light rounded shadow-sm">
            <h4>Current Openings</h4>
            <p className="text-muted mt-3">There are currently no open positions. Please check back later.</p>
            <hr className="my-4" />
            <p className="mb-0">
              You can also send your resume to <a href="mailto:careers@moneyratna.com" className="text-primary text-decoration-none">careers@moneyratna.com</a> and we will contact you if a suitable position opens up.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CareersPage;
