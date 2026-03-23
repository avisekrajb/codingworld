import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Updated NAV_LINKS to include Internship
const NAV_LINKS = ["Home", "Services", "Projects", "Pricing", "Testimonials", "Contact", "Internship"];

const SunSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar({ dark, setDark, C }) {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 55);
      
      // Update active section based on scroll position
      const sections = NAV_LINKS.map(l => l.toLowerCase());
      const currentPath = location.pathname.replace('/', '') || 'home';
      
      // For home page, check scroll position
      if (currentPath === 'home' || currentPath === '') {
        const scrollPosition = window.scrollY + 100;
        
        const sectionElements = {
          home: document.getElementById('home'),
          services: document.getElementById('services'),
          projects: document.getElementById('projects'),
          pricing: document.getElementById('pricing'),
          testimonials: document.getElementById('testimonials'),
          contact: document.getElementById('contact'),
          internship: document.getElementById('internship-banner')
        };

        for (const [section, element] of Object.entries(sectionElements)) {
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      } else {
        setActiveSection(currentPath);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
useEffect(() => {
  // Track visitor
  const trackVisitor = async () => {
    try {
      // Try to get from server first
      const response = await axios.get('/api/visitor/track');
      setVisitorCount(response.data.count);
      // Store in localStorage as backup
      localStorage.setItem('visitorCount', response.data.count.toString());
    } catch (error) {
      console.error('Error tracking visitor:', error);
      
      // Fallback to localStorage
      let localCount = localStorage.getItem('visitorCount');
      if (localCount) {
        setVisitorCount(parseInt(localCount));
      } else {
        // Generate a random count for demo
        const demoCount = Math.floor(Math.random() * 5000) + 1000;
        setVisitorCount(demoCount);
        localStorage.setItem('visitorCount', demoCount.toString());
      }
      
      // Increment local count for demo
      const currentCount = parseInt(localStorage.getItem('visitorCount') || '1000');
      const newCount = currentCount + 1;
      localStorage.setItem('visitorCount', newCount.toString());
      setVisitorCount(newCount);
    }
  };
  
  trackVisitor();
  
  // Refresh count every 5 minutes
  const interval = setInterval(trackVisitor, 300000);
  return () => clearInterval(interval);
}, []);


  // Updated handleNavClick function
  const handleNavClick = (link) => {
    const path = link.toLowerCase();
    if (path === 'internship') {
      navigate('/internship');
      setActiveSection('internship');
    } else if (path === 'home') {
      navigate('/');
      setActiveSection('home');
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/${path}`);
      setActiveSection(path);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSidebarOpen(false);
  };

  const isActive = (link) => {
    const path = link.toLowerCase();
    if (path === 'home' && (activeSection === 'home' || activeSection === '')) return true;
    return activeSection === path;
  };

  const DarkToggle = () => (
    <button 
      onClick={() => setDark(d => !d)} 
      style={{
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
        border: `1px solid ${C.border}`,
        borderRadius: 9,
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: dark ? "#ffd700" : "#3366ff",
        transition: "all 0.3s",
        flexShrink: 0
      }}
    >
      {dark ? <SunSVG /> : <MoonSVG />}
    </button>
  );

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: scrolled ? C.navBg : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s",
        padding: "0 5%"
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66
        }}>
          <div 
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => handleNavClick("Home")}
          >
            <div style={{
              width: 35,
              height: 35,
              borderRadius: 10,
              background: "linear-gradient(135deg,#00e5ff,#bf5fff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: 13,
              color: "#07071a"
            }}>CW</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: C.text }}>
              Coding <span style={{ color: "#00e5ff" }}>World</span>
            </span>
          </div>

          <div className="dnav" style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {NAV_LINKS.map(l => {
              const active = isActive(l);
              return (
                <span
                  key={l}
                  onClick={() => handleNavClick(l)}
                  style={{
                    fontSize: 13.5,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#00e5ff" : C.muted,
                    transition: "all 0.2s",
                    cursor: "pointer",
                    position: "relative",
                    paddingBottom: 3,
                    // Special styling for active link
                    ...(active && {
                      borderBottom: "2px solid #00e5ff",
                    }),
                    // Special styling for Internship link
                    ...(l === "Internship" && !active && {
                      background: "linear-gradient(135deg, #00e5ff20, #bf5fff20)",
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: `1px solid ${C.border}`,
                    }),
                    // Special styling for active Internship
                    ...(l === "Internship" && active && {
                      background: "linear-gradient(135deg, #00e5ff, #bf5fff)",
                      padding: "5px 12px",
                      borderRadius: 20,
                      color: "#07071a",
                      fontWeight: 700,
                      border: "none"
                    })
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      if (l === "Internship") {
                        e.target.style.background = "linear-gradient(135deg, #00e5ff30, #bf5fff30)";
                      } else {
                        e.target.style.color = "#00e5ff";
                      }
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      if (l === "Internship") {
                        e.target.style.background = "linear-gradient(135deg, #00e5ff20, #bf5fff20)";
                      } else {
                        e.target.style.color = C.muted;
                      }
                    }
                  }}
                >
                  {l}
                  {active && l !== "Internship" && (
                    <span style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "#00e5ff",
                      borderRadius: 2,
                      animation: "slideIn 0.3s ease"
                    }} />
                  )}
                </span>
              );
            })}
            
            {/* Visitor Counter - Desktop */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              padding: '5px 10px',
              borderRadius: 20,
              border: `1px solid ${C.border}`
            }}>
              <span style={{ fontSize: 14 }}>👁️</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#00e5ff' }}>
                {visitorCount.toLocaleString()}
              </span>
            </div>

            <DarkToggle />
            <button
              onClick={() => handleNavClick("Contact")}
              style={{
                background: isActive('contact') 
                  ? "linear-gradient(135deg,#bf5fff,#7b2fff)" 
                  : "linear-gradient(135deg,#00e5ff,#0095ff)",
                border: "none",
                borderRadius: 9,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: 13,
                color: "#07071a",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s",
                transform: isActive('contact') ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive('contact') ? "0 4px 15px rgba(191,95,255,0.4)" : "none"
              }}
            >
              Get Started
            </button>
          </div>

          <div className="mhbr" style={{ display: "none", alignItems: "center", gap: 8 }}>
            {/* Visitor Counter - Mobile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              padding: '5px 10px',
              borderRadius: 20,
              border: `1px solid ${C.border}`
            }}>
              <span style={{ fontSize: 14 }}>👁️</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#00e5ff' }}>
                {visitorCount.toLocaleString()}
              </span>
            </div>
            <DarkToggle />
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.text,
                padding: 4,
                display: "flex"
              }}
            >
              <MenuSVG />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500 }} onClick={() => setSidebarOpen(false)}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)"
          }} />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 300,
              background: dark ? "#07071afa" : "#f2f4fcee",
              backdropFilter: "blur(32px)",
              borderRight: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              animation: "sideIn 0.32s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: "8px 0 40px rgba(0,0,0,0.35)"
            }}
          >
            <style>{`
              @keyframes sideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
              @keyframes pulseGreen {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
              }
              @keyframes slideIn {
                from { width: 0; opacity: 0; }
                to { width: 100%; opacity: 1; }
              }
            `}</style>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 22px",
              borderBottom: `1px solid ${C.border}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: "linear-gradient(135deg,#00e5ff,#bf5fff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Space Mono',monospace",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#07071a",
                  boxShadow: "0 4px 16px rgba(0,229,255,0.3)"
                }}>CW</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>
                    Coding <span style={{ color: "#00e5ff" }}>World</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
                    Full-Stack Development
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: C.muted
                }}
              >
                <CloseSVG />
              </button>
            </div>

            <div style={{ margin: "14px 22px 4px", display: "flex", alignItems: "center", gap: 9, background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: 10, padding: "8px 13px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25d366", animation: "pulseGreen 2s ease infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#25d366" }}>Available for freelance</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {[
                ["🏠", "Home", "home"],
                ["⚡", "Services", "services"],
                ["📁", "Projects", "projects"],
                ["💰", "Pricing", "pricing"],
                ["💬", "Testimonials", "testimonials"],
                ["📞", "Contact", "contact"],
                ["🎓", "Internship", "internship"]
              ].map(([ic, l, id]) => {
                const active = isActive(l);
                return (
                  <div
                    key={id}
                    onClick={() => {
                      handleNavClick(l);
                      setSidebarOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 13,
                      padding: "13px 22px",
                      fontSize: 15,
                      fontWeight: active ? 700 : 600,
                      cursor: "pointer",
                      borderBottom: `1px solid ${C.border}`,
                      transition: "all 0.22s",
                      position: "relative",
                      overflow: "hidden",
                      color: active ? "#00e5ff" : C.muted,
                      background: active ? "linear-gradient(90deg, rgba(0,229,255,0.1) 0%, transparent 100%)" : "transparent",
                      borderLeft: active ? `3px solid #00e5ff` : "3px solid transparent"
                    }}
                  >
                    <span style={{ fontSize: 21, width: 30, textAlign: "center", flexShrink: 0 }}>{ic}</span>
                    <span style={{ color: active ? "#00e5ff" : C.text, fontSize: 14.5 }}>{l}</span>
                    {active && (
                      <span style={{ marginLeft: "auto", color: "#00e5ff", fontSize: 11 }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              padding: "14px 22px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8
            }}>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[
                  { icon: "github", color: "#c9d1d9", url: "https://github.com/codingworld" },
                  { icon: "linkedin", color: "#0a66c2", url: "https://linkedin.com/in/codingworld" },
                  { icon: "whatsapp", color: "#25d366", url: "https://wa.me/9779824380896" },
                  { icon: "instagram", color: "#e1306c", url: "https://instagram.com/codingworld" }
                ].map(s => (
                  <a
                    key={s.icon}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: 33,
                      height: 33,
                      borderRadius: 9,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: C.glass,
                      textDecoration: "none",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = s.color + "99";
                      e.currentTarget.style.background = s.color + "22";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.background = C.glass;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <SocialIcon icon={s.icon} s={14} c={s.color} />
                  </a>
                ))}
              </div>
              <DarkToggle />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dnav { display: none !important; }
          .mhbr { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// Rest of the SVG components remain the same...
function SocialIcon({ icon, s = 19, c = "currentColor" }) {
  if (icon === "github") return <GithubSVG s={s} c={c} />;
  if (icon === "linkedin") return <LinkedinSVG s={s} c={c} />;
  if (icon === "whatsapp") return <WhatsappSVG s={s} c={c} />;
  if (icon === "instagram") return <InstagramSVG s={s} c={c} />;
  return null;
}

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