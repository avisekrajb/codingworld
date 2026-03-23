import { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

// SVG Icons for features
const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3 6-6 3 3-6 6z" />
    <path d="M16.5 11.5L21 7l-4-4-4.5 4.5" />
  </svg>
);

const SecurityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const MobileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.23 4.29 2.5 2.5 0 0 0 3.3 2.27 2.5 2.5 0 0 0 3.3-2.27 2.5 2.5 0 0 0 1.23-4.29 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5z" />
    <path d="M8 12v5" />
    <path d="M16 12v5" />
    <path d="M12 17v3" />
  </svg>
);

const SpeedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4" />
    <path d="M12 22v-4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M19.07 19.07l-2.83-2.83" />
    <path d="M2 12h4" />
    <path d="M22 12h-4" />
    <path d="M7.5 7.5l2 2" />
    <path d="M16.5 16.5l-2-2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PaletteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14z" />
    <path d="M2 12h14" />
  </svg>
);

const TestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.07.09A10 10 0 0 0 12 18a10 10 0 0 0 6.26-2.22zM16.5 9.4V6a4.5 4.5 0 1 0-9 0v3.4" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default function ServicesPage({ dark, C }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
    satisfaction: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const statsRef = useRef(null);
  const whyChooseRef = useRef(null);

  // Why Choose Us data for carousel
  const whyChooseData = [
    {
      icon: <RocketIcon />,
      title: 'Lightning Fast Delivery',
      desc: 'Agile methodology ensures quick turnaround without compromising quality. Most projects delivered in 2-4 weeks.',
      color: '#00e5ff',
      stats: '2-4 weeks average'
    },
    {
      icon: <SecurityIcon />,
      title: 'Enterprise-Grade Security',
      desc: 'Bank-level security with regular audits, penetration testing, and GDPR compliance. Your data is always safe.',
      color: '#bf5fff',
      stats: '100% secure'
    },
    {
      icon: <ClockIcon />,
      title: '24/7 Premium Support',
      desc: 'Round-the-clock assistance from our dedicated support team. Average response time under 1 hour.',
      color: '#00ffb3',
      stats: '< 1hr response'
    },
    {
      icon: <UsersIcon />,
      title: 'Elite Development Team',
      desc: 'Senior developers with 8+ years of experience. Each team member is a specialist in their domain.',
      color: '#ff9d00',
      stats: '8+ years exp'
    },
    {
      icon: <AwardIcon />,
      title: 'Award-Winning Excellence',
      desc: 'Recognized by Clutch, GoodFirms, and TopDevelopers for outstanding web development services.',
      color: '#ff6b6b',
      stats: '15+ awards'
    },
    {
      icon: <GlobeIcon />,
      title: 'Global Client Base',
      desc: 'Proudly serving clients from 25+ countries across North America, Europe, Asia, and Australia.',
      color: '#ffd700',
      stats: '25+ countries'
    },
    {
      icon: <BrainIcon />,
      title: 'AI-Powered Solutions',
      desc: 'Leverage cutting-edge AI and machine learning to automate processes and gain valuable insights.',
      color: '#00e5ff',
      stats: 'ML/AI ready'
    },
    {
      icon: <SpeedIcon />,
      title: 'Performance Optimized',
      desc: 'Lightning fast load times with 95+ PageSpeed scores. Optimized for Core Web Vitals.',
      color: '#bf5fff',
      stats: '95+ score'
    },
    {
      icon: <PaletteIcon />,
      title: 'Creative Design',
      desc: 'Award-winning UI/UX designers create stunning, user-centered interfaces that convert.',
      color: '#00ffb3',
      stats: '100+ designs'
    },
    {
      icon: <TestIcon />,
      title: 'Quality Assurance',
      desc: 'Comprehensive testing including unit, integration, E2E, and performance testing. 99.9% bug-free.',
      color: '#ff9d00',
      stats: '99.9% quality'
    },
    {
      icon: <ChatIcon />,
      title: 'Dedicated Communication',
      desc: 'Daily standups, weekly reports, and transparent communication via Slack, Zoom, or Teams.',
      color: '#ff6b6b',
      stats: '24/7 available'
    },
    {
      icon: <SettingsIcon />,
      title: 'Maintenance & Support',
      desc: 'Post-launch maintenance, updates, and technical support to keep your application running smoothly.',
      color: '#ffd700',
      stats: '6 months free'
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Data-Driven Insights',
      desc: 'Advanced analytics and reporting to track user behavior and optimize conversion rates.',
      color: '#00e5ff',
      stats: 'real-time'
    }
  ];

  // Auto-slide for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % whyChooseData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [whyChooseData.length]);

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
        // Swipe left - next slide
        setCurrentSlide((prev) => (prev + 1) % whyChooseData.length);
      } else {
        // Swipe right - prev slide
        setCurrentSlide((prev) => (prev - 1 + whyChooseData.length) % whyChooseData.length);
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateStats();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = { projects: 150, clients: 200, experience: 5, satisfaction: 99 };
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        projects: Math.min(Math.floor((targets.projects / steps) * currentStep), targets.projects),
        clients: Math.min(Math.floor((targets.clients / steps) * currentStep), targets.clients),
        experience: Math.min(Math.floor((targets.experience / steps) * currentStep), targets.experience),
        satisfaction: Math.min(Math.floor((targets.satisfaction / steps) * currentStep), targets.satisfaction)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  // Filter categories
  const categories = [
    { id: 'all', name: 'All Services', icon: '🔮' },
    { id: 'development', name: 'Development', icon: '💻' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  // Map services to categories
  const getServiceCategory = (title) => {
    const devKeywords = ['Web', 'Mobile', 'API', 'Database', 'Cloud'];
    const designKeywords = ['UI', 'UX', 'Design'];
    const marketingKeywords = ['SEO', 'Analytics', 'E-Commerce'];
    const securityKeywords = ['Security', 'Cyber'];

    if (devKeywords.some(k => title.includes(k))) return 'development';
    if (designKeywords.some(k => title.includes(k))) return 'design';
    if (marketingKeywords.some(k => title.includes(k))) return 'marketing';
    if (securityKeywords.some(k => title.includes(k))) return 'security';
    return 'development';
  };

  const filteredServices = activeFilter === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => getServiceCategory(s.title) === activeFilter);

  // Get icon for service
  const getServiceIcon = (title) => {
    const iconMap = {
      'Web': '💻',
      'Mobile': '📱',
      'UI': '🎨',
      'UX': '🖌️',
      'E-Commerce': '🛒',
      'API': '🔌',
      'SEO': '📊',
      'Security': '🔒',
      'Cloud': '☁️',
      'AI': '🤖',
      'Database': '🗄️',
      'Analytics': '📈'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (title.includes(key)) return icon;
    }
    return '⚡';
  };

  // Get 3 key points for each service
  const getServiceHighlights = (title) => {
    const highlights = {
      'Web Development': ['Responsive Design', 'SEO Optimized', 'Fast Loading'],
      'Mobile Apps': ['Cross-platform', 'Native Performance', 'Offline Support'],
      'UI/UX Design': ['User Research', 'Wireframing', 'Prototyping'],
      'E-Commerce': ['Payment Gateway', 'Inventory Management', 'Analytics'],
      'API Integration': ['REST/GraphQL', 'Third-party APIs', 'Webhooks'],
      'SEO & Performance': ['Page Speed', 'Keyword Ranking', 'Core Web Vitals'],
      'Cyber Security': ['Penetration Testing', 'SSL/TLS', 'DDoS Protection'],
      'Cloud & DevOps': ['CI/CD Pipeline', 'Auto-scaling', 'Monitoring'],
      'AI & Automation': ['Machine Learning', 'Chatbots', 'Process Automation'],
      'Database Mgmt': ['Optimization', 'Backup & Recovery', 'Data Migration'],
      'Analytics & BI': ['Custom Dashboards', 'Data Visualization', 'Reporting']
    };
    return highlights[title] || ['Expert Team', 'Quality Assured', 'Timely Delivery'];
  };

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedService(null);
  };

  const handleConsultation = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section with Particles */}
      <section style={{
        position: 'relative',
        padding: "80px 5% 100px",
        background: dark 
          ? 'radial-gradient(circle at 20% 30%, #00e5ff10, transparent 50%), radial-gradient(circle at 80% 70%, #bf5fff10, transparent 50%)'
          : 'radial-gradient(circle at 20% 30%, #00e5ff08, transparent 50%), radial-gradient(circle at 80% 70%, #bf5fff08, transparent 50%)',
        overflow: 'hidden'
      }}>
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              borderRadius: '50%',
              background: `rgba(0, 229, 255, ${Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(0,229,255,0.12)",
              border: "1px solid rgba(0,229,255,0.35)",
              color: "#00e5ff",
              borderRadius: 30,
              padding: "8px 20px",
              fontSize: 13,
              fontFamily: "'Space Mono',monospace",
              letterSpacing: 1,
              marginBottom: 20,
              backdropFilter: 'blur(10px)',
              animation: 'pulse 2s ease infinite'
            }}>
              ✨ PREMIUM SERVICES ✨
            </span>
            
            <h1 style={{
              fontSize: "clamp(2.5rem,6vw,4.5rem)",
              fontWeight: 900,
              color: C.text,
              marginBottom: 20,
              lineHeight: 1.2,
              textShadow: dark ? '0 0 30px #00e5ff40' : 'none'
            }}>
              Transform Your <span style={{ 
                color: "#00e5ff",
                background: 'linear-gradient(135deg, #00e5ff, #bf5fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Digital Presence</span>
            </h1>
            
            <p style={{
              fontSize: "clamp(1rem,2vw,1.2rem)",
              color: C.muted,
              maxWidth: 700,
              margin: "0 auto 30px",
              lineHeight: 1.8
            }}>
              From concept to deployment, we deliver cutting-edge solutions that drive growth, 
              enhance user experience, and maximize your ROI.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
                className="shine"
                style={{
                  background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                  border: 'none',
                  borderRadius: 30,
                  padding: '14px 32px',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#07071a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px #00e5ff44'
                }}
              >
                <ZapIcon />
                Explore Services
              </button>
              <button
                onClick={handleConsultation}
                style={{
                  background: 'transparent',
                  border: `2px solid #00e5ff`,
                  borderRadius: 30,
                  padding: '14px 32px',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#00e5ff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00e5ff';
                  e.currentTarget.style.color = '#07071a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#00e5ff';
                }}
              >
                <HeartIcon />
                Get Free Consultation
              </button>
            </div>
          </div>

          {/* Stats Counter */}
          <div ref={statsRef} style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            flexWrap: 'wrap',
            marginTop: 50,
            padding: '30px',
            background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderRadius: 30,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${C.border}`
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#00e5ff' }}>{stats.projects}+</div>
              <div style={{ fontSize: 13, color: C.muted }}>Projects Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#bf5fff' }}>{stats.clients}+</div>
              <div style={{ fontSize: 13, color: C.muted }}>Happy Clients</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#00ffb3' }}>{stats.experience}+</div>
              <div style={{ fontSize: 13, color: C.muted }}>Years Experience</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#ff9d00' }}>{stats.satisfaction}%</div>
              <div style={{ fontSize: 13, color: C.muted }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section style={{ padding: '40px 5% 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 30
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 30,
                  border: activeFilter === cat.id ? 'none' : `1px solid ${C.border}`,
                  background: activeFilter === cat.id 
                    ? 'linear-gradient(135deg,#00e5ff,#0095ff)'
                    : 'transparent',
                  color: activeFilter === cat.id ? '#07071a' : C.muted,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s'
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services-grid" style={{ padding: '20px 5% 60px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 25
          }}>
            {filteredServices.map((service, index) => {
              const isHovered = hoveredCard === index;
              const serviceIcon = getServiceIcon(service.title);
              const highlights = getServiceHighlights(service.title);

              return (
                <div
                  key={index}
                  className="service-card"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position: 'relative',
                    background: C.card,
                    border: `1px solid ${isHovered ? '#00e5ff' : C.border}`,
                    borderRadius: 24,
                    padding: '32px 24px',
                    transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    cursor: 'default',
                    transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered ? `0 30px 60px ${dark ? '#00e5ff20' : '#00e5ff15'}` : 'none',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background Glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle at 70% 30%, ${isHovered ? '#00e5ff20' : 'transparent'}, transparent 70%)`,
                    transition: 'all 0.4s',
                    pointerEvents: 'none'
                  }} />

                  {/* Icon with Animation */}
                  <div style={{
                    position: 'relative',
                    width: 70,
                    height: 70,
                    borderRadius: 20,
                    background: `linear-gradient(135deg, ${isHovered ? '#00e5ff' : '#00e5ff20'}, ${isHovered ? '#bf5fff' : '#bf5fff20'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    marginBottom: 20,
                    color: isHovered ? '#07071a' : '#00e5ff',
                    transition: 'all 0.3s',
                    transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0) scale(1)'
                  }}>
                    {serviceIcon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: C.text,
                    marginBottom: 10,
                    transition: 'all 0.3s'
                  }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: C.muted,
                    fontSize: 14,
                    lineHeight: 1.8,
                    marginBottom: 20
                  }}>
                    {service.desc}
                  </p>

                  {/* 3 Key Points */}
                  <div style={{
                    marginBottom: 20,
                    padding: '15px',
                    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 12,
                    border: `1px solid ${isHovered ? '#00e5ff20' : C.border}`
                  }}>
                    {highlights.map((point, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: i < 2 ? 8 : 0,
                          color: isHovered ? '#00e5ff' : C.text
                        }}
                      >
                        <CheckIcon />
                        <span style={{ fontSize: 13 }}>{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features Tags */}
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 20
                  }}>
                    {['Fast', 'Secure', 'Scalable'].map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          background: isHovered ? '#00e5ff20' : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${isHovered ? '#00e5ff44' : C.border}`,
                          color: isHovered ? '#00e5ff' : C.muted,
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <button
                    onClick={() => handleLearnMore(service)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      color: isHovered ? '#00e5ff' : C.muted,
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  {/* Corner Decoration */}
                  <div style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    fontSize: 48,
                    opacity: isHovered ? 0.1 : 0.05,
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.3s'
                  }}>
                    {serviceIcon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Sliding Carousel */}
      <section ref={whyChooseRef} style={{
        padding: '80px 5%',
        background: dark ? 'linear-gradient(135deg, #07071a, #0a0a1e)' : 'linear-gradient(135deg, #f8f8ff, #f0f0fa)',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{
              fontSize: "clamp(2rem,5vw,3rem)",
              fontWeight: 800,
              color: C.text,
              marginBottom: 15
            }}>
              Why <span style={{ color: "#00e5ff" }}>Choose Us</span>
            </h2>
            <p style={{ color: C.muted, maxWidth: 600, margin: '0 auto' }}>
              Discover what makes us the preferred partner for businesses worldwide
            </p>
          </div>

          {/* Carousel Container */}
          <div
            style={{
              position: 'relative',
              maxWidth: 800,
              margin: '0 auto',
              touchAction: 'pan-y'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Card */}
            <div
              key={currentSlide}
              style={{
                background: C.card,
                border: `1px solid ${whyChooseData[currentSlide].color}44`,
                borderRadius: 30,
                padding: '40px',
                boxShadow: `0 20px 40px ${whyChooseData[currentSlide].color}20`,
                animation: 'slideIn 0.5s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginBottom: 25,
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: `${whyChooseData[currentSlide].color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: whyChooseData[currentSlide].color
                }}>
                  {whyChooseData[currentSlide].icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: C.text,
                    marginBottom: 5
                  }}>
                    {whyChooseData[currentSlide].title}
                  </h3>
                  <span style={{
                    background: `${whyChooseData[currentSlide].color}20`,
                    color: whyChooseData[currentSlide].color,
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {whyChooseData[currentSlide].stats}
                  </span>
                </div>
              </div>

              <p style={{
                color: C.muted,
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 30
              }}>
                {whyChooseData[currentSlide].desc}
              </p>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: 4,
                background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${((currentSlide + 1) / whyChooseData.length) * 100}%`,
                    height: '100%',
                    background: whyChooseData[currentSlide].color,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + whyChooseData.length) % whyChooseData.length)}
              style={{
                position: 'absolute',
                left: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: C.card,
                border: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: C.text,
                transition: 'all 0.3s',
                zIndex: 10
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#00e5ff';
                e.currentTarget.style.color = '#07071a';
                e.currentTarget.style.borderColor = '#00e5ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.card;
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <ArrowLeftIcon />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % whyChooseData.length)}
              style={{
                position: 'absolute',
                right: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: C.card,
                border: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: C.text,
                transition: 'all 0.3s',
                zIndex: 10
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#00e5ff';
                e.currentTarget.style.color = '#07071a';
                e.currentTarget.style.borderColor = '#00e5ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.card;
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <ArrowRightIcon />
            </button>

            {/* Dots Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginTop: 20
            }}>
              {whyChooseData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: index === currentSlide ? 24 : 10,
                    height: 10,
                    borderRadius: 5,
                    background: index === currentSlide ? whyChooseData[index].color : 'rgba(128,128,180,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies We Use */}
      <section style={{ padding: '60px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            fontWeight: 800,
            color: C.text,
            textAlign: 'center',
            marginBottom: 40
          }}>
            Technologies <span style={{ color: "#bf5fff" }}>We Master</span>
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 30,
            flexWrap: 'wrap',
            marginBottom: 30
          }}>
            {[
              { name: 'React', icon: '⚛️', color: '#61dafb' },
              { name: 'Node.js', icon: '🟢', color: '#68a063' },
              { name: 'Python', icon: '🐍', color: '#306998' },
              { name: 'MongoDB', icon: '🍃', color: '#4DB33D' },
              { name: 'AWS', icon: '☁️', color: '#FF9900' },
              { name: 'Docker', icon: '🐳', color: '#2496ED' }
            ].map(tech => (
              <div
                key={tech.name}
                style={{
                  padding: '10px 20px',
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 40,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = tech.color;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${tech.color}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 24 }}>{tech.icon}</span>
                <span style={{ color: C.text, fontWeight: 600 }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 5% 80px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          background: `linear-gradient(135deg, ${dark ? '#00e5ff10' : '#00e5ff05'}, ${dark ? '#bf5fff10' : '#bf5fff05'})`,
          border: `1px solid #00e5ff33`,
          borderRadius: 40,
          padding: '50px 30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Circles */}
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00e5ff20, transparent 70%)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #bf5fff20, transparent 70%)'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
            <h3 style={{
              fontSize: "clamp(1.8rem,4vw,2.5rem)",
              fontWeight: 800,
              color: C.text,
              marginBottom: 15
            }}>
              Ready to Start Your Project?
            </h3>
            <p style={{ color: C.muted, maxWidth: 500, margin: '0 auto 30px', fontSize: 15, lineHeight: 1.8 }}>
              Let's discuss how we can help transform your ideas into reality. 
              Get a free consultation and estimate today!
            </p>
            <button
              onClick={handleConsultation}
              style={{
                background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                border: 'none',
                borderRadius: 40,
                padding: '16px 40px',
                fontWeight: 700,
                fontSize: 16,
                color: '#07071a',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 10px 30px #00e5ff44'
              }}
            >
              Get Free Consultation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {showDetails && selectedService && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleCloseDetails}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)'
          }} />
          
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 600,
              width: '100%',
              background: dark ? '#0d0d28' : '#f8f8ff',
              border: '1px solid #00e5ff',
              borderRadius: 30,
              padding: 40,
              animation: 'modalPop 0.3s ease'
            }}
          >
            <button
              onClick={handleCloseDetails}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: C.muted
              }}
            >
              ×
            </button>

            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg,#00e5ff,#bf5fff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              marginBottom: 20
            }}>
              {getServiceIcon(selectedService.title)}
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 10 }}>
              {selectedService.title}
            </h2>

            <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.8, marginBottom: 25 }}>
              {selectedService.desc}
            </p>

            <div style={{
              background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: 20,
              padding: 25,
              marginBottom: 25
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 15 }}>
                Key Features:
              </h3>
              {getServiceHighlights(selectedService.title).map((point, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 12,
                    color: C.text
                  }}
                >
                  <CheckIcon />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                handleCloseDetails();
                handleConsultation();
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                border: 'none',
                borderRadius: 15,
                padding: '15px',
                fontWeight: 700,
                fontSize: 16,
                color: '#07071a',
                cursor: 'pointer'
              }}
            >
              Get Started with {selectedService.title}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(10px) translateX(-10px); }
          75% { transform: translateY(-10px) translateX(20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .service-card {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .service-card:nth-child(1) { animation-delay: 0.1s; }
        .service-card:nth-child(2) { animation-delay: 0.2s; }
        .service-card:nth-child(3) { animation-delay: 0.3s; }
        .service-card:nth-child(4) { animation-delay: 0.4s; }
        .service-card:nth-child(5) { animation-delay: 0.5s; }
        .service-card:nth-child(6) { animation-delay: 0.6s; }
        .service-card:nth-child(7) { animation-delay: 0.7s; }
        .service-card:nth-child(8) { animation-delay: 0.8s; }
        .service-card:nth-child(9) { animation-delay: 0.9s; }
        .service-card:nth-child(10) { animation-delay: 1s; }
        .service-card:nth-child(11) { animation-delay: 1.1s; }
        .service-card:nth-child(12) { animation-delay: 1.2s; }

        @media (max-width: 768px) {
          button[style*="left: -50px"] {
            left: 10px !important;
          }
          button[style*="right: -50px"] {
            right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}