import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageServices({ dark, C }) {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    desc: '',
    order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/admin/services');
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`/api/admin/services/${editingService._id}`, formData);
      } else {
        await axios.post('/api/admin/services', formData);
      }
      fetchServices();
      setShowForm(false);
      setEditingService(null);
      setFormData({ icon: '', title: '', desc: '', order: 0 });
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`/api/admin/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon,
      title: service.title,
      desc: service.desc,
      order: service.order
    });
    setShowForm(true);
  };

  const emojiList = ['⚡', '📱', '🎨', '🛒', '🔧', '🚀', '🔒', '☁️', '🤖', '🗄️', '📊', '💻', '📈', '🎯', '💡'];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <h3 style={{ color: C.text, fontSize: 18 }}>Manage Services</h3>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({ icon: '', title: '', desc: '', order: 0 });
            setShowForm(true);
          }}
          style={{
            background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            color: '#07071a',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 15
      }}>
        {services.map(service => (
          <div
            key={service._id}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 20
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{service.icon}</div>
            <h4 style={{ color: C.text, fontSize: 16, marginBottom: 5 }}>{service.title}</h4>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 15, lineHeight: 1.5 }}>
              {service.desc}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleEdit(service)}
                style={{
                  background: 'none',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  color: '#00e5ff',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                style={{
                  background: 'none',
                  border: `1px solid #ff6b6b44`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  color: '#ff6b6b',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowForm(false)}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)'
          }} />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#0d0d28' : '#f8f8ff',
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 30,
              maxWidth: 500,
              width: '90%',
              position: 'relative'
            }}
          >
            <h3 style={{ color: C.text, marginBottom: 20 }}>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Select Icon
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 8,
                  marginBottom: 10
                }}>
                  {emojiList.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      style={{
                        background: formData.icon === emoji ? '#00e5ff' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${formData.icon === emoji ? '#00e5ff' : C.border}`,
                        borderRadius: 8,
                        padding: '8px',
                        fontSize: 20,
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: C.text,
                    fontSize: 13
                  }}
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Description
                </label>
                <textarea
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: C.text,
                    fontSize: 13,
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Order (lower numbers appear first)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="0"
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: C.text,
                    fontSize: 13
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 20px',
                    color: C.muted,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                    color: '#07071a',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}