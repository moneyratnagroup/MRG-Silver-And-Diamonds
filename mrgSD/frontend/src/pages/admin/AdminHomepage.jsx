import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './AdminHomepage.css';

const AdminHomepage = () => {
  const { announcementText, updateAnnouncementText, heroBanners, updateHeroBanners } = useShop();
  
  const [localAnnouncement, setLocalAnnouncement] = useState(announcementText);
  const [localBanners, setLocalBanners] = useState([...heroBanners]);
  const [isSaved, setIsSaved] = useState(false);
  
  // Banner Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerFormData, setBannerFormData] = useState({
    id: null,
    image: '',
    badge: '',
    title: '',
    subtitle: '',
    buttonText: ''
  });

  const handleOpenBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerFormData({ ...banner });
    } else {
      setEditingBanner(null);
      setBannerFormData({
        id: null,
        image: '',
        badge: '',
        title: '',
        subtitle: '',
        buttonText: ''
      });
    }
    setIsBannerModalOpen(true);
  };

  const handleBannerFormChange = (e) => {
    const { name, value } = e.target;
    setBannerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    let updatedBanners;
    
    if (editingBanner) {
      // Update existing
      updatedBanners = localBanners.map(b => b.id === bannerFormData.id ? bannerFormData : b);
    } else {
      // Create new
      const newId = localBanners.length > 0 ? Math.max(...localBanners.map(b => b.id)) + 1 : 1;
      updatedBanners = [...localBanners, { ...bannerFormData, id: newId }];
    }
    
    setLocalBanners(updatedBanners);
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      setLocalBanners(localBanners.filter(b => b.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAnnouncementText(localAnnouncement);
    updateHeroBanners(localBanners);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="admin-homepage-container">
      <div className="admin-page-header">
        <h1>Homepage Content Management</h1>
        <p>Update the announcement marquee and hero banners instantly.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="admin-section-card">
          <h2>Announcement Bar</h2>
          <p className="section-desc">This scrolling text appears at the very top of the website.</p>
          <div className="form-group">
            <label>Scrolling Text</label>
            <input 
              type="text" 
              value={localAnnouncement} 
              onChange={(e) => setLocalAnnouncement(e.target.value)}
              placeholder='e.g. USE CODE "WELCOME10" FOR 10% OFF'
              required
            />
          </div>
        </div>

        <div className="admin-section-card">
          <div className="section-header-flex">
            <div>
              <h2>Hero Banners</h2>
              <p className="section-desc">Manage the main image sliders on the homepage.</p>
            </div>
            <button type="button" className="btn-add-product" onClick={() => handleOpenBannerModal()}>
              <Plus size={18} />
              Create Banner
            </button>
          </div>
          
          <div className="admin-products-table-container">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Subtitle</th>
                  <th>Badge</th>
                  <th>Button</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localBanners.map((banner) => (
                  <tr key={banner.id}>
                    <td>
                      <div className="table-img-container banner-table-img">
                        <img src={banner.image} alt="Banner Preview" />
                      </div>
                    </td>
                    <td className="font-medium" dangerouslySetInnerHTML={{ __html: banner.title }}></td>
                    <td><div className="truncate-text">{banner.subtitle}</div></td>
                    <td>{banner.badge ? <span className="badge-pill">{banner.badge}</span> : '-'}</td>
                    <td>{banner.buttonText || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="btn-icon edit" onClick={() => handleOpenBannerModal(banner)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button type="button" className="btn-icon delete" onClick={() => handleDeleteBanner(banner.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {localBanners.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center empty-table">
                      No hero banners found. Create one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-fixed-actions">
          {isSaved && <span className="save-success-msg">Changes saved and live!</span>}
          <button type="submit" className="btn-save-content">
            Save All Changes
          </button>
        </div>
      </form>

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingBanner ? 'Edit Banner' : 'Create Banner'}</h2>
              <button className="btn-close-modal" onClick={() => setIsBannerModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveBanner} className="product-form">
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  name="image" 
                  value={bannerFormData.image} 
                  onChange={handleBannerFormChange} 
                  required 
                  placeholder="https://..."
                />
                {bannerFormData.image && (
                  <img src={bannerFormData.image} alt="Preview" className="banner-preview" />
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Badge Text</label>
                  <input 
                    type="text" 
                    name="badge" 
                    value={bannerFormData.badge} 
                    onChange={handleBannerFormChange} 
                    placeholder="e.g. New Collection"
                  />
                </div>
                
                <div className="form-group half">
                  <label>Button Text</label>
                  <input 
                    type="text" 
                    name="buttonText" 
                    value={bannerFormData.buttonText} 
                    onChange={handleBannerFormChange} 
                    placeholder="e.g. Shop Now"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Heading (Use &lt;br/&gt; for new line)</label>
                <input 
                  type="text" 
                  name="title" 
                  value={bannerFormData.title} 
                  onChange={handleBannerFormChange} 
                />
              </div>

              <div className="form-group">
                <label>Subheading</label>
                <textarea 
                  name="subtitle" 
                  value={bannerFormData.subtitle} 
                  onChange={handleBannerFormChange} 
                  rows="2"
                ></textarea>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsBannerModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">
                  {editingBanner ? 'Update Banner' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomepage;
