import { useState } from 'react';
import axios from 'axios';

export default function ContactForm({ dark, C, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/contact/submit', formData);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 24,
      padding: 30,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #00e5ff10, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontSize: 22,
          fontWeight: 800,
          color: C.text,
          marginBottom: 8
        }}>
          Send us a Message
        </h3>
        <p style={{
          color: C.muted,
          fontSize: 14,
          marginBottom: 25,
          lineHeight: 1.6
        }}>
          Fill out the form below and we'll get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name & Email Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 15,
            marginBottom: 15
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: C.muted,
                marginBottom: 5
              }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${errors.name ? '#ff6b6b' : C.border}`,
                  borderRadius: 10,
                  padding: '12px 15px',
                  color: C.text,
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              {errors.name && (
                <span style={{ color: '#ff6b6b', fontSize: 11, marginTop: 3, display: 'block' }}>
                  {errors.name}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: C.muted,
                marginBottom: 5
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                style={{
                  width: '100%',
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${errors.email ? '#ff6b6b' : C.border}`,
                  borderRadius: 10,
                  padding: '12px 15px',
                  color: C.text,
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              {errors.email && (
                <span style={{ color: '#ff6b6b', fontSize: 11, marginTop: 3, display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 15 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: C.muted,
              marginBottom: 5
            }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+977 9824380896"
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${errors.phone ? '#ff6b6b' : C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                color: C.text,
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            {errors.phone && (
              <span style={{ color: '#ff6b6b', fontSize: 11, marginTop: 3, display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>

          {/* Subject */}
          <div style={{ marginBottom: 15 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: C.muted,
              marginBottom: 5
            }}>
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${errors.subject ? '#ff6b6b' : C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                color: C.text,
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            {errors.subject && (
              <span style={{ color: '#ff6b6b', fontSize: 11, marginTop: 3, display: 'block' }}>
                {errors.subject}
              </span>
            )}
          </div>

          {/* Message */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: C.muted,
              marginBottom: 5
            }}>
              Your Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project..."
              rows={5}
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${errors.message ? '#ff6b6b' : C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                color: C.text,
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
                transition: 'all 0.2s'
              }}
            />
            {errors.message && (
              <span style={{ color: '#ff6b6b', fontSize: 11, marginTop: 3, display: 'block' }}>
                {errors.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#888' : 'linear-gradient(135deg, #00e5ff, #0095ff)',
              border: 'none',
              borderRadius: 10,
              padding: '14px',
              color: '#07071a',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.3s'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 20,
                  height: 20,
                  border: '2px solid #07071a',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>

          <p style={{
            fontSize: 11,
            color: C.muted,
            textAlign: 'center',
            marginTop: 15
          }}>
            * Required fields. We'll never share your information.
          </p>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}