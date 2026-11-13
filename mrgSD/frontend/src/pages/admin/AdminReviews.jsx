import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, Trash2, Eye, EyeOff, Search, Image as ImageIcon, X, MessageSquare, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_URL } from '../../utils/api';
import './AdminTestimonials.css';
import './AdminReviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [productPreview, setProductPreview] = useState(null);

  useEffect(() => {
    const close = () => setProductPreview(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, []);

  const showProductPreview = (event, review) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.min(200, window.innerWidth - 24, window.innerHeight - 24);
    const left = rect.right + 16 + size <= window.innerWidth - 12
      ? rect.right + 16 : Math.max(12, rect.left - size - 16);
    setProductPreview({
      src: review.product_image.startsWith('http') ? review.product_image : `${API_URL}${review.product_image}`,
      name: review.product_name,
      left,
      top: Math.max(12, Math.min(rect.top, window.innerHeight - size - 12)),
      size,
    });
  };

  // Reply Modal States
  const [replyModalReview, setReplyModalReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);
  const [updatingReplyId, setUpdatingReplyId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/v1/admin/reviews/');
      if (res.ok) {
        const data = await res.json();
        setReviews(data || []);
      } else {
        toast.error('Failed to load reviews.');
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
      toast.error('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (review) => {
    const updatedStatus = !review.is_approved;
    try {
      const res = await fetchWithAuth(`/api/v1/admin/reviews/${review.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_approved: updatedStatus })
      });

      if (res.ok) {
        setReviews(prev =>
          prev.map(r => r.id === review.id ? { ...r, is_approved: updatedStatus } : r)
        );
        toast.success(`Review ${updatedStatus ? 'published' : 'hidden'} successfully.`);
      } else {
        toast.error('Failed to update review status.');
      }
    } catch (err) {
      console.error('Error updating review status:', err);
      toast.error('Error updating status.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/v1/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        toast.success('Review deleted successfully.');
      } else {
        toast.error('Failed to delete review.');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Error deleting review.');
    }
  };

  const handleToggleReplyVisibility = async (review) => {
    setUpdatingReplyId(review.id);
    try {
      const res = await fetchWithAuth(`/api/v1/admin/reviews/${review.id}/reply/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ admin_reply_hidden: !review.admin_reply_hidden })
      });
      if (!res.ok) throw new Error('Failed to update reply visibility');
      const updated = await res.json();
      setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
      toast.success(updated.admin_reply_hidden ? 'Reply hidden. Customer review remains unchanged.' : 'Reply is now visible.');
    } catch {
      toast.error('Failed to update reply visibility. Please try again.');
    } finally {
      setUpdatingReplyId(null);
    }
  };

  const openReplyModal = (review) => {
    setReplyModalReview(review);
    setReplyText(review.admin_reply || '');
  };

  const closeReplyModal = () => {
    setReplyModalReview(null);
    setReplyText('');
  };

  const handleSaveReply = async (clear = false) => {
    if (!replyModalReview) return;
    if (clear && !window.confirm('Permanently remove this official reply? The customer review will remain.')) return;
    const textToSend = clear ? '' : replyText.trim();
    if (!clear && !textToSend) {
      toast.warn('Please enter a response before saving.');
      return;
    }

    setSavingReply(true);
    try {
      const res = await fetchWithAuth(`/api/v1/admin/reviews/${replyModalReview.id}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ admin_reply: textToSend })
      });

      if (res.ok) {
        const updated = await res.json();
        setReviews(prev =>
          prev.map(r =>
            r.id === updated.id
              ? { ...r, admin_reply: updated.admin_reply, admin_replied_at: updated.admin_replied_at, admin_reply_hidden: updated.admin_reply_hidden }
              : r
          )
        );
        toast.success(clear ? 'Official reply removed.' : 'Official reply saved successfully.');
        closeReplyModal();
      } else {
        toast.error('Failed to update reply.');
      }
    } catch (err) {
      console.error('Error saving reply:', err);
      toast.error('Error saving reply.');
    } finally {
      setSavingReply(false);
    }
  };

  // Metrics
  const totalReviews = reviews.length;
  const publishedCount = reviews.filter(r => r.is_approved).length;
  const hiddenCount = reviews.filter(r => !r.is_approved).length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Filtered Reviews
  const filteredReviews = reviews.filter(r => {
    // Rating filter
    if (selectedRating !== 'all' && r.rating !== parseInt(selectedRating, 10)) {
      return false;
    }
    // Status filter
    if (selectedStatus === 'published' && !r.is_approved) return false;
    if (selectedStatus === 'hidden' && r.is_approved) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProduct = r.product_name && r.product_name.toLowerCase().includes(q);
      const matchUser = r.user_name && r.user_name.toLowerCase().includes(q);
      const matchTitle = r.title && r.title.toLowerCase().includes(q);
      const matchComment = r.comment && r.comment.toLowerCase().includes(q);
      return matchProduct || matchUser || matchTitle || matchComment;
    }

    return true;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#b89146' : '#e5e7eb', fontSize: '1.1rem' }}>
        ★
      </span>
    ));
  };

  return (
    <div className="admin-reviews-container">
      <div className="admin-page-header">
        <h1>Product Reviews Management</h1>
        <p>Monitor, approve, and moderate customer ratings and product feedback.</p>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-label">Total Reviews</div>
          <div className="admin-metric-val">{totalReviews}</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Average Store Rating</div>
          <div className="admin-metric-val gold">
            ★ {avgRating}
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Published Reviews</div>
          <div className="admin-metric-val green">{publishedCount}</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Hidden / Flagged</div>
          <div className="admin-metric-val amber">{hiddenCount}</div>
        </div>
      </div>

      <div className="admin-section-card">
        {/* Search & Filters */}
        <div className="admin-filter-bar">
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by product, customer, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
              style={{ width: '100%', paddingLeft: '36px' }}
            />
            <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            className="admin-filter-select"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            className="admin-filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* Reviews Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-table">
                    Loading customer reviews...
                  </td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="review-product-cell">
                        {r.product_image ? (
                          <div className="review-image-wrapper" tabIndex={0} aria-label={`Preview ${r.product_name}`}
                            onMouseEnter={(event) => showProductPreview(event, r)}
                            onMouseLeave={() => setProductPreview(null)}
                            onFocus={(event) => showProductPreview(event, r)}
                            onBlur={() => setProductPreview(null)}
                            onKeyDown={(event) => { if (event.key === 'Escape') setProductPreview(null); }}
                          >
                          <img
                            src={r.product_image.startsWith('http') ? r.product_image : `${API_URL}${r.product_image}`}
                            alt={r.product_name}
                            className="review-prod-thumb"
                          />

                          </div>
                        ) : (
                          <div className="review-prod-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                            🛍️
                          </div>
                        )}
                        <div className="review-prod-info">
                          <span className="review-prod-title" title={r.product_name}>
                            {r.product_name}
                          </span>
                          <span className="review-prod-id">ID: #{r.product_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium review-customer-name">{r.user_name}</td>
                    <td>
                      <div className="star-rating-display" style={{ display: 'flex' }}>
                        {renderStars(r.rating)}
                      </div>
                    </td>
                    <td>
                      <div className="review-content-cell">
                        <details className="review-customer-details">
                          <summary className="review-collapse-summary" aria-label="Expand customer review">
                            <span className="review-summary-line"><strong>{r.title}</strong> ? {r.comment}</span>
                            <span className="review-expand-dots" aria-hidden="true">...</span>
                          </summary>
                          <div className="review-title-text">{r.title}</div>
                          <div className="review-full-text">{r.comment}</div>
                        {r.image_url && (
                          <button
                            type="button"
                            className="review-photo-btn"
                            onClick={() => setPreviewPhoto(r.image_url.startsWith('http') ? r.image_url : `${API_URL}${r.image_url}`)}
                          >
                            <ImageIcon size={12} /> View Customer Photo
                          </button>
                        )}
                        </details>
                        {r.admin_reply && (
                          <details className="admin-reply-preview-box review-reply-details">
                            <summary className="review-collapse-summary" aria-label="Expand official reply">
                              <span className="review-summary-line"><strong>Our reply:</strong> {r.admin_reply}</span>
                              <ChevronDown size={15} className="review-expand-arrow" aria-hidden="true" />
                            </summary>
                            <div className="admin-reply-preview-header">
                              <span className="admin-reply-preview-badge">Official Response</span>
                              {r.admin_replied_at && (
                                <span className="admin-reply-preview-date">
                                  {new Date(r.admin_replied_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                            {r.admin_reply_hidden && <p className="reply-hidden-label">Hidden ? visible only to admins</p>}
                            <div className="admin-reply-preview-body">{r.admin_reply}</div>
                            <button
                              type="button"
                              className="btn-reply-action"
                              disabled={updatingReplyId !== null}
                              onClick={() => handleToggleReplyVisibility(r)}
                            >
                              {r.admin_reply_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                              {updatingReplyId === r.id ? 'Updating...' : r.admin_reply_hidden ? 'Show Reply' : 'Hide Reply'}
                            </button>
                          </details>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#666', whiteSpace: 'nowrap' }}>
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '-'}
                    </td>
                    <td>
                      <span className={`status-pill ${r.is_approved ? 'published' : 'hidden'}`}>
                        {r.is_approved ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-reply-action"
                          title={r.admin_reply ? "Edit official response" : "Reply to customer review"}
                          onClick={() => openReplyModal(r)}
                        >
                          <MessageSquare size={14} />
                          <span>{r.admin_reply ? "Edit Reply" : "Reply"}</span>
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-status ${r.is_approved ? 'hide' : 'publish'}`}
                          title={r.is_approved ? 'Hide review from storefront' : 'Approve & publish review'}
                          onClick={() => handleToggleStatus(r)}
                        >
                          {r.is_approved ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          type="button"
                          className="btn-icon delete"
                          title="Delete review permanently"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No customer reviews found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {productPreview && createPortal(
        <div className="admin-review-product-preview" aria-hidden="true"
          style={{ left: productPreview.left, top: productPreview.top, width: productPreview.size, height: productPreview.size }}>
          <img src={productPreview.src} alt={productPreview.name} />
        </div>,
        document.body
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="modal-overlay" onClick={() => setPreviewPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="photo-modal-close" onClick={() => setPreviewPhoto(null)}>
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Customer Review Photo</h3>
            <img src={previewPhoto} alt="Review attachment" className="photo-modal-img" />
          </div>
        </div>
      )}

      {/* Admin Reply Modal */}
      {replyModalReview && (
        <div className="modal-overlay" onClick={closeReplyModal}>
          <div className="reply-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="photo-modal-close" onClick={closeReplyModal}>
              <X size={20} />
            </button>
            <div className="reply-modal-header">
              <h3>{replyModalReview.admin_reply ? 'Edit Official Response' : 'Reply to Customer Review'}</h3>
              <p className="reply-modal-sub">
                Replying to <strong>{replyModalReview.user_name}</strong> on <em>"{replyModalReview.product_name}"</em>
              </p>
            </div>

            {/* Customer Review Summary Card */}
            <div className="reply-modal-quote">
              <div className="reply-quote-rating">
                {renderStars(replyModalReview.rating)}
                <span className="reply-quote-title">{replyModalReview.title}</span>
              </div>
              <div className="reply-quote-body">"{replyModalReview.comment}"</div>
            </div>

            <div className="reply-modal-field">
              <label htmlFor="admin-reply-textarea">Official Response from Team Moneyratna:</label>
              <textarea
                id="admin-reply-textarea"
                rows={4}
                className="reply-modal-textarea"
                placeholder="Thank the customer, provide helpful guidance, or address their feedback..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <div className="reply-modal-actions">
              {replyModalReview.admin_reply && (
                <button
                  type="button"
                  className="btn-remove-reply"
                  disabled={savingReply}
                  onClick={() => handleSaveReply(true)}
                >
                  Remove Reply
                </button>
              )}
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  disabled={savingReply}
                  onClick={closeReplyModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-modal-submit"
                  disabled={savingReply}
                  onClick={() => handleSaveReply(false)}
                >
                  {savingReply ? 'Saving...' : replyModalReview.admin_reply ? 'Update Reply' : 'Post Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

