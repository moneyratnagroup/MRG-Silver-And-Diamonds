import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import './AdminHomepage.css';
import './AdminProducts.css';

const AdminHomepage = () => {
  const { announcementText, updateAnnouncementText, heroBanners, fetchBanners } = useShop();
  
  const [localAnnouncement, setLocalAnnouncement] = useState(announcementText);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedSubtitles, setExpandedSubtitles] = useState([]);
  
  // Banner Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerFormData, setBannerFormData] = useState({
    id: null,
    image: '',
    badge: '',
    title: '',
    subtitle: '',
    buttonText: '',
    status: 'publish'
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
        buttonText: '',
        status: 'publish'
      });
    }
    setIsBannerModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/upload/', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const imageUrl = `http://localhost:8000${data.url}`;

      setBannerFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const toggleSubtitle = (id) => {
    setExpandedSubtitles(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBannerFormChange = (e) => {
    const { name, value } = e.target;
    setBannerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner && editingBanner.id) {
        const res = await fetch(`http://localhost:8000/api/v1/banners/${bannerFormData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerFormData)
        });
        if (!res.ok) throw new Error("Failed to update banner");
      } else {
        const res = await fetch(`http://localhost:8000/api/v1/banners/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerFormData)
        });
        if (!res.ok) throw new Error("Failed to create banner");
      }
      await fetchBanners();
      setIsBannerModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/banners/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error("Failed to delete banner");
        await fetchBanners();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAnnouncementText(localAnnouncement);
    
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
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroBanners.map((banner) => {
                  const isExpanded = expandedSubtitles.includes(banner.id);
                  const shouldTruncate = banner.subtitle && banner.subtitle.length > 35;
                  const displaySubtitle = !shouldTruncate || isExpanded 
                    ? banner.subtitle 
                    : banner.subtitle.substring(0, 35);
                    
                  return (
                    <tr key={banner.id}>
                      <td>
                        <div className="table-img-container banner-table-img">
                          <img loading="lazy" src={banner.image} alt="Banner Preview" />
                        </div>
                      </td>
                      <td className="font-medium" dangerouslySetInnerHTML={{ __html: banner.title }}></td>
                      <td style={{ maxWidth: '300px' }}>
                        <div>
                          {displaySubtitle}
                          {shouldTruncate && !isExpanded && (
                            <span 
                              className="expand-subtitle-btn"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubtitle(banner.id); }}
                            >...</span>
                          )}
                          {shouldTruncate && isExpanded && (
                            <span 
                              className="expand-subtitle-btn"
                              style={{ fontWeight: 'normal', fontSize: '0.8rem' }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubtitle(banner.id); }}
                            > (less)</span>
                          )}
                        </div>
                      </td>
                      <td>{banner.badge ? <span className="badge-pill">{banner.badge}</span> : '-'}</td>
                      <td><span className="admin-banner-btn-text">{banner.buttonText || '-'}</span></td>
                      <td>
                        <span className={`status-badge ${banner.status}`}>
                          {banner.status ? banner.status.charAt(0).toUpperCase() + banner.status.slice(1) : 'Publish'}
                        </span>
                      </td>
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
                  );
                })}
                {heroBanners.length === 0 && (
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
                <label>Image URL or Upload System Image</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    name="image" 
                    value={bannerFormData.image} 
                    onChange={handleBannerFormChange} 
                    required 
                    placeholder="https://..."
                    style={{ flex: 1 }}
                  />
                  <label className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px', background: '#e0e0e0', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <Upload size={16} />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*,image/webp" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                {bannerFormData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img loading="lazy" src={bannerFormData.image} alt="Preview" className="banner-preview" style={{ maxHeight: '120px', borderRadius: '4px', border: '1px solid #ddd', objectFit: 'cover' }} />
                  </div>
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
                <label>Status</label>
                <select 
                  name="status" 
                  value={bannerFormData.status || 'publish'} 
                  onChange={handleBannerFormChange}
                >
                  <option value="publish">Publish</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
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
