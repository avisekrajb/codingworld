import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InternshipApplications({ dark, C }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ status: '', notes: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Admin key from localStorage or environment
  const adminKey = 'coding-world-admin-2025';

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, page, sortBy]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? `/api/admin/internships?page=${page}&sort=${sortBy}`
        : `/api/admin/internships?status=${statusFilter}&page=${page}&sort=${sortBy}`;
      
      const response = await axios.get(url, {
        headers: {
          'admin-key': adminKey
        }
      });
      setApplications(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, notes = '') => {
    try {
      await axios.patch(`/api/admin/internships/${id}`, {
        status,
        notes,
        sendEmail: true
      }, {
        headers: {
          'admin-key': adminKey
        }
      });
      fetchApplications();
      setShowEmailModal(false);
      setSelectedApp(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStatusChange = (app, newStatus) => {
    setSelectedApp(app);
    setEmailData({ status: newStatus, notes: '' });
    setShowEmailModal(true);
  };

  // Updated viewCV function to use authenticated endpoint
  const viewCV = async (cvPath) => {
    try {
      // Extract filename from path
      const filename = cvPath.split('\\').pop().split('/').pop();
      
      // Use authenticated endpoint
      const response = await axios.get(`/api/admin/cv/${filename}`, {
        headers: {
          'admin-key': adminKey
        },
        responseType: 'blob'
      });

      // Create blob URL and open in new tab
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error viewing CV:', error);
      alert('Failed to open CV. Please try downloading instead.');
    }
  };

  const downloadCV = async (cvPath, fileName) => {
    try {
      // Extract filename from path
      const filename = cvPath.split('\\').pop().split('/').pop();
      
      const response = await axios.get(`/api/admin/cv/${filename}`, {
        responseType: 'blob',
        headers: {
          'admin-key': adminKey
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `CV_${filename}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9d00';
      case 'reviewed': return '#00e5ff';
      case 'accepted': return '#00ffb3';
      case 'rejected': return '#ff6b6b';
      default: return C.muted;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#ff9d0020', text: '#ff9d00', border: '#ff9d0044' },
      reviewed: { bg: '#00e5ff20', text: '#00e5ff', border: '#00e5ff44' },
      accepted: { bg: '#00ffb320', text: '#00ffb3', border: '#00ffb344' },
      rejected: { bg: '#ff6b6b20', text: '#ff6b6b', border: '#ff6b6b44' }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      app.name?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.phone?.toLowerCase().includes(term) ||
      app.tracks?.some(track => track.toLowerCase().includes(term))
    );
  });

  // Rest of the component remains the same...
  return (
    <div>
      {/* Header with Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 15
      }}>
        <h3 style={{ color: C.text, fontSize: 18 }}>Internship Applications</h3>
        
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.text,
              fontSize: 13,
              minWidth: 200
            }}
          />

          {/* Status Filter */}
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
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.text,
              fontSize: 13
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 10,
        marginBottom: 20
      }}>
        <StatCard
          label="Total"
          value={applications.length}
          color="#00e5ff"
          dark={dark}
          C={C}
        />
        <StatCard
          label="Pending"
          value={applications.filter(a => a.status === 'pending').length}
          color="#ff9d00"
          dark={dark}
          C={C}
        />
        <StatCard
          label="Accepted"
          value={applications.filter(a => a.status === 'accepted').length}
          color="#00ffb3"
          dark={dark}
          C={C}
        />
        <StatCard
          label="Rejected"
          value={applications.filter(a => a.status === 'rejected').length}
          color="#ff6b6b"
          dark={dark}
          C={C}
        />
      </div>

      {/* Applications Table */}
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
          <div style={{ fontSize: 14, color: C.muted }}>Loading applications...</div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
          <h4 style={{ color: C.text, marginBottom: 10 }}>No Applications Found</h4>
          <p style={{ color: C.muted, fontSize: 13 }}>
            {searchTerm ? 'No applications match your search criteria.' : 'No applications have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Name</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Contact</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Tracks</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Duration</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Applied</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>CV</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{app.name}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontSize: 12, color: C.text }}>{app.email}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{app.phone}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {app.tracks?.map(t => (
                        <span key={t} style={{
                          background: '#00e5ff20',
                          border: '1px solid #00e5ff44',
                          color: '#00e5ff',
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontSize: 10,
                          fontWeight: 600
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px', color: C.text, fontSize: 13 }}>{app.duration}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ color: C.muted, fontSize: 11 }}>
                      {formatDate(app.appliedAt || app.createdAt)}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {getStatusBadge(app.status)}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {app.cvPath ? (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button
                          onClick={() => viewCV(app.cvPath)}
                          style={{
                            background: 'none',
                            border: `1px solid #00e5ff44`,
                            borderRadius: 4,
                            padding: '4px 8px',
                            fontSize: 11,
                            color: '#00e5ff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3
                          }}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => downloadCV(app.cvPath, `${app.name}_CV.pdf`)}
                          style={{
                            background: 'none',
                            border: `1px solid ${C.border}`,
                            borderRadius: 4,
                            padding: '4px 8px',
                            fontSize: 11,
                            color: C.muted,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3
                          }}
                        >
                          📥 Download
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: C.muted, fontSize: 11 }}>No CV</span>
                    )}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app, 'accepted')}
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
                            ✓ Accept
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
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {app.status === 'reviewed' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app, 'accepted')}
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
                            Accept
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
                      {(app.status === 'accepted' || app.status === 'rejected') && (
                        <button
                          onClick={() => handleStatusChange(app, 'pending')}
                          style={{
                            background: '#ff9d0020',
                            border: '1px solid #ff9d0044',
                            borderRadius: 4,
                            padding: '4px 8px',
                            fontSize: 11,
                            color: '#ff9d00',
                            cursor: 'pointer'
                          }}
                        >
                          Reset
                        </button>
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
          marginTop: 20,
          alignItems: 'center'
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
          
          <span style={{ color: C.muted, fontSize: 13 }}>
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
            <h3 style={{ color: C.text, marginBottom: 20 }}>
              {emailData.status === 'accepted' ? 'Accept Application' : 'Reject Application'}
            </h3>
            
            <div style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 10,
              padding: 15,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#00e5ff,#bf5fff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#07071a',
                  fontWeight: 700
                }}>
                  {selectedApp.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: C.text }}>{selectedApp.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{selectedApp.email}</div>
                </div>
              </div>
              
              <div style={{ fontSize: 13, color: C.muted }}>
                <strong>Tracks:</strong> {selectedApp.tracks?.join(', ')}
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>
                <strong>Duration:</strong> {selectedApp.duration}
              </div>
            </div>

            <p style={{ color: C.muted, fontSize: 14, marginBottom: 15 }}>
              An email will be sent to <strong style={{ color: '#00e5ff' }}>{selectedApp.email}</strong>
            </p>
            
            <textarea
              placeholder="Add notes (optional)"
              value={emailData.notes}
              onChange={e => setEmailData({ ...emailData, notes: e.target.value })}
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
                  background: emailData.status === 'accepted' 
                    ? 'linear-gradient(135deg,#00ffb3,#00e5ff)'
                    : 'linear-gradient(135deg,#ff6b6b,#ff4444)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  color: '#07071a',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {emailData.status === 'accepted' ? '✓ Accept & Send Email' : '✗ Reject & Send Email'}
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

// Stat Card Component for summary
function StatCard({ label, value, color, dark, C }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: '12px 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <span style={{ color: C.muted, fontSize: 13 }}>{label}:</span>
      <span style={{ color, fontWeight: 700, fontSize: 16 }}>{value}</span>
    </div>
  );
}