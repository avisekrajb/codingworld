import { useState } from 'react';
import axios from 'axios';

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function CareersPopup({ onClose, dark, C, position }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    portfolio: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/api/careers/apply', {
        ...formData,
        position
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
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
          animation: isMobile ? 'slideUp 0.38s cubic-bezier(0.34,1.4,0.64,1) both' : 'popIn 0.32s cubic-bezier(0.34,1.4,0.64,1) both',
          overflow: 'hidden'
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

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
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 4,
              borderRadius: 2,
              background: C.muted,
              opacity: 0.4
            }} />
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#00e5ff,#bf5fff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}>
              🚀
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Apply for {position}</h3>
              <p style={{ fontSize: 12, color: C.muted }}>Join our team of developers</p>
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

        {submitted ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#00ffb3,#00e5ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              margin: '0 auto 20px'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>
              Application Submitted!
            </h3>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 25 }}>
              Thank you for applying! We'll review your application and contact you within 2-3 business days.
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
        ) : (
          <form onSubmit={handleSubmit} style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px'
          }}>
            <div style={{ marginBottom: 15 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Full Name *
              </label>
              <input
                type="text"
                required
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

            <div style={{ marginBottom: 15 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Email *
              </label>
              <input
                type="email"
                required
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

            <div style={{ marginBottom: 15 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 9824380896"
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

            <div style={{ marginBottom: 15 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Years of Experience *
              </label>
              <select
                required
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                style={{
                  width: '100%',
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: '12px',
                  color: C.text,
                  fontSize: 14
                }}
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-2">1-2 years</option>
                <option value="2-3">2-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Portfolio/GitHub URL
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://github.com/username"
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

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Why do you want to join us? *
              </label>
              <textarea
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about yourself and why you're interested..."
                rows={4}
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
            </div>

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
              {loading ? 'Submitting...' : 'Submit Application 🚀'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}