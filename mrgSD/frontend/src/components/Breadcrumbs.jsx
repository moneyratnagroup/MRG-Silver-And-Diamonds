import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Container } from 'react-bootstrap';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    return null; // Don't render on the home page
  }

  return (
    <div className="breadcrumbs-wrapper">
      <Container fluid className="px-4 px-lg-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0 py-3">
            <li className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link">Home</Link>
            </li>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              
              // Format the name nicely
              let formattedName = name.replace(/-/g, ' ');
              formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

              // Define paths that do not have their own page and shouldn't be clickable
              const nonClickablePaths = ['/silver', '/product'];
              const isClickable = !nonClickablePaths.includes(routeTo);

              return (
                <li key={name} className={`breadcrumb-item ${isLast ? 'active' : ''}`} aria-current={isLast ? 'page' : undefined}>
                  <ChevronRight size={14} className="breadcrumb-separator mx-2" strokeWidth={2} />
                  {isLast ? (
                    <span className="breadcrumb-text">{formattedName}</span>
                  ) : !isClickable ? (
                    <span className="breadcrumb-non-clickable">{formattedName}</span>
                  ) : (
                    <Link to={routeTo} className="breadcrumb-link">{formattedName}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
