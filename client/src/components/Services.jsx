import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Real Icon Components (using SVG instead of emoji)
const WebDevIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="16" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="12" y2="13" />
    <line x1="22" y1="6" x2="2" y2="6" />
  </svg>
);

const MobileIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const DesignIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const EcommerceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

const APIIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SEOIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const SecurityIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const CloudIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const AIIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const BlockchainIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="21" x2="9" y2="9" />
    <line x1="15" y1="21" x2="15" y2="9" />
  </svg>
);

const DevOpsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const SupportIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
  </svg>
);

// Icon mapping
const iconMap = {
  "⚡": <WebDevIcon />,
  "📱": <MobileIcon />,
  "🎨": <DesignIcon />,
  "🛒": <EcommerceIcon />,
  "🔧": <APIIcon />,
  "🚀": <SEOIcon />,
  "🔒": <SecurityIcon />,
  "☁️": <CloudIcon />,
  "🤖": <AIIcon />,
  "🗄️": <DatabaseIcon />,
  "📊": <AnalyticsIcon />,
  "🔗": <BlockchainIcon />,
  "⚙️": <DevOpsIcon />,
  "💬": <SupportIcon />
};

export default function Services({ dark, C }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const services = t('services.items');
  const initialDisplayCount = 6;
  const displayedServices = expanded ? services : services.slice(0, initialDisplayCount);

  // Extended services with more details
  const extendedServices = services.map((service, index) => ({
    ...service,
    features: getFeaturesForService(index),
    technologies: getTechnologiesForService(index)
  }));

  function getFeaturesForService(index) {
    const featuresList = [
      ['Responsive Design', 'Performance Optimization', 'SEO Friendly'],
      ['Cross-platform', 'Native Performance', 'App Store Deployment'],
      ['User Research', 'Wireframing', 'Prototyping'],
      ['Payment Gateway', 'Inventory Management', 'Order Tracking'],
      ['RESTful APIs', 'GraphQL', 'Webhooks'],
      ['Page Speed', 'Core Web Vitals', 'Search Ranking'],
      ['Penetration Testing', 'SSL/TLS', 'DDoS Protection'],
      ['CI/CD', 'Docker', 'Kubernetes'],
      ['Machine Learning', 'NLP', 'Computer Vision'],
      ['Query Optimization', 'Data Migration', 'Backup Strategies'],
      ['Real-time Analytics', 'Custom Reports', 'Data Visualization'],
      ['Smart Contracts', 'DeFi', 'NFT Marketplace']
    ];
    return featuresList[index % featuresList.length];
  }

  function getTechnologiesForService(index) {
    const techList = [
      ['React', 'Node.js', 'MongoDB'],
      ['React Native', 'Flutter', 'Swift'],
      ['Figma', 'Adobe XD', 'Sketch'],
      ['Shopify', 'WooCommerce', 'Stripe'],
      ['Express', 'Django', 'Laravel'],
      ['Lighthouse', 'GTmetrix', 'Google Analytics'],
      ['OWASP', 'WAF', 'Cloudflare'],
      ['AWS', 'GCP', 'Azure'],
      ['TensorFlow', 'PyTorch', 'OpenAI'],
      ['PostgreSQL', 'MySQL', 'Redis'],
      ['Tableau', 'Power BI', 'Looker'],
      ['Ethereum', 'Solana', 'Web3.js']
    ];
    return techList[index % techList.length];
  }

  return (
    <section id="services" style={{ 
      padding: "90px 5%",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decoration */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #00e5ff10, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #bf5fff10, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <div style={{ 
        maxWidth: 1280, 
        margin: "0 auto",
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header with Stats */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 40
        }}>
          <div style={{ textAlign: "left", flex: 1 }}>
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
              marginBottom: 15
            }}>
              ✦ {t('services.whatWeDo')}
            </span>
            
            <h2 style={{
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 800,
              letterSpacing: "-2px",
              color: C.text,
              lineHeight: 1.2,
              marginBottom: 15
            }}>
              {t('services.title')}{' '}
              <span style={{ 
                color: "#00e5ff",
                position: 'relative',
                display: 'inline-block'
              }}>
                {t('services.titleHighlight')}
                <span style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  width: '100%',
                  height: 3,
                  background: 'linear-gradient(90deg, #00e5ff, transparent)',
                  borderRadius: 2
                }} />
              </span>
            </h2>
            
            <p style={{ 
              color: C.muted, 
              fontSize: 16, 
              maxWidth: 500,
              lineHeight: 1.8
            }}>
              {t('services.subtitle')}
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap'
          }}>
            <StatCard
              value="50+"
              label={t('hero.projects')}
              color="#00e5ff"
              dark={dark}
              C={C}
            />
            <StatCard
              value="100%"
              label={t('hero.satisfaction')}
              color="#bf5fff"
              dark={dark}
              C={C}
            />
            <StatCard
              value="24/7"
              label={t('contact.support') || "Support"}
              color="#00ffb3"
              dark={dark}
              C={C}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          marginBottom: 30
        }}>
          {displayedServices.map((s, i) => {
            const isHovered = hoveredIndex === i;
            const icon = iconMap[s.icon] || <WebDevIcon />;
            
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: C.card,
                  border: `1px solid ${isHovered ? '#00e5ff' : C.border}`,
                  borderRadius: 20,
                  padding: "28px",
                  transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 20px 40px rgba(0,229,255,0.15)` : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: isHovered ? '100%' : '0%',
                  background: `linear-gradient(135deg, ${dark ? '#00e5ff08' : '#00e5ff02'}, transparent)`,
                  transition: 'height 0.4s ease',
                  zIndex: 0
                }} />

                {/* Icon with Background */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  marginBottom: 20
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: isHovered 
                      ? 'linear-gradient(135deg, #00e5ff, #0095ff)'
                      : `${dark ? '#00e5ff15' : '#00e5ff08'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isHovered ? '#07071a' : '#00e5ff',
                    transition: 'all 0.3s ease'
                  }}>
                    {icon}
                  </div>
                  
                  <span style={{
                    fontSize: 13,
                    color: C.muted,
                    background: dark ? '#00e5ff10' : '#00e5ff05',
                    padding: '4px 12px',
                    borderRadius: 20,
                    border: `1px solid #00e5ff33`
                  }}>
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Title & Description */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: isHovered ? '#00e5ff' : C.text,
                    transition: 'color 0.3s'
                  }}>
                    {s.title}
                  </h3>
                  
                  <p style={{
                    color: C.muted,
                    lineHeight: 1.7,
                    fontSize: 14,
                    marginBottom: 15
                  }}>
                    {s.desc}
                  </p>

                  {/* Features (shown on hover) */}
                  {isHovered && (
                    <div style={{
                      marginTop: 15,
                      animation: 'slideUp 0.3s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: 12
                      }}>
                        {extendedServices[i].features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#00e5ff15',
                              border: '1px solid #00e5ff33',
                              borderRadius: 20,
                              padding: '4px 10px',
                              fontSize: 11,
                              color: '#00e5ff'
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Technologies */}
                      <div style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: 11, color: C.muted }}>Tech:</span>
                        {extendedServices[i].technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: 11,
                              color: C.text,
                              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                              padding: '2px 8px',
                              borderRadius: 12
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button
                    style={{
                      marginTop: 20,
                      background: 'none',
                      border: 'none',
                      color: isHovered ? '#00e5ff' : C.muted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: 0
                    }}
                  >
                    {t('common.learnMore') || 'Learn More'}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      style={{
                        transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                        transition: 'transform 0.3s'
                      }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More/Less Button */}
        {services.length > initialDisplayCount && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'linear-gradient(135deg, #00e5ff, #0095ff)',
                border: 'none',
                borderRadius: 30,
                padding: '12px 32px',
                color: '#07071a',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 8px 20px rgba(0,229,255,0.3)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,229,255,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,229,255,0.3)';
              }}
            >
              {expanded ? (
                <>
                  <span>👆</span>
                  {t('common.showLess') || 'Show Less'}
                </>
              ) : (
                <>
                  <span>👇</span>
                  {t('common.viewMore') || `View All ${services.length} Services`}
                </>
              )}
            </button>
          </div>
        )}

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
          marginTop: 60,
          flexWrap: 'wrap'
        }}>
          <TrustBadge
            icon="🏆"
            text={t('services.award') || "Award Winning"}
            dark={dark}
            C={C}
          />
          <TrustBadge
            icon="⭐"
            text={t('services.rated') || "5-Star Rated"}
            dark={dark}
            C={C}
          />
          <TrustBadge
            icon="🔒"
            text={t('services.secure') || "100% Secure"}
            dark={dark}
            C={C}
          />
          <TrustBadge
            icon="🚀"
            text={t('services.fast') || "Fast Delivery"}
            dark={dark}
            C={C}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

// Stat Card Component
function StatCard({ value, label, color, dark, C }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: `1px solid ${isHovered ? color : 'transparent'}`,
        borderRadius: 16,
        padding: '15px 25px',
        textAlign: 'center',
        transition: 'all 0.3s',
        cursor: 'default'
      }}
    >
      <div style={{
        fontSize: 28,
        fontWeight: 800,
        color: isHovered ? color : C.text,
        marginBottom: 5,
        transition: 'color 0.3s'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 12,
        color: C.muted
      }}>
        {label}
      </div>
    </div>
  );
}

// Trust Badge Component
function TrustBadge({ icon, text, dark, C }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: 40,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 13, color: C.muted }}>{text}</span>
    </div>
  );
}