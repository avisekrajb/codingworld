import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageFeedback({ dark, C }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({ status: '', replyMessage: '' });

  useEffect(() => {
    fetchFeedbacks();
  }, [statusFilter, page]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? `/api/feedback/admin/all?page=${page}`
        : `/api/feedback/admin/all?status=${statusFilter}&page=${page}`;
      
      const response = await axios.get(url, {
        headers: {
          'admin-key': 'coding-world-admin-2025'
        }
      });
      setFeedbacks(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, replyMessage = '') => {
    try {
      await axios.patch(`/api/feedback/admin/${id}`, {
        status,
        replyMessage
      }, {
        headers: {
          'admin-key': 'coding-world-admin-2025'
        }
      });
      fetchFeedbacks();
      setShowReplyModal(false);
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleStatusChange = (feedback, newStatus) => {
    setSelectedFeedback(feedback);
    setReplyData({ status: newStatus, replyMessage: '' });
    setShowReplyModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9d00';
      case 'approved': return '#00ffb3';
      case 'rejected': return '#ff6b6b';
      default: return C.muted;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#ff9d0020', text: '#ff9d00', border: '#ff9d0044' },
      approved: { bg: '#00ffb320', text: '#00ffb3', border: '#00ffb344' },
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

  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ color: i <= rating ? '#ffd700' : C.muted, fontSize: 12 }}>
            ★
          </span>
        ))}
      </div>
    );
  };

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
        <h3 style={{ color: C.text, fontSize: 18 }}>Manage Feedback</h3>
        
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
            <option value="all">All Feedback</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Feedback Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 14, color: C.muted }}>Loading feedback...</div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
          <h4 style={{ color: C.text, marginBottom: 10 }}>No Feedback Found</h4>
          <p style={{ color: C.muted, fontSize: 13 }}>No feedback matching the selected criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>User</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Photo</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Rating</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Feedback</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Date</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(feedback => (
                <tr key={feedback._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '15px 10px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{feedback.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{feedback.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <img
                      src={feedback.photo}
                      alt={feedback.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #00e5ff'
                      }}
                    />
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <StarRating rating={feedback.rating} />
                  </td>
                  <td style={{ padding: '15px 10px', maxWidth: 300 }}>
                    <p style={{ color: C.text, fontSize: 13, lineHeight: 1.5 }}>
                      {feedback.comment.length > 100 
                        ? feedback.comment.substring(0, 100) + '...' 
                        : feedback.comment}
                    </p>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {getStatusBadge(feedback.status)}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {feedback.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(feedback, 'approved')}
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
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(feedback, 'rejected')}
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
                      {feedback.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(feedback, 'pending')}
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

      {/* Reply Modal */}
      {showReplyModal && selectedFeedback && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowReplyModal(false)}>
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
              {replyData.status === 'approved' ? 'Approve Feedback' : 'Reject Feedback'}
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 15,
              marginBottom: 20,
              padding: 15,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 12
            }}>
              <img
                src={selectedFeedback.photo}
                alt={selectedFeedback.name}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div style={{ fontWeight: 600, color: C.text }}>{selectedFeedback.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{selectedFeedback.email}</div>
                <StarRating rating={selectedFeedback.rating} />
              </div>
            </div>
            
            <div style={{
              background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
              borderLeft: `4px solid ${replyData.status === 'approved' ? '#00ffb3' : '#ff6b6b'}`
            }}>
              <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6, fontStyle: 'italic' }}>
                "{selectedFeedback.comment}"
              </p>
            </div>

            <p style={{ color: C.muted, fontSize: 14, marginBottom: 15 }}>
              An email will be sent to <strong style={{ color: '#00e5ff' }}>{selectedFeedback.email}</strong>
            </p>
            
            <textarea
              placeholder="Add a reply message (optional)"
              value={replyData.replyMessage}
              onChange={e => setReplyData({ ...replyData, replyMessage: e.target.value })}
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
                onClick={() => setShowReplyModal(false)}
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
                onClick={() => updateStatus(
                  selectedFeedback._id, 
                  replyData.status, 
                  replyData.replyMessage
                )}
                style={{
                  background: replyData.status === 'approved' 
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
                {replyData.status === 'approved' ? '✓ Approve & Send Email' : '✗ Reject & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}