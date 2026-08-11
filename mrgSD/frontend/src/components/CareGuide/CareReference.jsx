import React from 'react';
import { motion } from 'framer-motion';
import './CareGuide.css';

const CareReference = () => {
  return (
    <section className="care-section-padding bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="care-subheading-sans">QUICK GUIDE</span>
          <h2 className="care-heading-serif" style={{ fontSize: '3rem', marginTop: '10px' }}>Your Quick Care Reference</h2>
        </div>

        <div className="reference-table-wrapper">
          <table className="care-table">
            <thead>
              <tr>
                <th>Jewellery</th>
                <th>Water</th>
                <th>Chemicals</th>
                <th>Cleaning</th>
                <th>Storage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="type-cell">Silver</td>
                <td>Avoid excessive exposure</td>
                <td>Avoid completely</td>
                <td>Soft silver cloth</td>
                <td>Dry / individual airtight</td>
              </tr>
              <tr>
                <td className="type-cell">Diamond</td>
                <td>Avoid unnecessary exposure</td>
                <td>Avoid completely</td>
                <td>Gentle soap & water</td>
                <td>Individual</td>
              </tr>
              <tr>
                <td className="type-cell">Gold</td>
                <td>Avoid excessive exposure</td>
                <td>Avoid completely</td>
                <td>Gentle soap & water</td>
                <td>Individual</td>
              </tr>
              <tr>
                <td className="type-cell">Pearl</td>
                <td><strong>Do not submerge</strong></td>
                <td>Strictly avoid</td>
                <td>Dry soft cloth only</td>
                <td>Separate / lay flat</td>
              </tr>
              <tr>
                <td className="type-cell">Gemstones</td>
                <td>Depends on stone</td>
                <td>Avoid completely</td>
                <td>Stone-specific</td>
                <td>Separate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default CareReference;
