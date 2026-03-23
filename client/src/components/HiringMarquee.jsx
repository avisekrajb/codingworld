import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HiringMarquee = ({ dark, C }) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [touchStart, setTouchStart] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hiringMessages = [
    { 
      text: "🚀 WE ARE HIRING: Node.js Developers • 3+ Years Experience • Remote • Competitive Salary", 
      mobileText: "🚀 Hiring: Node.js Developers",
      shortText: "Node.js Developers Wanted",
      icon: "🟢",
      color: "#00e5ff",
      urgency: "🔥 URGENT",
      positions: "5 Openings",
      location: "🌍 Remote",
      experience: "3+ Years",
      salary: "💰 Competitive"
    },
    { 
      text: "⚡ Join our backend team • Build scalable APIs • MongoDB • Express • Socket.io", 
      mobileText: "⚡ Backend Engineers",
      shortText: "Backend Team Needed",
      icon: "⚡",
      color: "#bf5fff",
      urgency: "🎯 5 POSITIONS",
      positions: "5 Openings",
      location: "🌍 Remote",
      experience: "2+ Years",
      salary: "💰 12-20 LPA"
    },
    { 
      text: "💼 Full-time • Remote work • Flexible hours • Health insurance • Stock options", 
      mobileText: "💼 Full-time • Great Benefits",
      shortText: "Amazing Benefits Package",
      icon: "💼",
      color: "#00ffb3",
      urgency: "✨ BENEFITS",
      positions: "Multiple",
      location: "🌏 Anywhere",
      experience: "Any",
      salary: "💰 Best in Industry"
    },
    { 
      text: "🌟 Work on microservices • AWS • Docker • Kubernetes • GraphQL", 
      mobileText: "🌟 Microservices Experts",
      shortText: "Cloud Native Engineers",
      icon: "🌟",
      color: "#ff9d00",
      urgency: "🛠️ TECH STACK",
      positions: "3 Openings",
      location: "🌍 Remote",
      experience: "4+ Years",
      salary: "💰 18-25 LPA"
    },
    { 
      text: "📱 Apply now • Immediate joining • Interview this week • Start next month", 
      mobileText: "📱 Apply Now • Immediate Joining",
      shortText: "Quick Hiring Process",
      icon: "📱",
      color: "#ff6b6b",
      urgency: "⏰ HURRY",
      positions: "Limited",
      location: "🌍 Remote/Onsite",
      experience: "Any",
      salary: "💰 Negotiable"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPaused && !isMobile) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % hiringMessages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isMobile, hiringMessages.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next
        setCurrentIndex((prev) => (prev + 1) % hiringMessages.length);
      } else {
        // Swipe right - previous
        setCurrentIndex((prev) => (prev - 1 + hiringMessages.length) % hiringMessages.length);
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const currentMessage = hiringMessages[currentIndex];

  // Mobile view - Collapsible/Expandable
  if (isMobile) {
    return (
      <div style={{
        width: '100%',
        background: dark ? 'linear-gradient(135deg, #07071a, #0a0a1e)' : 'linear-gradient(135deg, #f0f7ff, #f5f0fd)',
        borderTop: `2px solid ${currentMessage.color}33`,
        borderBottom: `2px solid ${currentMessage.color}33`,
        padding: showDetails ? '15px 15px 20px' : '12px 15px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setShowDetails(!showDetails)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Header - Always Visible */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1
          }}>
            {/* Icon with pulse */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${currentMessage.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${currentMessage.color}44`,
              animation: 'pulseIcon 2s ease infinite'
            }}>
              <span style={{ fontSize: 20 }}>{currentMessage.icon}</span>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 2
              }}>
                <span style={{
                  background: `${currentMessage.color}20`,
                  color: currentMessage.color,
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 800
                }}>
                  {currentMessage.urgency}
                </span>
                <span style={{
                  color: C.text,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {currentMessage.mobileText}
                </span>
              </div>
              
              {/* Expand/Collapse Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span style={{
                  color: C.muted,
                  fontSize: 11
                }}>
                  {showDetails ? 'Tap to collapse' : 'Tap for details'}
                </span>
                <span style={{
                  color: currentMessage.color,
                  fontSize: 12,
                  transform: showDetails ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s'
                }}>
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Mini CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/careers');
            }}
            style={{
              background: `linear-gradient(135deg, ${currentMessage.color}, ${currentMessage.color}dd)`,
              border: 'none',
              borderRadius: 20,
              padding: '6px 12px',
              color: '#07071a',
              fontWeight: 700,
              fontSize: 11,
              whiteSpace: 'nowrap',
              boxShadow: `0 2px 8px ${currentMessage.color}66`
            }}
          >
            Apply
          </button>
        </div>

        {/* Expanded Details - Mobile */}
        {showDetails && (
          <div style={{
            marginTop: 15,
            paddingTop: 12,
            borderTop: `1px solid ${currentMessage.color}33`,
            animation: 'slideDown 0.3s ease'
          }}>
            {/* Full Message */}
            <p style={{
              color: C.text,
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 12
            }}>
              {currentMessage.text}
            </p>

            {/* Job Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              marginBottom: 15
            }}>
              <DetailChip
                icon="📌"
                label="Positions"
                value={currentMessage.positions}
                color={currentMessage.color}
              />
              <DetailChip
                icon="🌍"
                label="Location"
                value={currentMessage.location}
                color={currentMessage.color}
              />
              <DetailChip
                icon="⏳"
                label="Experience"
                value={currentMessage.experience}
                color={currentMessage.color}
              />
              <DetailChip
                icon="💰"
                label="Salary"
                value={currentMessage.salary}
                color={currentMessage.color}
              />
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: 8
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/careers');
                }}
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${currentMessage.color}, ${currentMessage.color}dd)`,
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px',
                  color: '#07071a',
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                Apply Now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/contact');
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: `1px solid ${currentMessage.color}66`,
                  borderRadius: 10,
                  padding: '10px',
                  color: currentMessage.color,
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                Ask Questions
              </button>
            </div>

            {/* Swipe Hint */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              marginTop: 12,
              color: C.muted,
              fontSize: 10
            }}>
              <span>←</span>
              <span>Swipe to see more jobs</span>
              <span>→</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop View (Original Enhanced)
  return (
    <div style={{
      width: '100%',
      background: dark ? 'linear-gradient(90deg, #07071a, #0a0a1e)' : 'linear-gradient(90deg, #f0f7ff, #f5f0fd)',
      borderTop: `1px solid ${currentMessage.color}33`,
      borderBottom: `1px solid ${currentMessage.color}33`,
      padding: '15px 0',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
    onMouseMove={handleMouseMove}
    onClick={() => navigate('/careers')}
    >
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${currentMessage.color}15, transparent 70%)`,
        transition: 'background 0.3s ease',
        pointerEvents: 'none'
      }} />

      {/* Floating Particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.3
      }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2,
              height: 2,
              borderRadius: '50%',
              background: currentMessage.color,
              animation: `float ${3 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main Marquee Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        padding: '0 5%',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Section - Icon & Urgency */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{
            width: 45,
            height: 45,
            borderRadius: 12,
            background: `${currentMessage.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${currentMessage.color}44`,
            animation: 'pulseIcon 2s ease infinite'
          }}>
            <span style={{ fontSize: 24 }}>{currentMessage.icon}</span>
          </div>
          
          <div style={{
            background: `${currentMessage.color}20`,
            padding: '6px 18px',
            borderRadius: 30,
            border: `1px solid ${currentMessage.color}44`
          }}>
            <span style={{
              color: currentMessage.color,
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.5px'
            }}>
              {currentMessage.urgency}
            </span>
          </div>
        </div>

        {/* Middle Section - Main Message */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          flex: 1,
          justifyContent: 'center'
        }}>
          <span style={{
            fontSize: 16,
            fontWeight: 600,
            color: C.text,
            textShadow: dark ? '0 0 10px rgba(0,229,255,0.3)' : 'none',
            whiteSpace: 'nowrap'
          }}>
            {currentMessage.text}
          </span>

          {/* Job Tags */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Tag label={currentMessage.positions} color={currentMessage.color} />
            <Tag label={currentMessage.location} color={currentMessage.color} />
            <Tag label={currentMessage.experience} color={currentMessage.color} />
          </div>

          {/* Animated Dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: currentMessage.color,
                  animation: `pulseDot 1.5s ease ${i * 0.3}s infinite`
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Section - CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/careers');
          }}
          style={{
            background: `linear-gradient(135deg, ${currentMessage.color}, ${currentMessage.color}dd)`,
            border: 'none',
            borderRadius: 30,
            padding: '10px 30px',
            color: '#07071a',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: `0 4px 15px ${currentMessage.color}66`,
            transition: 'all 0.3s',
            whiteSpace: 'nowrap',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 8px 25px ${currentMessage.color}99`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 4px 15px ${currentMessage.color}66`;
          }}
        >
          <span>Apply Now</span>
          <span style={{ fontSize: 18 }}>→</span>
          
          {/* Ripple Effect */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple 2s ease infinite'
          }} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 3,
        background: `linear-gradient(90deg, ${currentMessage.color}, transparent)`,
        width: isPaused ? '100%' : `${((currentIndex + 1) / hiringMessages.length) * 100}%`,
        transition: isPaused ? 'none' : 'width 4s linear',
        opacity: 0.6
      }} />

      {/* Position Indicator */}
      <div style={{
        position: 'absolute',
        top: 5,
        right: '5%',
        display: 'flex',
        gap: 5
      }}>
        {hiringMessages.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIndex ? 20 : 8,
              height: 4,
              borderRadius: 2,
              background: i === currentIndex ? currentMessage.color : `${currentMessage.color}33`,
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Tag Component
const Tag = ({ label, color }) => (
  <div style={{
    background: `${color}15`,
    border: `1px solid ${color}33`,
    borderRadius: 15,
    padding: '3px 10px',
    fontSize: 11,
    color: color,
    fontWeight: 600
  }}>
    {label}
  </div>
);

// Detail Chip for Mobile
const DetailChip = ({ icon, label, value, color }) => (
  <div style={{
    background: `${color}10`,
    border: `1px solid ${color}22`,
    borderRadius: 8,
    padding: '8px 10px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginBottom: 2
    }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ fontSize: 10, color: '#7878a8' }}>{label}</span>
    </div>
    <span style={{
      fontSize: 12,
      fontWeight: 600,
      color: color
    }}>{value}</span>
  </div>
);

export default HiringMarquee;