import React from 'react';
import './AnnouncementBar.css';

const announcements = [
  "✨ 925 Hallmarked Silver Jewellery",
  "💎 Certified Diamond Jewellery",
  "🎁 Premium Gift Packaging Available",
  "✨ New Arrivals Just Dropped",
  "💍 Customized Jewellery Available",
  "📦 Safe Delivery Across India"
];

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar-container">
      <div className="announcement-marquee">
        <div className="marquee-content">
          {announcements.map((text, index) => (
            <span key={index} className="announcement-item">
              {text}
            </span>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {announcements.map((text, index) => (
            <span key={`dup-${index}`} className="announcement-item">
              {text}
            </span>
          ))}
          {/* Duplicate twice to ensure it covers wide screens */}
          {announcements.map((text, index) => (
            <span key={`dup2-${index}`} className="announcement-item">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
