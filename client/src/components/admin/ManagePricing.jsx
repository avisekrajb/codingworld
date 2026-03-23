import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManagePricing({ dark, C }) {
  const [pricing, setPricing] = useState({
    free: { 
      price: '₹0', 
      features: [], 
      isPopular: false,
      description: 'No commitment needed',
      history: []
    },
    upgrade: { 
      price: '₹500', 
      features: [], 
      isPopular: true,
      description: 'One-time project fee',
      badge: 'POPULAR',
      history: []
    },
    premium: { 
      price: 'Custom', 
      features: [], 
      isPopular: false,
      description: 'Enterprise-grade, fully custom',
      history: []
    }
  });
  
  const [editingPlan, setEditingPlan] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Get admin key from localStorage
  const adminKey = localStorage.getItem('adminKey') || 'coding-world-admin-2025';

  // Default features
  const defaultFeatures = {
    free: [
      { icon: "🎯", label: "Demo", desc: "Live demo of your project concept" },
      { icon: "💡", label: "Understand", desc: "Deep requirement analysis session" },
      { icon: "🤝", label: "Meetup", desc: "1-on-1 consultation call" },
      { icon: "📄", label: "Paper", desc: "Project scope document" },
      { icon: "📋", label: "Documents", desc: "Technical specification sheets" },
      { icon: "🔒", label: "Baina", desc: "Initial agreement & commitment" }
    ],
    upgrade: [
      { icon: "⚡", label: "Priority Support", desc: "24/7 dedicated support channel" },
      { icon: "🎨", label: "Custom Design", desc: "Unique UI tailored to your brand" },
      { icon: "🔄", label: "Unlimited Revisions", desc: "Until you're 100% satisfied" },
      { icon: "📊", label: "Analytics Setup", desc: "Full tracking & reporting dashboard" },
      { icon: "🚀", label: "Deployment", desc: "Full server setup & go-live" },
      { icon: "📱", label: "Mobile Optimized", desc: "Perfect on every device" }
    ],
    premium: [
      { icon: "👑", label: "Dedicated Manager", desc: "Personal project manager assigned" },
      { icon: "🔐", label: "SSL & Security", desc: "Enterprise-grade security setup" },
      { icon: "💾", label: "Database Design", desc: "Optimized schema architecture" },
      { icon: "🌐", label: "Domain & Hosting", desc: "1-year hosting included" },
      { icon: "📧", label: "Email Setup", desc: "Business email configuration" },
      { icon: "🤖", label: "AI Integration", desc: "Smart AI features in your app" }
    ]
  };

  // Configure axios with default headers
  const api = axios.create({
    baseURL: '/api',
    headers: {
      'admin-key': adminKey
    }
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchPricing = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      console.log('Fetching pricing data with admin key:', adminKey);
      const response = await api.get('/admin/pricing');
      console.log('Pricing response:', response.data);
      
      if (response.data.success && response.data.data.length > 0) {
        const pricingData = {};
        response.data.data.forEach(p => {
          pricingData[p.plan] = {
            ...p,
            features: p.features || defaultFeatures[p.plan] || [],
            history: p.history || []
          };
        });
        setPricing(prev => ({ ...prev, ...pricingData }));
      } else {
        // Initialize with default features if no data
        const initialData = {
          free: { ...pricing.free, features: defaultFeatures.free },
          upgrade: { ...pricing.upgrade, features: defaultFeatures.upgrade },
          premium: { ...pricing.premium, features: defaultFeatures.premium }
        };
        setPricing(initialData);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrorMessage(`Failed to fetch pricing: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setErrorMessage('No response from server. Please check your connection.');
      } else {
        setErrorMessage('Error fetching pricing data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingHistory = async (plan) => {
    try {
      const response = await api.get(`/admin/pricing/${plan}/history`);
      if (response.data.success) {
        setPricing(prev => ({
          ...prev,
          [plan]: {
            ...prev[plan],
            history: response.data.data
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleUpdate = async (plan, data) => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Add admin name to update data
      const updateData = {
        ...data,
        admin: localStorage.getItem('adminName') || 'Admin'
      };

      console.log(`Updating ${plan} plan:`, updateData);
      
      const response = await api.put(`/admin/pricing/${plan}`, updateData);
      
      if (response.data.success) {
        setPricing(prev => ({
          ...prev,
          [plan]: response.data.data
        }));
        
        setSuccessMessage(`${plan} plan updated successfully!`);
        setEditingPlan(null);
        
        // Refresh history
        await fetchPricingHistory(plan);
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
      if (error.response) {
        setErrorMessage(`Failed to update: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setErrorMessage('No response from server. Please check your connection.');
      } else {
        setErrorMessage('Failed to update pricing');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = (plan) => {
    const newFeature = {
      icon: "✓",
      label: "New Feature",
      desc: "Description of the feature"
    };
    
    setPricing(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        features: [...(prev[plan].features || []), newFeature]
      }
    }));
  };

  const handleRemoveFeature = (plan, index) => {
    setPricing(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        features: prev[plan].features.filter((_, i) => i !== index)
      }
    }));
  };

  const handleFeatureChange = (plan, index, field, value) => {
    const updatedFeatures = [...(pricing[plan].features || [])];
    if (!updatedFeatures[index]) {
      updatedFeatures[index] = { icon: '✓', label: '', desc: '' };
    }
    updatedFeatures[index][field] = value;
    
    setPricing(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        features: updatedFeatures
      }
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const emojiList = ['✓', '⚡', '🎨', '🔄', '📊', '🚀', '📱', '👑', '🔐', '💾', '🌐', '📧', '🤖', '📲', '🛡️', '🎬', '🌍', '📦', '🔔', '📈', '☁️', '🔗', '🎁', '🧩', '📡', '🏷️', '🎯', '💡', '🤝', '📄', '📋', '🔒', '💰', '⭐', '✨', '🔥'];

  // Show loading state
  if (loading && !editingPlan) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{
          width: 50,
          height: 50,
          border: '3px solid #00e5ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{ color: C.muted }}>Loading pricing data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 15
      }}>
        <div>
          <h3 style={{ color: C.text, fontSize: 18, marginBottom: 5 }}>Manage Pricing Plans</h3>
          <p style={{ color: C.muted, fontSize: 13 }}>Edit pricing, features, and view change history</p>
        </div>
        
        <button
          onClick={fetchPricing}
          disabled={loading}
          style={{
            background: 'none',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '8px 16px',
            color: C.text,
            cursor: loading ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>↻</span>
          Refresh
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div style={{
          background: '#00ffb320',
          border: '1px solid #00ffb344',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          color: '#00ffb3',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span>✅</span>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: '#ff6b6b20',
          border: '1px solid #ff6b6b44',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          color: '#ff6b6b',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span>❌</span>
          {errorMessage}
          <button
            onClick={fetchPricing}
            style={{
              marginLeft: 'auto',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: 4,
              padding: '4px 10px',
              color: '#fff',
              fontSize: 11,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Pricing Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {['free', 'upgrade', 'premium'].map(plan => (
          <div
            key={plan}
            style={{
              background: C.card,
              border: `1px solid ${plan === 'upgrade' ? '#00e5ff44' : C.border}`,
              borderRadius: 16,
              overflow: 'hidden'
            }}
          >
            {/* Plan Header */}
            <div style={{
              padding: '20px 24px',
              background: `linear-gradient(135deg, ${
                plan === 'free' ? '#00e5ff' :
                plan === 'upgrade' ? '#bf5fff' : '#00ffb3'
              }15, transparent)`,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 15
            }}>
              <div>
                <h4 style={{
                  color: C.text,
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  marginBottom: 5
                }}>
                  {plan} Plan
                  {pricing[plan]?.isPopular && (
                    <span style={{
                      background: '#00e5ff',
                      color: '#07071a',
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 12,
                      marginLeft: 10,
                      fontWeight: 600
                    }}>
                      POPULAR
                    </span>
                  )}
                </h4>
                <p style={{ color: C.muted, fontSize: 13 }}>
                  Price: {pricing[plan]?.price || 'N/A'} | 
                  Features: {pricing[plan]?.features?.length || 0} | 
                  Last updated: {pricing[plan]?.history?.[0]?.timestamp 
                    ? formatDate(pricing[plan].history[0].timestamp)
                    : 'Never'}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    setShowHistory(showHistory === plan ? null : plan);
                    if (showHistory !== plan) {
                      fetchPricingHistory(plan);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '6px 12px',
                    color: C.text,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  📋 History ({pricing[plan]?.history?.length || 0})
                </button>
                
                {editingPlan === plan ? (
                  <>
                    <button
                      onClick={() => handleUpdate(plan, pricing[plan])}
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 16px',
                        color: '#07071a',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: loading ? 'default' : 'pointer',
                        opacity: loading ? 0.5 : 1
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditingPlan(null)}
                      style={{
                        background: 'none',
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: '6px 12px',
                        color: C.muted,
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingPlan(plan)}
                    style={{
                      background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 16px',
                      color: '#07071a',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Edit Plan
                  </button>
                )}
              </div>
            </div>

            {/* Plan Content */}
            <div style={{ padding: '24px' }}>
              {/* Basic Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 20,
                marginBottom: 24
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Price
                  </label>
                  <input
                    type="text"
                    value={pricing[plan]?.price || ''}
                    onChange={e => setPricing(prev => ({
                      ...prev,
                      [plan]: { ...prev[plan], price: e.target.value }
                    }))}
                    disabled={editingPlan !== plan}
                    style={{
                      width: '100%',
                      background: editingPlan !== plan 
                        ? 'transparent' 
                        : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                      border: editingPlan !== plan ? 'none' : `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: C.text,
                      fontSize: 14,
                      fontWeight: editingPlan !== plan ? 600 : 400
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={pricing[plan]?.description || ''}
                    onChange={e => setPricing(prev => ({
                      ...prev,
                      [plan]: { ...prev[plan], description: e.target.value }
                    }))}
                    disabled={editingPlan !== plan}
                    style={{
                      width: '100%',
                      background: editingPlan !== plan 
                        ? 'transparent' 
                        : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                      border: editingPlan !== plan ? 'none' : `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: C.text,
                      fontSize: 14
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    cursor: editingPlan === plan ? 'pointer' : 'default'
                  }}>
                    <input
                      type="checkbox"
                      checked={pricing[plan]?.isPopular || false}
                      onChange={e => setPricing(prev => ({
                        ...prev,
                        [plan]: { ...prev[plan], isPopular: e.target.checked }
                      }))}
                      disabled={editingPlan !== plan}
                    />
                    Mark as Popular
                  </label>
                </div>

                {plan !== 'free' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.muted,
                      marginBottom: 6
                    }}>
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={pricing[plan]?.badge || ''}
                      onChange={e => setPricing(prev => ({
                        ...prev,
                        [plan]: { ...prev[plan], badge: e.target.value }
                      }))}
                      disabled={editingPlan !== plan}
                      placeholder="e.g., POPULAR, BEST VALUE"
                      style={{
                        width: '100%',
                        background: editingPlan !== plan 
                          ? 'transparent' 
                          : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                        border: editingPlan !== plan ? 'none' : `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: '8px 12px',
                        color: C.text,
                        fontSize: 14
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 15
                }}>
                  <h5 style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>Features</h5>
                  {editingPlan === plan && (
                    <button
                      onClick={() => handleAddFeature(plan)}
                      style={{
                        background: 'none',
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 11,
                        color: '#00e5ff',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Feature
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(pricing[plan]?.features || []).map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: 12
                      }}
                    >
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: editingPlan === plan 
                          ? '80px 1fr 1fr 30px'
                          : '30px 1fr 1fr',
                        gap: 10,
                        alignItems: 'center'
                      }}>
                        {editingPlan === plan ? (
                          <>
                            <select
                              value={feature.icon || '✓'}
                              onChange={e => handleFeatureChange(plan, index, 'icon', e.target.value)}
                              style={{
                                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                border: `1px solid ${C.border}`,
                                borderRadius: 6,
                                padding: '6px',
                                color: C.text,
                                fontSize: 14
                              }}
                            >
                              {emojiList.map(emoji => (
                                <option key={emoji} value={emoji}>{emoji}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={feature.label || ''}
                              onChange={e => handleFeatureChange(plan, index, 'label', e.target.value)}
                              placeholder="Label"
                              style={{
                                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                border: `1px solid ${C.border}`,
                                borderRadius: 6,
                                padding: '6px 8px',
                                color: C.text,
                                fontSize: 13
                              }}
                            />
                            <input
                              type="text"
                              value={feature.desc || ''}
                              onChange={e => handleFeatureChange(plan, index, 'desc', e.target.value)}
                              placeholder="Description"
                              style={{
                                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                border: `1px solid ${C.border}`,
                                borderRadius: 6,
                                padding: '6px 8px',
                                color: C.text,
                                fontSize: 13
                              }}
                            />
                            <button
                              onClick={() => handleRemoveFeature(plan, index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ff6b6b',
                                fontSize: 16,
                                cursor: 'pointer'
                              }}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: 18, textAlign: 'center' }}>{feature.icon || '✓'}</span>
                            <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{feature.label || 'Feature'}</span>
                            <span style={{ color: C.muted, fontSize: 12 }}>{feature.desc || 'Description'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* History Section */}
            {showHistory === plan && (
              <div style={{
                borderTop: `1px solid ${C.border}`,
                padding: '20px 24px',
                background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
              }}>
                <h5 style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 15 }}>
                  Edit History
                </h5>
                
                {!pricing[plan]?.history?.length ? (
                  <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: 20 }}>
                    No edit history available
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pricing[plan].history.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          background: C.card,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          padding: 12
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                          flexWrap: 'wrap',
                          gap: 10
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              background: entry.action === 'RESTORE' ? '#ff9d0020' : '#00e5ff20',
                              color: entry.action === 'RESTORE' ? '#ff9d00' : '#00e5ff',
                              padding: '2px 8px',
                              borderRadius: 12,
                              fontSize: 10,
                              fontWeight: 600
                            }}>
                              {entry.action}
                            </span>
                            <span style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>
                              {entry.admin || 'Admin'}
                            </span>
                          </div>
                          <span style={{ color: C.muted, fontSize: 11 }}>
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        
                        <div style={{
                          background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 12,
                          color: C.muted,
                          fontFamily: 'monospace'
                        }}>
                          Price: {entry.changes?.price || entry.previousState?.price || 'N/A'} 
                          {entry.changes?.price && entry.previousState?.price && 
                            entry.changes.price !== entry.previousState.price && 
                            ` → ${entry.changes.price}`}
                          <br />
                          Features: {entry.changes?.features?.length || entry.previousState?.features?.length || 0} items
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}