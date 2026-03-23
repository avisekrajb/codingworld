import { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackModal from '../components/FeedbackModal';

// SVG Components
const StarSVG = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#ffd700" : "none"} stroke="#ffd700" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#00e5ff" opacity="0.3">
    <path d="M10 11h-4v-4h4v4zm8 0h-4v-4h4v4zm-8 6h-4v-4h4v4zm8 0h-4v-4h4v4z" />
  </svg>
);

const VerifiedSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#00e5ff">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const ChevLeftSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevRightSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const GridSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export default function TestimonialsPage({ dark, C }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    totalReviews: 0,
    fiveStar: 0
  });
  const [activeT, setActiveT] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [page, filterRating, sortBy]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/feedback/list?page=${page}`);
      setFeedbacks(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/feedback/stats');
      const data = response.data.data;
      setStats({
        total: data.total,
        averageRating: data.averageRating.toFixed(1),
        totalReviews: data.approved,
        fiveStar: data.fiveStar || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getSortedFeedbacks = () => {
    let sorted = [...feedbacks];
    if (filterRating > 0) {
      sorted = sorted.filter(f => f.rating === filterRating);
    }
    
    switch(sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    return sorted;
  };

  const displayedFeedbacks = getSortedFeedbacks();

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section with Stats */}
      <section style={{
        padding: "60px 5% 40px",
        background: dark ? "rgba(0,229,255,0.02)" : "rgba(0,150,255,0.02)",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20px 20px, #00e5ff 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(0,229,255,0.12)",
              border: "1px solid rgba(0,229,255,0.35)",
              color: "#00e5ff",
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontFamily: "'Space Mono',monospace",
              letterSpacing: 1,
              marginBottom: 20
            }}>
              💬 CLIENT TESTIMONIALS
            </span>
            
            <h1 style={{
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 900,
              color: C.text,
              marginBottom: 15,
              lineHeight: 1.2
            }}>
              What Our <span style={{ color: "#00e5ff" }}>Clients Say</span>
            </h1>
            
            <p style={{
              fontSize: "clamp(1rem,2vw,1.2rem)",
              color: C.muted,
              maxWidth: 600,
              margin: "0 auto 30px"
            }}>
              Join 500+ happy clients who trusted us with their projects
            </p>

            {/* Stats Cards */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 30,
              flexWrap: 'wrap',
              marginTop: 30
            }}>
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: '20px 30px',
                minWidth: 150,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#00e5ff' }}>{stats.totalReviews}+</div>
                <div style={{ fontSize: 13, color: C.muted }}>Total Reviews</div>
              </div>
              
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: '20px 30px',
                minWidth: 150,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#ffd700' }}>{stats.averageRating}</div>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 5 }}>
                  {[1,2,3,4,5].map(i => (
                    <StarSVG key={i} filled={i <= Math.round(stats.averageRating)} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>Average Rating</div>
              </div>

              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: '20px 30px',
                minWidth: 150,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#00ffb3' }}>98%</div>
                <div style={{ fontSize: 13, color: C.muted }}>Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Write Feedback Button */}
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <button
              onClick={() => setShowModal(true)}
              className="shine"
              style={{
                background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                border: 'none',
                borderRadius: 50,
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: 15,
                color: '#07071a',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 8px 24px #00e5ff44'
              }}
            >
              <span>✍️</span>
              Write a Feedback
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section style={{ padding: '30px 5% 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 15
        }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={filterRating}
              onChange={e => setFilterRating(Number(e.target.value))}
              style={{
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '8px 12px',
                color: C.text,
                fontSize: 13
              }}
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
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
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 5 }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#00e5ff20' : 'transparent',
                border: `1px solid ${viewMode === 'grid' ? '#00e5ff' : C.border}`,
                borderRadius: 6,
                padding: '6px 10px',
                cursor: 'pointer',
                color: viewMode === 'grid' ? '#00e5ff' : C.muted
              }}
            >
              <GridSVG />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#00e5ff20' : 'transparent',
                border: `1px solid ${viewMode === 'list' ? '#00e5ff' : C.border}`,
                borderRadius: 6,
                padding: '6px 10px',
                cursor: 'pointer',
                color: viewMode === 'list' ? '#00e5ff' : C.muted
              }}
            >
              <ListSVG />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      {feedbacks.length > 0 && (
        <section style={{ padding: '20px 5%' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.card}, ${C.card}ee)`,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: '30px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                fontSize: 120,
                opacity: 0.1,
                transform: 'rotate(15deg)'
              }}>
                💬
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap'
              }}>
                <img
                  src={feedbacks[activeT]?.photo}
                  alt={feedbacks[activeT]?.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #00e5ff'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>
                      {feedbacks[activeT]?.name}
                    </h3>
                    <VerifiedSVG />
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                    {[1,2,3,4,5].map(i => (
                      <StarSVG key={i} filled={i <= (feedbacks[activeT]?.rating || 0)} />
                    ))}
                  </div>
                  <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
                    "{feedbacks[activeT]?.comment}"
                  </p>
                </div>
              </div>

              {/* Navigation Dots */}
              {feedbacks.length > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 20
                }}>
                  {feedbacks.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveT(i)}
                      style={{
                        width: i === activeT ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === activeT ? '#00e5ff' : 'rgba(128,128,180,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* All Feedbacks Grid/List */}
      <section style={{ padding: '30px 5% 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 14, color: C.muted }}>Loading feedbacks...</div>
            </div>
          ) : displayedFeedbacks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 60,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 20
            }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>📝</div>
              <h3 style={{ fontSize: 18, color: C.text, marginBottom: 10 }}>No Feedbacks Yet</h3>
              <p style={{ color: C.muted, marginBottom: 20 }}>Be the first to share your experience!</p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  color: '#07071a',
                  cursor: 'pointer'
                }}
              >
                Write Feedback →
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: viewMode === 'grid' 
                  ? 'grid'
                  : 'flex',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'none',
                flexDirection: viewMode === 'list' ? 'column' : 'none',
                gap: 20
              }}>
                {displayedFeedbacks.map((feedback, index) => (
                  <div
                    key={feedback._id}
                    style={viewMode === 'grid' ? {
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 16,
                      padding: 20,
                      transition: 'all 0.3s'
                    } : {
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 20,
                      display: 'flex',
                      gap: 15,
                      alignItems: 'center'
                    }}
                  >
                    {/* Photo */}
                    <img
                      src={feedback.photo}
                      alt={feedback.name}
                      style={viewMode === 'grid' ? {
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 12,
                        marginBottom: 15
                      } : {
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 5,
                        flexWrap: 'wrap'
                      }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                          {feedback.name}
                        </h4>
                        <VerifiedSVG />
                        <span style={{ fontSize: 11, color: C.muted }}>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                        {[1,2,3,4,5].map(i => (
                          <StarSVG key={i} filled={i <= feedback.rating} />
                        ))}
                      </div>

                      <p style={{
                        color: C.muted,
                        fontSize: 13,
                        lineHeight: 1.6,
                        marginBottom: viewMode === 'grid' ? 0 : 0
                      }}>
                        "{feedback.comment.length > 100 
                          ? feedback.comment.substring(0, 100) + '...' 
                          : feedback.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  marginTop: 30
                }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      background: page === 1 ? 'transparent' : 'linear-gradient(135deg,#00e5ff,#0095ff)',
                      border: `1px solid ${page === 1 ? C.border : 'transparent'}`,
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: page === 1 ? C.muted : '#07071a',
                      cursor: page === 1 ? 'default' : 'pointer'
                    }}
                  >
                    <ChevLeftSVG />
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
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: page === totalPages ? C.muted : '#07071a',
                      cursor: page === totalPages ? 'default' : 'pointer'
                    }}
                  >
                    <ChevRightSVG />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Feedback Modal */}
      {showModal && <FeedbackModal onClose={() => setShowModal(false)} dark={dark} C={C} />}
    </div>
  );
}