import { useState } from 'react';
import axios from 'axios';

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const StarSVG = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ffd700" : "none"} stroke="#ffd700" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function FeedbackModal({ onClose, dark, C }) {
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const isMobile = window.innerWidth <= 768;

 // Update the handleFile function
const handleFile = (file) => {
  if (file) {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPG, JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setFormData({ ...formData, photo: file });
    setPhotoPreview(URL.createObjectURL(file));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment || !formData.photo) {
      alert('Please fill all fields and upload a photo');
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('comment', formData.comment);
    formDataToSend.append('photo', formData.photo);

    try {
      await axios.post('/api/feedback/submit', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStep(2);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)'
      }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: isMobile ? '100%' : 'min(500px,94vw)',
          maxHeight: isMobile ? '90vh' : '85vh',
          background: dark ? 'linear-gradient(160deg,#0d0d28,#0a0a1e)' : 'linear-gradient(160deg,#f8f8ff,#eeeefa)',
          border: `1px solid #00e5ff33`,
          borderRadius: isMobile ? '28px 28px 0 0' : '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 80px #00e5ff22, 0 30px 80px rgba(0,0,0,0.5)',
          animation: isMobile
            ? 'slideUpModal 0.38s cubic-bezier(0.34,1.4,0.64,1) both'
            : 'popModal 0.32s cubic-bezier(0.34,1.4,0.64,1) both',
          overflow: 'hidden'
        }}
      >
        <style>{`
          @keyframes slideUpModal {
            from { opacity: 0; transform: translateY(100%); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes popModal {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {step === 1 ? (
          <>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${C.border}`,
              background: 'linear-gradient(135deg,#00e5ff12,rgba(191,95,255,0.07))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {isMobile && (
                <div style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: C.muted,
                  margin: '0 auto 14px',
                  opacity: 0.4,
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg,#00e5ff,#bf5fff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20
                }}>
                  💬
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Write a Feedback</h3>
                  <p style={{ fontSize: 12, color: C.muted }}>Share your experience with us</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: C.muted
                }}
              >
                <CloseSVG />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px'
            }}>
              {/* Photo Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  display: 'block',
                  marginBottom: 8
                }}>
                  YOUR PHOTO *
                </label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => document.getElementById('photo-upload').click()}
                  style={{
                    border: `2px dashed ${dragging ? '#00e5ff' : photoPreview ? '#00e5ff66' : C.border}`,
                    borderRadius: 12,
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragging ? '#00e5ff08' : photoPreview ? '#00e5ff06' : 'transparent'
                  }}
                >
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={e => handleFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  {photoPreview ? (
                    <div>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 10px',
                          border: '3px solid #00e5ff'
                        }}
                      />
                      <div style={{ fontSize: 13, color: '#00e5ff' }}>✓ Photo selected</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                      <div style={{ fontSize: 13, color: C.muted }}>Click to upload or drag & drop</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>JPG, JPEG, PNG (Max 5MB)</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  display: 'block',
                  marginBottom: 6
                }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text,
                    fontSize: 14
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  display: 'block',
                  marginBottom: 6
                }}>
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text,
                    fontSize: 14
                  }}
                />
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  display: 'block',
                  marginBottom: 8
                }}>
                  RATING
                </label>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: r })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <StarSVG filled={r <= formData.rating} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  display: 'block',
                  marginBottom: 6
                }}>
                  YOUR FEEDBACK *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  maxLength={500}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text,
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
                <div style={{
                  textAlign: 'right',
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 4
                }}>
                  {formData.comment.length}/500
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#888' : 'linear-gradient(135deg,#00e5ff,#0095ff)',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#07071a',
                  cursor: loading ? 'default' : 'pointer',
                  marginBottom: 10
                }}
              >
                {loading ? 'Submitting...' : 'Submit Feedback ✨'}
              </button>

              <p style={{
                fontSize: 11,
                color: C.muted,
                textAlign: 'center'
              }}>
                * Required fields. Your feedback will be reviewed before publishing.
              </p>
            </form>
          </>
        ) : (
          // Success Message
          <div style={{
            padding: '40px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#00e5ff,#00ffb3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              margin: '0 auto 20px'
            }}>
              ✓
            </div>
            <h3 style={{
              fontSize: 22,
              fontWeight: 800,
              color: C.text,
              marginBottom: 10
            }}>
              Thank You, {formData.name}!
            </h3>
            <p style={{
              color: C.muted,
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 25
            }}>
              We've received your feedback and sent a confirmation email to <strong style={{ color: '#00e5ff' }}>{formData.email}</strong>.
              Our team will review it shortly.
            </p>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                border: 'none',
                borderRadius: 10,
                padding: '12px 30px',
                fontWeight: 700,
                fontSize: 14,
                color: '#07071a',
                cursor: 'pointer'
              }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}