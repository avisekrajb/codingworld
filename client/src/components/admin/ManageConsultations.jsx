import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageConsultations({ dark, C }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0
  });

  const adminKey = localStorage.getItem('adminKey') || 'coding-world-admin-2025';

  const api = axios.create({
    baseURL: '/api',
    headers: {
      'admin-key': adminKey
    }
  });

  useEffect(() => {
    fetchConsultations();
    fetchStats();
  }, [statusFilter, page, searchTerm]);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      let url = `/admin/consultations?page=${page}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      
      const response = await api.get(url);
      setConsultations(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/consultations/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, status, scheduledDate = null, notes = '') => {
    try {
      await api.patch(`/admin/consultations/${id}`, {
        status,
        scheduledDate,
        notes
      });
      fetchConsultations();
      fetchStats();
      setShowDetailsModal(false);
      setSelectedConsultation(null);
    } catch (error) {
      console.error('Error updating consultation:', error);
    }
  };

  const deleteConsultation = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await api.delete(`/admin/consultations/${id}`);
        fetchConsultations();
        fetchStats();
      } catch (error) {
        console.error('Error deleting consultation:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9d00';
      case 'contacted': return '#00e5ff';
      case 'scheduled': return '#00ffb3';
      case 'completed': return '#25d366';
      case 'cancelled': return '#ff6b6b';
      default: return C.muted;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#ff9d0020', text: '#ff9d00', border: '#ff9d0044' },
      contacted: { bg: '#00e5ff20', text: '#00e5ff', border: '#00e5ff44' },
      scheduled: { bg: '#00ffb320', text: '#00ffb3', border: '#00ffb344' },
      completed: { bg: '#25d36620', text: '#25d366', border: '#25d36644' },
      cancelled: { bg: '#ff6b6b20', text: '#ff6b6b', border: '#ff6b6b44' }
    };
    const color = colors[status] || colors.pending;
    
    return (
      <span style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
        borderRadius: 12,
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    );
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'free': return '#00e5ff';
      case 'upgrade': return '#bf5fff';
      case 'premium': return '#00ffb3';
      default: return C.muted;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 15,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 24, marginBottom: 5, color }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{value}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{title}</div>
    </div>
  );

  return (
    <div>
      {/* Header with Stats */}
      <div style={{ marginBottom: 25 }}>
        <h3 style={{ color: C.text, fontSize: 18, marginBottom: 15 }}>Consultation Requests</h3>
        
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 10,
          marginBottom: 20
        }}>
          <StatCard title="Total" value={stats.total} color="#00e5ff" icon="📊" />
          <StatCard title="Pending" value={stats.pending} color="#ff9d00" icon="⏳" />
          <StatCard title="Contacted" value={stats.contacted} color="#00e5ff" icon="📞" />
          <StatCard title="Scheduled" value={stats.scheduled} color="#00ffb3" icon="📅" />
          <StatCard title="Completed" value={stats.completed} color="#25d366" icon="✅" />
          <StatCard title="Cancelled" value={stats.cancelled} color="#ff6b6b" icon="❌" />
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.text,
              fontSize: 13,
              minWidth: 140
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{
              flex: 1,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.text,
              fontSize: 13,
              minWidth: 200
            }}
          />

          <button
            onClick={fetchConsultations}
            style={{
              background: 'none',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.muted,
              cursor: 'pointer'
            }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Consultations Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #00e5ff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }} />
          <p style={{ color: C.muted }}>Loading consultations...</p>
        </div>
      ) : consultations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
          <h4 style={{ color: C.text, marginBottom: 10 }}>No Consultations Found</h4>
          <p style={{ color: C.muted, fontSize: 13 }}>No consultation requests match your criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Name</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Contact</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Plan</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Project</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Date</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map(consult => (
                <tr key={consult._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontWeight: 600, color: C.text }}>{consult.name}</div>
                    {consult.company && (
                      <div style={{ fontSize: 11, color: C.muted }}>{consult.company}</div>
                    )}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ color: C.text, fontSize: 13 }}>{consult.email}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{consult.phone}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{
                      background: `${getPlanColor(consult.plan)}20`,
                      border: `1px solid ${getPlanColor(consult.plan)}44`,
                      color: getPlanColor(consult.plan),
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {consult.plan}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {consult.projectType && (
                      <div style={{ fontSize: 12, color: C.text, marginBottom: 2 }}>
                        {consult.projectType}
                      </div>
                    )}
                    {consult.budget && (
                      <div style={{ fontSize: 11, color: C.muted }}>💰 {consult.budget}</div>
                    )}
                    {consult.timeline && (
                      <div style={{ fontSize: 11, color: C.muted }}>⏱ {consult.timeline}</div>
                    )}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontSize: 12, color: C.text }}>
                      {new Date(consult.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                      {new Date(consult.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {getStatusBadge(consult.status)}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        onClick={() => {
                          setSelectedConsultation(consult);
                          setShowDetailsModal(true);
                        }}
                        style={{
                          background: 'none',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: 11,
                          color: '#00e5ff',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Details
                      </button>
                      <button
                        onClick={() => deleteConsultation(consult._id)}
                        style={{
                          background: 'none',
                          border: `1px solid #ff6b6b44`,
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: 11,
                          color: '#ff6b6b',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginTop: 20
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: page === 1 ? 'transparent' : 'linear-gradient(135deg,#00e5ff,#0095ff)',
              border: `1px solid ${page === 1 ? C.border : 'transparent'}`,
              borderRadius: 6,
              padding: '6px 12px',
              color: page === 1 ? C.muted : '#07071a',
              cursor: page === 1 ? 'default' : 'pointer',
              opacity: page === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          <span style={{ color: C.muted, fontSize: 13, padding: '6px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              background: page === totalPages ? 'transparent' : 'linear-gradient(135deg,#00e5ff,#0095ff)',
              border: `1px solid ${page === totalPages ? C.border : 'transparent'}`,
              borderRadius: 6,
              padding: '6px 12px',
              color: page === totalPages ? C.muted : '#07071a',
              cursor: page === totalPages ? 'default' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedConsultation && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowDetailsModal(false)}>
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
              maxWidth: 600,
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <h3 style={{ color: C.text, fontSize: 20, marginBottom: 20 }}>
              Consultation Details
            </h3>

            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 15
              }}>
                <DetailItem label="Name" value={selectedConsultation.name} color={C} />
                <DetailItem label="Email" value={selectedConsultation.email} color={C} />
                <DetailItem label="Phone" value={selectedConsultation.phone} color={C} />
                <DetailItem label="Company" value={selectedConsultation.company || 'Not provided'} color={C} />
                <DetailItem label="Plan" value={selectedConsultation.plan} color={C} />
                <DetailItem label="Status" value={selectedConsultation.status} color={C} />
                <DetailItem label="Project Type" value={selectedConsultation.projectType || 'Not provided'} color={C} />
                <DetailItem label="Budget" value={selectedConsultation.budget || 'Not provided'} color={C} />
                <DetailItem label="Timeline" value={selectedConsultation.timeline || 'Not provided'} color={C} />
                <DetailItem label="Submitted" value={formatDate(selectedConsultation.createdAt)} color={C} />
              </div>

              {selectedConsultation.message && (
                <div style={{
                  marginTop: 20,
                  padding: 15,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 10
                }}>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 8 }}>Message:</div>
                  <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
                    "{selectedConsultation.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Status Update */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: C.text, fontSize: 16, marginBottom: 10 }}>Update Status</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['pending', 'contacted', 'scheduled', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedConsultation._id, status)}
                    style={{
                      background: selectedConsultation.status === status 
                        ? getStatusColor(status)
                        : 'transparent',
                      border: `1px solid ${getStatusColor(status)}44`,
                      borderRadius: 20,
                      padding: '5px 12px',
                      fontSize: 11,
                      color: selectedConsultation.status === status ? '#07071a' : getStatusColor(status),
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Date (if scheduled) */}
            {selectedConsultation.status === 'scheduled' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 5 }}>
                  Scheduled Date
                </label>
                <input
                  type="datetime-local"
                  value={selectedConsultation.scheduledDate || ''}
                  onChange={(e) => {
                    const updated = { ...selectedConsultation, scheduledDate: e.target.value };
                    setSelectedConsultation(updated);
                  }}
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: C.text
                  }}
                />
              </div>
            )}

            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 5 }}>
                Notes
              </label>
              <textarea
                value={selectedConsultation.notes || ''}
                onChange={(e) => {
                  const updated = { ...selectedConsultation, notes: e.target.value };
                  setSelectedConsultation(updated);
                }}
                rows={3}
                placeholder="Add private notes about this consultation..."
                style={{
                  width: '100%',
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: C.text,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: C.muted,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(
                  selectedConsultation._id,
                  selectedConsultation.status,
                  selectedConsultation.scheduledDate,
                  selectedConsultation.notes
                )}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function DetailItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: color.muted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: color.text }}>{value}</div>
    </div>
  );
}