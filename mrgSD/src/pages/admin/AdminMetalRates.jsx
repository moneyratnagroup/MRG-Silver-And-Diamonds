import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import './AdminMetalRates.css';

const AdminMetalRates = () => {
  const { metalRates, updateMetalRates } = useShop();
  
  const [goldInput, setGoldInput] = useState(metalRates.gold22k);
  const [gold24kInput, setGold24kInput] = useState(metalRates.gold24k);
  const [silverInput, setSilverInput] = useState(metalRates.silver);
  const [silver999Input, setSilver999Input] = useState(metalRates.silver999);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateMetalRates({
      gold22k: goldInput,
      gold24k: gold24kInput,
      silver: silverInput,
      silver999: silver999Input
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="admin-rates-container">
      <div className="admin-page-header">
        <h1>Metal Rates Management</h1>
        <p>Update the daily gold and silver rates displayed on the frontend.</p>
      </div>

      <div className="admin-rates-card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="goldRate">22K Gold Rate (per gram)</label>
            <div className="input-with-prefix">
              <span className="currency-prefix">₹</span>
              <input 
                type="text" 
                id="goldRate" 
                value={goldInput.replace('₹', '').trim()} 
                onChange={(e) => setGoldInput(`₹${e.target.value}`)}
                placeholder="7,250"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gold24kRate">24K Gold Rate (per gram)</label>
            <div className="input-with-prefix">
              <span className="currency-prefix">₹</span>
              <input 
                type="text" 
                id="gold24kRate" 
                value={gold24kInput.replace('₹', '').trim()} 
                onChange={(e) => setGold24kInput(`₹${e.target.value}`)}
                placeholder="7,910"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="silverRate">Silver Rate (per gram)</label>
            <div className="input-with-prefix">
              <span className="currency-prefix">₹</span>
              <input 
                type="text" 
                id="silverRate" 
                value={silverInput.replace('₹', '').trim()} 
                onChange={(e) => setSilverInput(`₹${e.target.value}`)}
                placeholder="92"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="silver999Rate">99.9% Silver Rate (per gram)</label>
            <div className="input-with-prefix">
              <span className="currency-prefix">₹</span>
              <input 
                type="text" 
                id="silver999Rate" 
                value={silver999Input.replace('₹', '').trim()} 
                onChange={(e) => setSilver999Input(`₹${e.target.value}`)}
                placeholder="94"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save-rates">
              Save Changes
            </button>
            {isSaved && <span className="save-success-msg">Rates updated successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMetalRates;
