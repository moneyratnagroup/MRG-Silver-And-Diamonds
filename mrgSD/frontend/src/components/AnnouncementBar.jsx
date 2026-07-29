import React from 'react';
import { useShop } from '../context/ShopContext';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const { announcementText } = useShop();

  // Create an array of identical announcements to fill the marquee
  const announcements = Array(6).fill(announcementText);
  return (
    <div className="announcement-bar-container">
      <div className="announcement-marquee">
        <div className="marquee-content">
          {announcements.map((text, index) => (
            <span key={index} className="announcement-item" dangerouslySetInnerHTML={{ __html: text }}></span>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {announcements.map((text, index) => (
            <span key={`dup-${index}`} className="announcement-item" dangerouslySetInnerHTML={{ __html: text }}></span>
          ))}
          {/* Duplicate twice to ensure it covers wide screens */}
          {announcements.map((text, index) => (
            <span key={`dup2-${index}`} className="announcement-item" dangerouslySetInnerHTML={{ __html: text }}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
