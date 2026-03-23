import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageContact({ dark, C }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    replied: 0,
    resolved: 0,
    last7Days: []
  });

  const adminKey = 'coding-world-admin-2025';

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [statusFilter, page]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? `/api/contact/messages?page=${page}`
        : `/api/contact/messages?status=${statusFilter}&page=${page}`;
      
      const response = await axios.get(url, {
        headers: { 'admin-key': adminKey }
      });
      setMessages(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/contact/stats', {
        headers: { 'admin-key': adminKey }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      await axios.post(`/api/contact/reply/${id}`, {
        replyMessage: replyText
      }, {
        headers: { 'admin-key': adminKey }
      });
      setShowReplyModal(false);
      setReplyText('');
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9d00';
      case 'replied': return '#00e5ff';
      case 'resolved': return '#00ffb3';
      default: return C.muted;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#ff9d0020', text: '#ff9d00', border: '#ff9d0044' },
      replied: { bg: '#00e5ff20', text: '#00e5ff', border: '#00e5ff44' },
      resolved: { bg: '#00ffb320', text: '#00ffb3', border: '#00ffb344' }
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
        gridTemplateColumns: 'repeat(4, 1fr)',
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
          title="Replied"
          value={stats.replied}
          color="#bf5fff"
          dark={dark}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          color="#00ffb3"
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
        <h3 style={{ color: C.text, fontSize: 18 }}>Contact Messages</h3>
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
            <option value="all">All Messages</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 14, color: C.muted }}>Loading messages...</div>
        </div>
      ) : messages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
          <h4 style={{ color: C.text, marginBottom: 10 }}>No Messages Found</h4>
          <p style={{ color: C.muted, fontSize: 13 }}>No contact messages matching the selected criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Name</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Contact</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Subject</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Message</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Date</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', color: C.muted, fontSize: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontWeight: 600, color: C.text }}>{msg.name}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ color: C.text, fontSize: 13 }}>{msg.email}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{msg.phone}</div>
                  </td>
                  <td style={{ padding: '15px 10px', maxWidth: 150 }}>
                    <div style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>
                      {msg.subject}
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px', maxWidth: 200 }}>
                    <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>
                      {msg.message.length > 80 ? msg.message.substring(0, 80) + '...' : msg.message}
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {getStatusBadge(msg.status)}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <button
                      onClick={() => {
                        setSelectedMessage(msg);
                        setReplyText('');
                        setShowReplyModal(true);
                      }}
                      style={{
                        background: msg.status === 'pending' ? '#00e5ff20' : '#00ffb320',
                        border: `1px solid ${msg.status === 'pending' ? '#00e5ff44' : '#00ffb344'}`,
                        borderRadius: 6,
                        padding: '6px 12px',
                        color: msg.status === 'pending' ? '#00e5ff' : '#00ffb3',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      {msg.status === 'pending' ? 'Reply' : 'View'}
                    </button>
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
              cursor: page === 1 ? 'default' : 'pointer',
              opacity: page === 1 ? 0.5 : 1
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
              cursor: page === totalPages ? 'default' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
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
            <h3 style={{ color: C.text, fontSize: 20, marginBottom: 15 }}>
              Reply to {selectedMessage.name}
            </h3>
            
            <div style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 10,
              padding: 15,
              marginBottom: 20
            }}>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 5 }}>
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>
              <p style={{ color: C.text, fontSize: 14, fontStyle: 'italic', lineHeight: 1.6 }}>
                "{selectedMessage.message}"
              </p>
            </div>

            <p style={{ color: C.muted, fontSize: 13, marginBottom: 10 }}>
              Reply will be sent to: <strong style={{ color: '#00e5ff' }}>{selectedMessage.email}</strong>
            </p>

            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={5}
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                color: C.text,
                fontSize: 14,
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
                onClick={() => handleReply(selectedMessage._id)}
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
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
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