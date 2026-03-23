import { useState, useEffect } from 'react';

const SOCIAL_LINKS = [
  { icon: "github", label: "GitHub", url: "https://github.com/codingworld", color: "#c9d1d9" },
  { icon: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/codingworld", color: "#0a66c2" },
  { icon: "whatsapp", label: "WhatsApp", url: "https://wa.me/9779824380896", color: "#25d366" },
  { icon: "instagram", label: "Instagram", url: "https://instagram.com/codingworld", color: "#e1306c" },
  { icon: "twitter", label: "Twitter", url: "https://twitter.com/codingworld", color: "#1DA1F2" },
  { icon: "youtube", label: "YouTube", url: "https://youtube.com/@codingworld", color: "#FF0000" }
];

function SocialIcon({ icon, s = 20, c = "currentColor" }) {
  if (icon === "github") return <GithubSVG s={s} c={c} />;
  if (icon === "linkedin") return <LinkedinSVG s={s} c={c} />;
  if (icon === "whatsapp") return <WhatsappSVG s={s} c={c} />;
  if (icon === "instagram") return <InstagramSVG s={s} c={c} />;
  if (icon === "twitter") return <TwitterSVG s={s} c={c} />;
  if (icon === "youtube") return <YoutubeSVG s={s} c={c} />;
  return null;
}

// SVG Components (same as before, keeping them short for brevity)
const GithubSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsappSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const InstagramSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const TwitterSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const CloseSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ProjectModal({ project, onClose, dark, C, TECH_ICONS, EXTRA_FEATURES }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [animateIn, setAnimateIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setAnimateIn(true);
    document.body.style.overflow = 'hidden';

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!project) return null;

  const projectTech = project.tags
    .map(tag => TECH_ICONS.find(tech => tech.name === tag))
    .filter(Boolean);

  const randomFeatures = EXTRA_FEATURES
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Scroll to top of content when changing tabs on mobile
    if (isMobile) {
      document.querySelector('.modal-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? "0" : "20px"
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.3s ease"
        }}
      />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        className="modal-content"
        style={{
          position: "relative",
          width: isMobile ? "100%" : "min(1000px, 95vw)",
          maxHeight: isMobile ? "90vh" : "90vh",
          background: dark ? "linear-gradient(160deg,#0d0d28,#0a0a1e)" : "linear-gradient(160deg,#f8f8ff,#eeeefa)",
          border: isMobile ? `2px solid ${project.color}40` : `1px solid ${project.color}80`,
          borderRadius: isMobile ? "32px 32px 0 0" : 32,
          overflow: "hidden",
          boxShadow: `0 50px 100px ${project.color}40, 0 0 0 ${isMobile ? '3px' : '2px'} ${project.color}20`,
          animation: animateIn 
            ? isMobile 
              ? "slideUpMobile 0.4s cubic-bezier(0.34,1.56,0.64,1)" 
              : "slideUpDesktop 0.4s cubic-bezier(0.34,1.56,0.64,1)"
            : "none",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div
            style={{
              width: 50,
              height: 5,
              background: project.color + "60",
              borderRadius: 3,
              margin: "12px auto 8px",
              cursor: "grab"
            }}
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = parseInt(document.querySelector('.modal-content').style.maxHeight);
              
              const onMouseMove = (moveEvent) => {
                const delta = moveEvent.clientY - startY;
                if (delta > 50) {
                  onClose();
                  document.removeEventListener('mousemove', onMouseMove);
                }
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
              });
            }}
          />
        )}

        {/* Header */}
        <div style={{
          padding: isMobile ? "16px 20px" : "24px 30px",
          borderBottom: `1px solid ${project.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${project.color}10, transparent)`,
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? "10px" : "0"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: isMobile ? 12 : 15,
            flex: 1
          }}>
            <div style={{
              width: isMobile ? 45 : 60,
              height: isMobile ? 45 : 60,
              borderRadius: isMobile ? 14 : 18,
              background: `linear-gradient(135deg, ${project.color}, ${project.color}80)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? 24 : 32,
              color: "#07071a",
              boxShadow: `0 10px 25px ${project.color}80`,
              flexShrink: 0
            }}>
              {project.emoji}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{
                fontSize: isMobile ? 20 : 28,
                fontWeight: 900,
                color: C.text,
                marginBottom: isMobile ? 3 : 5,
                letterSpacing: "-1px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {project.title}
              </h2>
              <div style={{ 
                display: "flex", 
                gap: isMobile ? 6 : 10,
                flexWrap: "wrap"
              }}>
                <span style={{
                  background: project.color + "20",
                  color: project.color,
                  padding: isMobile ? "2px 8px" : "4px 12px",
                  borderRadius: 20,
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: 700
                }}>
                  v3.0
                </span>
                <span style={{
                  background: "#ff6b6b20",
                  color: "#ff6b6b",
                  padding: isMobile ? "2px 8px" : "4px 12px",
                  borderRadius: 20,
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: 700
                }}>
                  LIVE
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: isMobile ? 40 : 45,
              height: isMobile ? 40 : 45,
              borderRadius: isMobile ? 10 : 12,
              background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${project.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: project.color,
              transition: "all 0.3s",
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = project.color + "20";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
              e.currentTarget.style.transform = "rotate(0)";
            }}
          >
            <CloseSVG />
          </button>
        </div>

        {/* Tabs - Scrollable on Mobile */}
        <div style={{
          display: "flex",
          gap: isMobile ? 2 : 5,
          padding: isMobile ? "0 15px" : "0 30px",
          borderBottom: `1px solid ${C.border}`,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch"
        }}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {['overview', 'technologies', 'features', 'contact'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                padding: isMobile ? "12px 15px" : "15px 20px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? `3px solid ${project.color}` : "3px solid transparent",
                color: activeTab === tab ? project.color : C.muted,
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: isMobile ? 13 : 15,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
                flex: isMobile ? "0 0 auto" : "1"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "20px" : "30px",
          scrollbarWidth: "thin",
          scrollbarColor: `${project.color}40 transparent`,
          WebkitOverflowScrolling: "touch"
        }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 12 : 15
              }}>
                Project Description
              </h3>
              <p style={{
                color: C.muted,
                fontSize: isMobile ? 14 : 15,
                lineHeight: 1.8,
                marginBottom: isMobile ? 20 : 25
              }}>
                {project.desc}
              </p>

              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 12 : 15
              }}>
                Key Highlights
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: isMobile ? 10 : 15,
                marginBottom: isMobile ? 20 : 25
              }}>
                {[
                  { icon: "🚀", label: "Performance", value: "98/100" },
                  { icon: "📱", label: "Responsive", value: "100%" },
                  { icon: "🔒", label: "Security", value: "A+" },
                  { icon: "⚡", label: "Speed", value: "< 2s" }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: project.color + "10",
                    border: `1px solid ${project.color}30`,
                    borderRadius: isMobile ? 10 : 12,
                    padding: isMobile ? "12px" : "15px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: isMobile ? 20 : 24, marginBottom: 5 }}>{item.icon}</div>
                    <div style={{ fontSize: isMobile ? 10 : 12, color: C.muted }}>{item.label}</div>
                    <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: project.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 12 : 15
              }}>
                Project Timeline
              </h3>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10
              }}>
                <div style={{ flex: 1, height: 8, background: `${project.color}20`, borderRadius: 4 }}>
                  <div style={{
                    width: "75%",
                    height: "100%",
                    background: `linear-gradient(90deg, ${project.color}, ${project.color}80)`,
                    borderRadius: 4,
                    animation: "progressFill 1s ease"
                  }} />
                </div>
                <span style={{ color: project.color, fontWeight: 700, fontSize: isMobile ? 13 : 14 }}>75%</span>
              </div>
              <p style={{ color: C.muted, fontSize: isMobile ? 12 : 13 }}>
                Started: Jan 2025 | Expected: Mar 2025
              </p>
            </div>
          )}

          {/* Technologies Tab */}
          {activeTab === 'technologies' && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 15 : 20
              }}>
                Technologies Used
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: isMobile ? 10 : 15
              }}>
                {projectTech.map(tech => (
                  <div
                    key={tech.name}
                    style={{
                      background: tech.color + "15",
                      border: `1px solid ${tech.color}40`,
                      borderRadius: isMobile ? 10 : 12,
                      padding: isMobile ? "15px 10px" : "20px 15px",
                      textAlign: "center",
                      transition: "all 0.3s",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = `0 10px 25px ${tech.color}80`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: isMobile ? 24 : 32, marginBottom: isMobile ? 5 : 10 }}>{tech.icon}</div>
                    <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: tech.color }}>{tech.name}</div>
                    <div style={{ fontSize: isMobile ? 9 : 11, color: C.muted, marginTop: 5 }}>{tech.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 15 : 20
              }}>
                Project Features
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: isMobile ? 10 : 15
              }}>
                {randomFeatures.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      background: feature.color + "15",
                      border: `1px solid ${feature.color}40`,
                      borderRadius: isMobile ? 10 : 12,
                      padding: isMobile ? "15px" : "20px 15px",
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                                          alignItems: "center",
                      gap: isMobile ? 8 : 12,
                      textAlign: isMobile ? "center" : "left",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = `0 5px 15px ${feature.color}60`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      width: isMobile ? 35 : 40,
                      height: isMobile ? 35 : 40,
                      borderRadius: isMobile ? 8 : 10,
                      background: feature.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMobile ? 18 : 20,
                      color: feature.color,
                      flexShrink: 0
                    }}>
                      {feature.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: C.text }}>{feature.text}</div>
                      <div style={{ fontSize: isMobile ? 10 : 11, color: C.muted }}>Premium Feature</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: isMobile ? 20 : 30,
                background: `linear-gradient(135deg, ${project.color}20, transparent)`,
                border: `1px solid ${project.color}30`,
                borderRadius: isMobile ? 14 : 16,
                padding: isMobile ? "15px" : "20px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: isMobile ? 32 : 40, marginBottom: isMobile ? 5 : 10 }}>✨</div>
                <h4 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: C.text, marginBottom: 5 }}>
                  And 15+ More Features
                </h4>
                <p style={{ color: C.muted, fontSize: isMobile ? 12 : 13 }}>
                  Including real-time updates, analytics dashboard, and more
                </p>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 15 : 20
              }}>
                Get in Touch
              </h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: isMobile ? 12 : 20,
                marginBottom: isMobile ? 20 : 30
              }}>
                <a
                  href="mailto:codingworld@example.com"
                  style={{
                    background: project.color + "10",
                    border: `1px solid ${project.color}30`,
                    borderRadius: isMobile ? 14 : 16,
                    padding: isMobile ? "15px" : "25px 20px",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 10 : 15
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0 15px 30px ${project.color}60`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50,
                    borderRadius: isMobile ? 10 : 12,
                    background: project.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 20 : 24,
                    color: "#07071a",
                    flexShrink: 0
                  }}>
                    📧
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? 12 : 14, color: C.muted }}>Email Us</div>
                    <div style={{ 
                      fontSize: isMobile ? 13 : 16, 
                      fontWeight: 700, 
                      color: project.color,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      codingworld@example.com
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/9779824380896"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#25d36615",
                    border: "1px solid #25d36640",
                    borderRadius: isMobile ? 14 : 16,
                    padding: isMobile ? "15px" : "25px 20px",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 10 : 15
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 30px #25d36680";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50,
                    borderRadius: isMobile ? 10 : 12,
                    background: "#25d366",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 20 : 24,
                    color: "#fff",
                    flexShrink: 0
                  }}>
                    💬
                  </div>
                  <div>
                    <div style={{ fontSize: isMobile ? 12 : 14, color: C.muted }}>WhatsApp</div>
                    <div style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: "#25d366" }}>
                      +977 9824380896
                    </div>
                  </div>
                </a>
              </div>

              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: isMobile ? 12 : 20
              }}>
                Connect With Us
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
                gap: isMobile ? 8 : 15,
                marginBottom: isMobile ? 20 : 30
              }}>
                {SOCIAL_LINKS.map(link => (
                  <a
                    key={link.icon}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: isMobile ? 12 : 16,
                      background: link.color + "15",
                      border: `1px solid ${link.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                      e.currentTarget.style.background = link.color + "30";
                      e.currentTarget.style.boxShadow = `0 10px 20px ${link.color}80`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.background = link.color + "15";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <SocialIcon icon={link.icon} s={isMobile ? 20 : 25} c={link.color} />
                  </a>
                ))}
              </div>

              <div style={{
                background: project.color + "10",
                border: `1px solid ${project.color}30`,
                borderRadius: isMobile ? 14 : 16,
                padding: isMobile ? "15px" : "25px",
                textAlign: "center"
              }}>
                <h4 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                  Interested in this project?
                </h4>
                <p style={{ color: C.muted, fontSize: isMobile ? 12 : 14, marginBottom: isMobile ? 12 : 20 }}>
                  Get the complete source code and documentation
                </p>
                <button
                  onClick={() => window.open(project.link, '_blank')}
                  style={{
                    background: `linear-gradient(135deg, ${project.color}, ${project.color}bb)`,
                    border: "none",
                    borderRadius: isMobile ? 10 : 12,
                    padding: isMobile ? "10px 20px" : "12px 30px",
                    fontWeight: 700,
                    fontSize: isMobile ? 13 : 15,
                    color: "#07071a",
                    cursor: "pointer",
                    boxShadow: `0 5px 20px ${project.color}80`,
                    transition: "all 0.3s",
                    width: isMobile ? "100%" : "auto"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 10px 30px ${project.color}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 5px 20px ${project.color}80`;
                  }}
                >
                  View Live Project →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: isMobile ? "12px 15px" : "20px 30px",
          borderTop: `1px solid ${project.color}30`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: dark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? "10px" : "0"
        }}>
          <div style={{ 
            display: "flex", 
            gap: isMobile ? 5 : 10,
            flexWrap: "wrap",
            flex: 1
          }}>
            {project.tags.slice(0, isMobile ? 2 : 3).map(tag => (
              <span key={tag} style={{
                background: project.color + "20",
                color: project.color,
                padding: isMobile ? "3px 8px" : "4px 12px",
                borderRadius: 20,
                fontSize: isMobile ? 10 : 11,
                fontWeight: 600
              }}>
                {tag}
              </span>
            ))}
            {project.tags.length > (isMobile ? 2 : 3) && (
              <span style={{
                background: project.color + "10",
                color: project.color,
                padding: isMobile ? "3px 8px" : "4px 12px",
                borderRadius: 20,
                fontSize: isMobile ? 10 : 11,
                fontWeight: 600
              }}>
                +{project.tags.length - (isMobile ? 2 : 3)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${project.color}80`,
              borderRadius: isMobile ? 6 : 8,
              padding: isMobile ? "6px 15px" : "8px 20px",
              color: project.color,
              fontSize: isMobile ? 12 : 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = project.color + "20";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUpDesktop {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideUpMobile {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progressFill {
          from { width: 0; }
          to { width: 75%; }
        }
        
        .modal-content {
          transition: transform 0.3s ease;
        }
        
        /* Custom scrollbar */
        .modal-content ::-webkit-scrollbar {
          width: 4px;
        }
        
        .modal-content ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .modal-content ::-webkit-scrollbar-thumb {
          background: ${project?.color}40;
          border-radius: 4px;
        }
        
        .modal-content ::-webkit-scrollbar-thumb:hover {
          background: ${project?.color}80;
        }
        
        @media (max-width: 768px) {
          .modal-content ::-webkit-scrollbar {
            width: 3px;
          }
        }
      `}</style>
    </div>
  );
}