import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageCareers({ dark, C }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ status: '', notes: '' });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0
  });

  const adminKey = 'coding-world-admin-2025';

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [statusFilter, page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? `/api/careers/applications?page=${page}`
        : `/api/careers/applications?status=${statusFilter}&page=${page}`;
      
      const response = await axios.get(url, {
        headers: { 'admin-key': adminKey }
      });
      setApplications(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/careers/stats', {
        headers: { 'admin-key': adminKey }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, status, notes = '') => {
    try {
      const response = await axios.patch(`/api/careers/applications/${id}`, {
        status,
        notes
      }, {
        headers: { 'admin-key': adminKey }
      });
      
      if (response.data.success) {
        // Show success message
        alert(`✅ Application ${status} successfully! Email notification sent.`);
        fetchApplications();
        fetchStats();
        setShowEmailModal(false);
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleStatusChange = (app, newStatus) => {
    setSelectedApp(app);
    setEmailData({ status: newStatus, notes: '' });
    setShowEmailModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9d00';
      case 'reviewed': return '#00e5ff';
      case 'shortlisted': return '#00ffb3';
      case 'rejected': return '#ff6b6b';
      default: return C.muted;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#ff9d0020', text: '#ff9d00', border: '#ff9d0044' },
      reviewed: { bg: '#00e5ff20', text: '#00e5ff', border: '#00e5ff44' },
      shortlisted: { bg: '#00ffb320', text: '#00ffb3', border: '#00ffb344' },
      rejected: { bg: '#ff6b6b20', text: '#ff6b6b', border: '#ff6b6b44' }
    };
    const color = colors[status] || colors.pending;
    
    return (
      <span style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
        borderRadius: 12,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 15,
        marginBottom: 25
      }}>
        <StatCard
          title="Total"
          value={stats.total}
          color="#00e5ff"
          dark={dark}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="#ff9d00"
          dark={dark}
        />
        <StatCard
          title="Reviewed"
          value={stats.reviewed}
          color="#00e5ff"
          dark={dark}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          color="#00ffb3"
          dark={dark}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          color="#ff6b6b"
          dark={dark}
        />
      </div>

      {/* Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 15
      }}>
        <h3 style={{ color: C.text, fontSize: 18 }}>Career Applications</h3>
        <div style={{ display: 'flex', gap: 10 }}>
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
              fontSize: 13
            }}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="spinner" style={{
            width: 40,
            height: 40,
            border: '3px solid #00e5ff20',
            borderTopColor: '#00e5ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }} />
          <div style={{ fontSize: 14, color: C.muted }}>Loading applications...</div>
        </div>
      ) : applications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
          <h4 style={{ color: C.text, marginBottom: 10 }}>No Applications Found</h4>
          <p style={{ color: C.muted, fontSize: 13 }}>No career applications matching the selected criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Name</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Position</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Contact</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Experience</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Date</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontWeight: 600, color: C.text }}>{app.name}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{
                      background: '#00e5ff20',
                      border: '1px solid #00e5ff44',
                      color: '#00e5ff',
                      borderRadius: 4,
                      padding: '2px 6px',
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      {app.position}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ color: C.text, fontSize: 13 }}>{app.email}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{app.phone}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ color: C.text, fontSize: 13 }}>{app.experience}</span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {getStatusBadge(app.status)}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowDetailsModal(true);
                        }}
                        style={{
                          background: '#00e5ff20',
                          border: '1px solid #00e5ff44',
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: 11,
                          color: '#00e5ff',
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app, 'reviewed')}
                            style={{
                              background: '#00e5ff20',
                              border: '1px solid #00e5ff44',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 11,
                              color: '#00e5ff',
                              cursor: 'pointer'
                            }}
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleStatusChange(app, 'shortlisted')}
                            style={{
                              background: '#00ffb320',
                              border: '1px solid #00ffb344',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 11,
                              color: '#00ffb3',
                              cursor: 'pointer'
                            }}
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusChange(app, 'rejected')}
                            style={{
                              background: '#ff6b6b20',
                              border: '1px solid #ff6b6b44',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 11,
                              color: '#ff6b6b',
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'reviewed' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app, 'shortlisted')}
                            style={{
                              background: '#00ffb320',
                              border: '1px solid #00ffb344',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 11,
                              color: '#00ffb3',
                              cursor: 'pointer'
                            }}
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusChange(app, 'rejected')}
                            style={{
                              background: '#ff6b6b20',
                              border: '1px solid #ff6b6b44',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 11,
                              color: '#ff6b6b',
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
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
              padding: '8px 16px',
              color: page === 1 ? C.muted : '#07071a',
              cursor: page === 1 ? 'default' : 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ color: C.muted, fontSize: 13, padding: '8px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              background: page === totalPages ? 'transparent' : 'linear-gradient(135deg,#00e5ff,#0095ff)',
              border: `1px solid ${page === totalPages ? C.border : 'transparent'}`,
              borderRadius: 6,
              padding: '8px 16px',
              color: page === totalPages ? C.muted : '#07071a',
              cursor: page === totalPages ? 'default' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedApp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowEmailModal(false)}>
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
            <h3 style={{ color: C.text, fontSize: 20, marginBottom: 15 }}>
              {emailData.status === 'shortlisted' ? '🎉 Shortlist Candidate' : 
               emailData.status === 'rejected' ? '❌ Reject Application' : 
               '📝 Update Status'}
            </h3>
            
            <div style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 10,
              padding: 15,
              marginBottom: 20
            }}>
              <p style={{ color: C.text, marginBottom: 5 }}>
                <strong>Name:</strong> {selectedApp.name}
              </p>
              <p style={{ color: C.text, marginBottom: 5 }}>
                <strong>Position:</strong> {selectedApp.position}
              </p>
              <p style={{ color: C.muted, fontSize: 13 }}>
                An email notification will be sent to: <strong style={{ color: '#00e5ff' }}>{selectedApp.email}</strong>
              </p>
            </div>

            <textarea
              value={emailData.notes}
              onChange={e => setEmailData({ ...emailData, notes: e.target.value })}
              placeholder="Add optional notes or feedback..."
              rows={4}
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px',
                color: C.text,
                fontSize: 13,
                marginBottom: 20,
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEmailModal(false)}
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
                onClick={() => updateStatus(selectedApp._id, emailData.status, emailData.notes)}
                style={{
                  background: emailData.status === 'shortlisted' ? 'linear-gradient(135deg,#00ffb3,#00e5ff)' :
                             emailData.status === 'rejected' ? 'linear-gradient(135deg,#ff6b6b,#ff4444)' :
                             'linear-gradient(135deg,#00e5ff,#0095ff)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  color: emailData.status === 'rejected' ? '#fff' : '#07071a',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApp && (
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
              maxWidth: 500,
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <h3 style={{ color: C.text, fontSize: 20, marginBottom: 20 }}>
              Application Details
            </h3>

            <div style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20
            }}>
              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Name</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{selectedApp.name}</div>
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Position Applied</div>
                <span style={{
                  background: '#00e5ff20',
                  border: '1px solid #00e5ff44',
                  color: '#00e5ff',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {selectedApp.position}
                </span>
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Contact Information</div>
                <div style={{ color: C.text, fontSize: 14 }}>{selectedApp.email}</div>
                <div style={{ color: C.text, fontSize: 14 }}>{selectedApp.phone}</div>
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Experience</div>
                <div style={{ color: C.text, fontSize: 14 }}>{selectedApp.experience}</div>
              </div>

              {selectedApp.portfolio && (
                <div style={{ marginBottom: 15 }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Portfolio</div>
                  <a
                    href={selectedApp.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#00e5ff', fontSize: 14 }}
                  >
                    {selectedApp.portfolio}
                  </a>
                </div>
              )}

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Message</div>
                <div style={{
                  background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 8,
                  padding: 12,
                  color: C.text,
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontStyle: 'italic'
                }}>
                  "{selectedApp.message}"
                </div>
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Applied On</div>
                <div style={{ color: C.text, fontSize: 14 }}>
                  {new Date(selectedApp.appliedAt).toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Current Status</div>
                {getStatusBadge(selectedApp.status)}
              </div>

              {selectedApp.notes && (
                <div style={{ marginTop: 15 }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Admin Notes</div>
                  <div style={{
                    background: '#ff9d0010',
                    border: '1px solid #ff9d0044',
                    borderRadius: 8,
                    padding: 10,
                    color: '#ff9d00',
                    fontSize: 13
                  }}>
                    {selectedApp.notes}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '10px 20px',
                  color: C.muted,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              {selectedApp.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleStatusChange(selectedApp, 'shortlisted');
                    }}
                    style={{
                      background: 'linear-gradient(135deg,#00ffb3,#00e5ff)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      color: '#07071a',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleStatusChange(selectedApp, 'rejected');
                    }}
                    style={{
                      background: 'linear-gradient(135deg,#ff6b6b,#ff4444)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color, dark }) {
  return (
    <div style={{
      background: dark ? 'rgba(255,255,255,0.05)' : '#fff',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`,
      borderRadius: 12,
      padding: '15px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: dark ? '#aaa' : '#666' }}>{title}</div>
    </div>
  );
}