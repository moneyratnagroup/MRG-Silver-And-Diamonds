import React, { useRef } from 'react';
import { motion, useAnimate } from 'framer-motion';

export const ImageTrail = ({ items, children, className = "" }) => {
  const [scope, animate] = useAnimate();
  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  const handleMouseMove = (e) => {
    if (!scope.current) return;

    const { clientX, clientY } = e;
    
    // Calculate distance from last render
    const distance = Math.hypot(
      clientX - lastRenderPosition.current.x,
      clientY - lastRenderPosition.current.y
    );

    // Only render a new image if moved enough distance
    if (distance >= 50) {
      lastRenderPosition.current = { x: clientX, y: clientY };
      
      const imageElements = scope.current.querySelectorAll('.trail-image');
      if (!imageElements.length) return;

      const currentIndex = imageRenderCount.current % imageElements.length;
      const el = imageElements[currentIndex];

      // Get container position to calculate relative mouse position
      const rect = scope.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Ensure elements stay within the container or handle overflow
      // Set initial state
      el.style.display = 'block';
      el.style.zIndex = imageRenderCount.current.toString();

      // Animate
      animate(el, {
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        x: [x, x],
        y: [y, y + 50],
      }, {
        duration: 1.2,
        ease: 'easeOut'
      }).then(() => {
        if (el) {
          el.style.display = 'none';
        }
      });

      imageRenderCount.current++;
    }
  };

  return (
    <div 
      ref={scope} 
      onMouseMove={handleMouseMove}
      className={`image-trail-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      {items.map((src, index) => (
        <motion.img
          key={index}
          className="trail-image"
          src={src}
          alt={`trail-${index}`}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            display: 'none',
            top: 0,
            left: 0,
            width: '180px', // Customize as needed
            height: '240px',
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            x: '-50%',
            y: '-50%'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
        />
      ))}
    </div>
  );
};

export default ImageTrail;
