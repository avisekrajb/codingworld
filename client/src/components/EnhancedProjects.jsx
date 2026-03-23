import { useState, useEffect } from 'react';
import { PROJECTS } from '../utils/constants';
import ProjectModal from './ProjectModal';

// Technology icons with their display names and colors (expanded to 30+)
const TECH_ICONS = [
  { name: "React", icon: "⚛️", color: "#61DAFB", category: "frontend" },
  { name: "Node.js", icon: "🟢", color: "#68A063", category: "backend" },
  { name: "MongoDB", icon: "🍃", color: "#4DB33D", category: "database" },
  { name: "React Native", icon: "📱", color: "#61DAFB", category: "mobile" },
  { name: "Firebase", icon: "🔥", color: "#FFCA28", category: "backend" },
  { name: "Maps API", icon: "🗺️", color: "#4285F4", category: "api" },
  { name: "Next.js", icon: "▲", color: "#000000", category: "frontend" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791", category: "database" },
  { name: "Stripe", icon: "💳", color: "#635BFF", category: "payment" },
  { name: "Express", icon: "🚂", color: "#68A063", category: "backend" },
  { name: "MySQL", icon: "🐬", color: "#4479A1", category: "database" },
  { name: "Vue.js", icon: "🟩", color: "#4FC08D", category: "frontend" },
  { name: "Laravel", icon: "⚙️", color: "#FF2D20", category: "backend" },
  { name: "AWS", icon: "☁️", color: "#FF9900", category: "cloud" },
  { name: "Chart.js", icon: "📊", color: "#FF6384", category: "visualization" },
  { name: "SQLite", icon: "🗄️", color: "#003B57", category: "database" },
  { name: "Docker", icon: "🐳", color: "#2496ED", category: "devops" },
  { name: "Kubernetes", icon: "☸️", color: "#326CE5", category: "devops" },
  { name: "GraphQL", icon: "◭", color: "#E10098", category: "api" },
  { name: "TypeScript", icon: "🔷", color: "#3178C6", category: "language" },
  { name: "Python", icon: "🐍", color: "#3776AB", category: "language" },
  { name: "Django", icon: "🎸", color: "#092E20", category: "backend" },
  { name: "Flask", icon: "🌶️", color: "#000000", category: "backend" },
  { name: "Redis", icon: "⚡", color: "#DC382D", category: "database" },
  { name: "Elasticsearch", icon: "🔍", color: "#005571", category: "search" },
  { name: "Kafka", icon: "📨", color: "#231F20", category: "messaging" },
  { name: "RabbitMQ", icon: "🐇", color: "#FF6600", category: "messaging" },
  { name: "Jenkins", icon: "🤖", color: "#D24939", category: "devops" },
  { name: "GitHub Actions", icon: "⚙️", color: "#2088FF", category: "devops" },
  { name: "Tailwind", icon: "🌊", color: "#06B6D4", category: "css" },
  { name: "Bootstrap", icon: "🅱️", color: "#7952B3", category: "css" },
  { name: "Material UI", icon: "🎨", color: "#007FFF", category: "css" },
  { name: "Figma", icon: "🎯", color: "#F24E1E", category: "design" },
  { name: "Adobe XD", icon: "✨", color: "#FF61F6", category: "design" },
  { name: "Webpack", icon: "📦", color: "#8DD6F9", category: "build" },
  { name: "Vite", icon: "⚡", color: "#646CFF", category: "build" },
  { name: "Jest", icon: "🃏", color: "#C21325", category: "testing" },
  { name: "Cypress", icon: "🌲", color: "#17202C", category: "testing" },
  { name: "Storybook", icon: "📕", color: "#FF4785", category: "documentation" }
];

// Project images array (multiple images per project)
const PROJECT_IMAGE_SETS = [
  [
    "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
    "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=800"
  ],
  [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800",
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800"
  ],
  [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800"
  ],
  [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
    "https://images.unsplash.com/photo-1554224154-26032dfc0d?w=800"
  ],
  [
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
    "https://images.unsplash.com/photo-1556155092-1234?w=800",
    "https://images.unsplash.com/photo-1556155092-5678?w=800"
  ],
  [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
    "https://images.unsplash.com/photo-1556761175-1234?w=800",
    "https://images.unsplash.com/photo-1556761175-5678?w=800"
  ]
];

// Extra features for projects
const EXTRA_FEATURES = [
  { icon: "🚀", text: "Lightning Fast Performance", color: "#00e5ff" },
  { icon: "🔒", text: "Enterprise Grade Security", color: "#bf5fff" },
  { icon: "📱", text: "Fully Responsive Design", color: "#00ffb3" },
  { icon: "🎨", text: "Modern UI/UX", color: "#ff9d00" },
  { icon: "⚡", text: "Real-time Updates", color: "#ff6b6b" },
  { icon: "📊", text: "Advanced Analytics", color: "#ffd700" },
  { icon: "🤖", text: "AI-Powered Features", color: "#00e5ff" },
  { icon: "☁️", text: "Cloud Native", color: "#bf5fff" },
  { icon: "🔄", text: "CI/CD Pipeline", color: "#00ffb3" },
  { icon: "📈", text: "Scalable Architecture", color: "#ff9d00" },
  { icon: "🔔", text: "Push Notifications", color: "#ff6b6b" },
  { icon: "💳", text: "Payment Integration", color: "#ffd700" },
  { icon: "🗺️", text: "Maps & Location", color: "#00e5ff" },
  { icon: "📦", text: "Offline Support", color: "#bf5fff" },
  { icon: "🌐", text: "Multi-language", color: "#00ffb3" },
  { icon: "🎯", text: "SEO Optimized", color: "#ff9d00" }
];

// Sliding Thumbnail Component
function SlidingThumbnails({ images, color, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setDirection(prev => prev === 'right' ? 'left' : 'right');
        setCurrentIndex(prev => (prev + 1) % images.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: index === currentIndex ? 1 : 0,
            transform: `translateX(${index === currentIndex ? 0 : direction === 'right' ? '100%' : '-100%'})`,
            transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            zIndex: index === currentIndex ? 2 : 1
          }}
        >
          <img
            src={img}
            alt={`${title} - ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>
      ))}

      {/* Navigation Dots */}
      <div style={{
        position: "absolute",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 6,
        zIndex: 3
      }}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: index === currentIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: index === currentIndex ? color : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0
            }}
          />
        ))}
      </div>

      {/* Direction Indicators */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 10,
        right: 10,
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "space-between",
        zIndex: 3,
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s"
      }}>
        <button
          onClick={() => {
            setDirection('left');
            setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16
          }}
        >
          ←
        </button>
        <button
          onClick={() => {
            setDirection('right');
            setCurrentIndex(prev => (prev + 1) % images.length);
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

// Animated Tech Icons Bar
function AnimatedTechIcons({ tags, color }) {
  const [icons, setIcons] = useState([]);
  const [direction, setDirection] = useState('right');

  useEffect(() => {
    // Get icons for the project's tags
    const projectIcons = tags
      .map(tag => TECH_ICONS.find(tech => tech.name === tag))
      .filter(Boolean);

    // Add random tech icons
    const otherIcons = TECH_ICONS
      .filter(tech => !tags.includes(tech.name))
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);

    setIcons([...projectIcons, ...otherIcons]);

    const interval = setInterval(() => {
      setDirection(prev => prev === 'right' ? 'left' : 'right');
      setIcons(prev => {
        const newIcons = [...prev];
        if (direction === 'right') {
          const first = newIcons.shift();
          newIcons.push(first);
        } else {
          const last = newIcons.pop();
          newIcons.unshift(last);
        }
        return newIcons;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [tags, direction]);

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      gap: 8,
      padding: "12px 15px",
      background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
      backdropFilter: "blur(5px)",
      zIndex: 5,
      overflow: "hidden"
    }}>
      {icons.map((tech, index) => (
        <div
          key={`${tech.name}-${index}`}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${tech.color}20`,
            border: `1.5px solid ${tech.color}80`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: tech.color,
            animation: `float ${3 + index * 0.2}s ease-in-out infinite`,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: `0 4px 12px ${tech.color}40`,
            cursor: "pointer",
            position: "relative",
            flexShrink: 0
          }}
          title={tech.name}
        >
          {tech.icon}
          <div style={{
            position: "absolute",
            bottom: -25,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#000",
            color: "#fff",
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            opacity: 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
            zIndex: 10
          }}>
            {tech.name}
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats Counter Component (Optional - can be shown/hidden based on prop)
function StatsCounter({ show = false }) {
  const [stats, setStats] = useState([
    { label: "Projects Delivered", value: 0, target: 50, icon: "🚀", color: "#00e5ff" },
    { label: "Technologies Used", value: 0, target: 45, icon: "⚡", color: "#bf5fff" },
    { label: "Happy Clients", value: 0, target: 40, icon: "🤝", color: "#00ffb3" },
    { label: "Lines of Code", value: 0, target: 500, icon: "📝", suffix: "K+", color: "#ff9d00" }
  ]);

  useEffect(() => {
    if (!show) return;
    
    const timers = stats.map((stat, index) => {
      return setInterval(() => {
        setStats(prev => {
          const newStats = [...prev];
          if (newStats[index].value < newStats[index].target) {
            newStats[index].value = Math.min(
              newStats[index].value + Math.ceil(newStats[index].target / 50),
              newStats[index].target
            );
          }
          return newStats;
        });
      }, 30);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [show]);

  if (!show) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: 20,
      marginBottom: 30
    }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            background: "linear-gradient(135deg, #ffffff10, #00000005)",
            border: "1px solid #00e5ff20",
            borderRadius: 16,
            padding: "20px 15px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            transition: "transform 0.3s",
            cursor: "pointer"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>{stat.icon}</div>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            color: stat.color,
            textShadow: `0 0 20px ${stat.color}80`
          }}>
            {stat.value}{stat.suffix || ""}
          </div>
          <div style={{ fontSize: 12, color: "#7878a8", fontWeight: 500 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Feature Slider Component (Optional)
function FeatureSlider({ show = false }) {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  useEffect(() => {
    if (!show) return;
    
    const timer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % EXTRA_FEATURES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 15,
      background: "linear-gradient(135deg, #00e5ff10, #bf5fff10)",
      border: "1px solid #00e5ff30",
      borderRadius: 50,
      padding: "8px 20px",
      marginBottom: 30,
      maxWidth: 600,
      margin: "0 auto 30px",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{
        width: 45,
        height: 45,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${EXTRA_FEATURES[currentFeature].color}, ${EXTRA_FEATURES[currentFeature].color}80)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        color: "#07071a",
        animation: "pulse 2s ease infinite"
      }}>
        {EXTRA_FEATURES[currentFeature].icon}
      </div>
      <div style={{
        flex: 1,
        fontSize: 15,
        fontWeight: 600,
        color: EXTRA_FEATURES[currentFeature].color,
        animation: "fadeSlide 0.5s ease"
      }}>
        {EXTRA_FEATURES[currentFeature].text}
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        {EXTRA_FEATURES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentFeature ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === currentFeature ? "#00e5ff" : "#cbd5e0",
              transition: "all 0.3s"
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EnhancedProjects({ dark, C, isHomePage = false }) {
  const [filter, setFilter] = useState("All");
  const [projPage, setProjPage] = useState(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const allTags = ["All", ...new Set(PROJECTS.flatMap(p => p.tags))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));
  
  // Show fewer projects on home page
  const CARDS_PER = isHomePage ? 4 : 6;
  const totalPages = Math.ceil(filtered.length / CARDS_PER);
  const pageCards = filtered.slice(projPage * CARDS_PER, (projPage + 1) * CARDS_PER);

  const handleViewAll = () => {
    window.location.href = '/projects';
  };

  return (
    <>
      <section id="projects" style={{
        padding: isHomePage ? "60px 5%" : "120px 5% 90px",
        background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,200,0.025)"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: isHomePage ? 30 : 40 }}>
            <span style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #bf5fff20, #00e5ff20)",
              border: `1px solid #bf5fff80`,
              color: "#bf5fff",
              borderRadius: 30,
              padding: isHomePage ? "6px 20px" : "8px 24px",
              fontSize: isHomePage ? 12 : 13,
              fontFamily: "'Space Mono',monospace",
              letterSpacing: 2,
              marginBottom: isHomePage ? 10 : 15,
              backdropFilter: "blur(10px)"
            }}>
              🚀 {isHomePage ? 'FEATURED WORK' : 'PORTFOLIO SHOWCASE 2025'}
            </span>
            
            <h2 style={{
              fontSize: isHomePage ? "clamp(2rem,5vw,2.8rem)" : "clamp(2.5rem,7vw,4rem)",
              fontWeight: 900,
              marginTop: 10,
              letterSpacing: "-2px",
              color: C.text,
              lineHeight: 1.2
            }}>
              {isHomePage ? 'Recent ' : 'Our '}
              <span style={{ 
                color: "#bf5fff", 
                textShadow: "0 0 30px #bf5fff80",
                position: "relative"
              }}>
                Projects
                <span style={{
                  position: "absolute",
                  bottom: -5,
                  left: 0,
                  width: "100%",
                  height: 4,
                  background: "linear-gradient(90deg, transparent, #bf5fff, transparent)",
                  borderRadius: 2
                }} />
              </span>
            </h2>
            
            <p style={{ 
              color: C.muted, 
              fontSize: isHomePage ? 14 : 16, 
              maxWidth: 600, 
              margin: "15px auto 0",
              lineHeight: 1.8 
            }}>
              {isHomePage 
                ? 'Check out some of our latest work and success stories'
                : 'Real products, real impact — built with passion and cutting-edge technology'
              }
            </p>
          </div>

          {/* Stats Counter - Only show on projects page, not on home */}
          {!isHomePage && <StatsCounter show={!isHomePage} />}

          {/* Feature Slider - Only show on projects page */}
          {!isHomePage && <FeatureSlider show={!isHomePage} />}

          {/* Filter Buttons */}
          <div style={{
            display: "flex",
            gap: isHomePage ? 8 : 10,
            overflowX: "auto",
            paddingBottom: isHomePage ? 10 : 15,
            marginBottom: isHomePage ? 30 : 40,
            scrollbarWidth: "none",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            {allTags.slice(0, isHomePage ? 5 : allTags.length).map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setFilter(tag);
                  setProjPage(0);
                }}
                style={{
                  padding: isHomePage ? "6px 16px" : "8px 20px",
                  borderRadius: 30,
                  fontSize: isHomePage ? 12 : 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid",
                  fontFamily: "'Outfit',sans-serif",
                  whiteSpace: "nowrap",
                  background: filter === tag ? "linear-gradient(135deg,#bf5fff,#7b2fff)" : "transparent",
                  borderColor: filter === tag ? "#bf5fff" : C.border,
                  color: filter === tag ? "#fff" : C.muted,
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: filter === tag ? "scale(1.05)" : "scale(1)",
                  boxShadow: filter === tag ? "0 4px 15px #bf5fff66" : "none",
                  backdropFilter: "blur(10px)"
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div
            key={`${filter}-${projPage}`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${isHomePage ? '300px' : '350px'}, 1fr))`,
              gap: isHomePage ? 20 : 25,
              animation: "fadeIn 0.4s ease"
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              @keyframes fadeSlide {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
              }
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>
            
            {pageCards.map((p, index) => (
              <div
                key={p.title}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: isHomePage ? 20 : 24,
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  cursor: "pointer",
                  position: "relative",
                  animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
                  transform: hoveredProject === p.title ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                  boxShadow: hoveredProject === p.title ? `0 25px 50px ${p.color}40` : "0 10px 30px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={() => setHoveredProject(p.title)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Image Container with Sliding Thumbnails */}
                <div style={{
                  height: isHomePage ? 180 : 200,
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <SlidingThumbnails 
                    images={PROJECT_IMAGE_SETS[index % PROJECT_IMAGE_SETS.length]} 
                    color={p.color}
                    title={p.title}
                  />

                  {/* LIVE Badge */}
                  <div style={{
                    position: "absolute",
                    top: isHomePage ? 10 : 12,
                    right: isHomePage ? 10 : 12,
                    background: "linear-gradient(135deg, #ff6b6b, #ff4444)",
                    border: "none",
                    borderRadius: 20,
                    padding: isHomePage ? "3px 10px" : "4px 12px",
                    fontSize: isHomePage ? 9 : 10,
                    fontWeight: 800,
                    color: "#fff",
                    fontFamily: "'Space Mono',monospace",
                    boxShadow: "0 4px 15px #ff6b6b80",
                    zIndex: 6,
                    animation: "pulse 2s ease infinite"
                  }}>
                    LIVE
                  </div>

                  {/* Project Icon */}
                  <div style={{
                    position: "absolute",
                    top: isHomePage ? 10 : 12,
                    left: isHomePage ? 10 : 12,
                    width: isHomePage ? 35 : 40,
                    height: isHomePage ? 35 : 40,
                    borderRadius: isHomePage ? 10 : 12,
                    background: `${p.color}40`,
                    backdropFilter: "blur(8px)",
                    border: `2px solid ${p.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isHomePage ? 18 : 20,
                    color: p.color,
                    zIndex: 6,
                    boxShadow: `0 4px 12px ${p.color}80`
                  }}>
                    {p.emoji}
                  </div>

                  {/* Animated Tech Icons */}
                  <AnimatedTechIcons tags={p.tags} color={p.color} />
                </div>

                {/* Content */}
                <div style={{ padding: isHomePage ? "15px" : "20px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isHomePage ? 8 : 10
                  }}>
                    <h3 style={{
                      fontSize: isHomePage ? 16 : 18,
                      fontWeight: 800,
                      color: C.text,
                      letterSpacing: "-0.5px"
                    }}>
                      {p.title}
                    </h3>
                    <span style={{
                      background: p.color + "20",
                      color: p.color,
                      fontSize: isHomePage ? 9 : 10,
                      padding: isHomePage ? "2px 8px" : "3px 10px",
                      borderRadius: 20,
                      fontWeight: 700,
                      border: `1px solid ${p.color}80`
                    }}>
                      v3.0
                    </span>
                  </div>
                  
                  <p style={{
                    color: C.muted,
                    fontSize: isHomePage ? 12 : 13,
                    lineHeight: 1.6,
                    marginBottom: isHomePage ? 12 : 15,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {p.desc}
                  </p>

                  {/* Tags */}
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: isHomePage ? 5 : 6,
                    marginBottom: isHomePage ? 12 : 15
                  }}>
                    {p.tags.slice(0, isHomePage ? 2 : 3).map(t => {
                      const tech = TECH_ICONS.find(tech => tech.name === t);
                      return (
                        <span
                          key={t}
                          style={{
                            background: p.color + "15",
                            border: `1px solid ${p.color}40`,
                            color: p.color,
                            borderRadius: 20,
                            padding: isHomePage ? "3px 8px" : "4px 10px",
                            fontSize: isHomePage ? 10 : 11,
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3
                          }}
                        >
                          {tech?.icon || "⚡"} {t}
                        </span>
                      );
                    })}
                    {p.tags.length > (isHomePage ? 2 : 3) && (
                      <span style={{
                        background: p.color + "10",
                        color: p.color,
                        padding: isHomePage ? "3px 8px" : "4px 10px",
                        borderRadius: 20,
                        fontSize: isHomePage ? 10 : 11,
                        fontWeight: 600
                      }}>
                        +{p.tags.length - (isHomePage ? 2 : 3)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: "flex",
                    gap: isHomePage ? 8 : 10,
                    alignItems: "center"
                  }}>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: isHomePage ? 4 : 6,
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}bb)`,
                        border: "none",
                        borderRadius: isHomePage ? 8 : 10,
                        padding: isHomePage ? "8px 16px" : "10px 20px",
                        fontWeight: 700,
                        fontSize: isHomePage ? 12 : 13,
                        color: "#07071a",
                        cursor: "pointer",
                        textDecoration: "none",
                        transition: "all 0.3s",
                        flex: 1,
                        justifyContent: "center",
                        boxShadow: `0 4px 12px ${p.color}80`
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = `0 6px 15px ${p.color}`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = `0 4px 12px ${p.color}80`;
                      }}
                    >
                      Preview <ExtSVG />
                    </a>
                    
                    <button
                      onClick={() => setSelectedProject(p)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${p.color}80`,
                        borderRadius: isHomePage ? 8 : 10,
                        padding: isHomePage ? "8px 12px" : "10px 15px",
                        color: p.color,
                        cursor: "pointer",
                        fontSize: isHomePage ? 12 : 13,
                        fontWeight: 600,
                        transition: "all 0.3s",
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = p.color + "20";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>

                {/* Shimmer Effect on Hover */}
                {hoveredProject === p.title && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease infinite",
                    pointerEvents: "none",
                    borderRadius: isHomePage ? 20 : 24,
                    zIndex: 10
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* View All Button (for home page) */}
          {isHomePage && (
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <button
                onClick={handleViewAll}
                style={{
                  background: "linear-gradient(135deg, #bf5fff, #7b2fff)",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 30px",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px #bf5fff80",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px #bf5fff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px #bf5fff80";
                }}
              >
                View All Projects →
              </button>
            </div>
          )}

          {/* Pagination - Only show on projects page */}
          {!isHomePage && totalPages > 1 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 40
            }}>
              <button
                onClick={() => setProjPage(p => Math.max(0, p - 1))}
                disabled={projPage === 0}
                style={{
                  background: projPage === 0 ? "transparent" : "linear-gradient(135deg,#bf5fff,#7b2fff)",
                  border: `1px solid ${projPage === 0 ? C.border : "transparent"}`,
                  borderRadius: 14,
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: projPage === 0 ? "default" : "pointer",
                  color: projPage === 0 ? C.muted : "#fff",
                  opacity: projPage === 0 ? 0.5 : 1,
                  transition: "all 0.3s",
                  fontSize: 20
                }}
              >
                ←
              </button>
              
              <div style={{ display: "flex", gap: 10 }}>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProjPage(i)}
                    style={{
                      width: i === projPage ? 45 : 40,
                      height: 40,
                      borderRadius: 10,
                      background: i === projPage ? "linear-gradient(135deg,#bf5fff,#7b2fff)" : "transparent",
                      border: `1px solid ${i === projPage ? "transparent" : C.border}`,
                      color: i === projPage ? "#fff" : C.muted,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      transform: i === projPage ? "scale(1.1)" : "scale(1)"
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setProjPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={projPage === totalPages - 1}
                style={{
                  background: projPage === totalPages - 1 ? "transparent" : "linear-gradient(135deg,#bf5fff,#7b2fff)",
                  border: `1px solid ${projPage === totalPages - 1 ? C.border : "transparent"}`,
                  borderRadius: 14,
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: projPage === totalPages - 1 ? "default" : "pointer",
                  color: projPage === totalPages - 1 ? C.muted : "#fff",
                  opacity: projPage === totalPages - 1 ? 0.5 : 1,
                  transition: "all 0.3s",
                  fontSize: 20
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          dark={dark}
          C={C}
          TECH_ICONS={TECH_ICONS}
          EXTRA_FEATURES={EXTRA_FEATURES}
        />
      )}
    </>
  );
}

const ExtSVG = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);