import { useState } from 'react';
import axios from 'axios';

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ConsultationModal({ onClose, dark, C, plan, accentColor }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    plan: plan
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/api/consultation', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = () => {
    switch(plan) {
      case 'free': return '#00e5ff';
      case 'upgrade': return '#bf5fff';
      case 'premium': return '#00ffb3';
      default: return accentColor || '#00e5ff';
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
          border: `1px solid ${getPlanColor()}33`,
          borderRadius: isMobile ? '28px 28px 0 0' : '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 0 80px ${getPlanColor()}22`,
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

        {submitted ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg,${getPlanColor()},#0095ff)`,
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
              Consultation Booked!
            </h3>
            <p style={{
              color: C.muted,
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 25
            }}>
              Thank you, <span style={{ color: getPlanColor() }}>{formData.name}</span>! We'll contact you within 24 hours to schedule your free consultation.
            </p>
            <button
              onClick={onClose}
              style={{
                background: `linear-gradient(135deg,${getPlanColor()},#0095ff)`,
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
          <>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${C.border}`,
              background: `linear-gradient(135deg,${getPlanColor()}12,rgba(191,95,255,0.07))`,
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
                  opacity: 0.4,
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `linear-gradient(135deg,${getPlanColor()},#bf5fff)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22
                }}>
                  {plan === 'free' ? '🎯' : plan === 'upgrade' ? '⚡' : '👑'}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>
                    Free Consultation
                  </h3>
                  <p style={{ fontSize: 12, color: getPlanColor(), textTransform: 'capitalize' }}>
                    {plan} Plan
                  </p>
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
              <p style={{
                color: C.muted,
                fontSize: 13,
                marginBottom: 20,
                textAlign: 'center'
              }}>
                Fill in your details and we'll get back to you within 24 hours
              </p>

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
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
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
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
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
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+977 9800000000"
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
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
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
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
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
                  }}
                >
                  <option value="">Select project type</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="design">UI/UX Design</option>
                  <option value="other">Other</option>
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
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
                  }}
                >
                  <option value="">Select budget</option>
                  <option value="< ₹50k">Less than ₹50,000</option>
                  <option value="₹50k-₹2L">₹50,000 - ₹2,00,000</option>
                  <option value="₹2L-₹5L">₹2,00,000 - ₹5,00,000</option>
                  <option value="> ₹5L">More than ₹5,00,000</option>
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
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text
                  }}
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1 month">Within 1 month</option>
                  <option value="3 months">Within 3 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  display: 'block',
                  marginBottom: 6
                }}>
                  Project Description
                </label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  placeholder="Tell us about your project..."
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '12px',
                    color: C.text,
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#888' : `linear-gradient(135deg,${getPlanColor()},#0095ff)`,
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#07071a',
                  cursor: loading ? 'default' : 'pointer',
                  marginBottom: 10,
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Book Free Consultation →'}
              </button>

              <p style={{
                fontSize: 11,
                color: C.muted,
                textAlign: 'center'
              }}>
                We'll contact you within 24 hours. No obligation, completely free.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}