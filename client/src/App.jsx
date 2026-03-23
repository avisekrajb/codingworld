import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import PricingPage from './pages/PricingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import InternshipPage from './pages/InternshipPage';
import CareersPage from './pages/CareersPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AdminRoute from './components/AdminRoute';
import './styles/global.css';

function AppContent() {
  // Start with light mode default (false = light mode)
  const [dark, setDark] = useState(false);
  const [bgIdx, setBgIdx] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const BG_PALETTE = [
    { name: "Midnight", dark: "#07071a", light: "#f2f4fc" },
    { name: "Forest", dark: "#071a0a", light: "#f0f7f1" },
    { name: "Crimson", dark: "#1a0707", light: "#fdf2f2" },
    { name: "Gold", dark: "#1a1407", light: "#fdf8f0" },
    { name: "Grape", dark: "#10071a", light: "#f5f0fd" },
    { name: "Ocean", dark: "#071217", light: "#f0f7fb" }
  ];

  // Check localStorage for theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      setDark(savedTheme === 'dark');
    }
  }, []);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Rotate background palette
  useEffect(() => {
    const timer = setInterval(() => setBgIdx(i => (i + 1) % BG_PALETTE.length), 10000);
    return () => clearInterval(timer);
  }, []);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pal = BG_PALETTE[bgIdx];
  const bg = dark ? pal.dark : pal.light;

  // Theme colors object
  const C = {
    bg,
    bgAlt: dark ? "rgba(255,255,255,0.018)" : "rgba(0,0,200,0.025)",
    card: dark ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.9)",
    text: dark ? "#e8e8ff" : "#0d0d2e",
    muted: dark ? "#7878a8" : "#5a5a8a",
    border: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,180,0.11)",
    navBg: dark ? `${bg}f6` : `${bg}f4`,
    glass: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.72)"
  };

  return (
    <div style={{ 
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      background: C.bg,
      color: C.text,
      minHeight: "100vh",
      overflowX: "hidden",
      transition: "background 0.4s, color 0.35s"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        
        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }
        
        html { 
          scroll-behavior: smooth; 
        }
        
        ::-webkit-scrollbar { 
          width: 4px; 
        }
        
        ::-webkit-scrollbar-track { 
          background: ${C.bg}; 
        }
        
        ::-webkit-scrollbar-thumb { 
          background: ${dark ? "#00e5ff44" : "#0095ff44"}; 
          border-radius: 3px; 
        }
        
        @keyframes pulseGreen {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); 
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(37, 211, 102, 0); 
          }
        }
        
        @keyframes topBtnIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Navbar dark={dark} setDark={setDark} C={C} />
      
      <Routes>
        <Route path="/" element={<Home dark={dark} C={C} pal={pal} />} />
        <Route path="/home" element={<Home dark={dark} C={C} pal={pal} />} />
        <Route path="/services" element={<ServicesPage dark={dark} C={C} />} />
        <Route path="/projects" element={<ProjectsPage dark={dark} C={C} />} />
        <Route path="/pricing" element={<PricingPage dark={dark} C={C} />} />
        <Route path="/testimonials" element={<TestimonialsPage dark={dark} C={C} />} />
        <Route path="/contact" element={<ContactPage dark={dark} C={C} />} />
        <Route path="/internship" element={<InternshipPage dark={dark} C={C} />} />
        <Route path="/careers" element={<CareersPage dark={dark} C={C} />} />
        <Route path="/admin/login" element={<AdminLogin dark={dark} C={C} />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard dark={dark} C={C} />
            </AdminRoute>
          } 
        />
      </Routes>

      <Footer dark={dark} C={C} />

      {/* Scroll to Top Button */}
      {showTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 92,
            right: 22,
            zIndex: 300,
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "linear-gradient(135deg, #00e5ff, #0095ff)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#07071a",
            boxShadow: "0 6px 24px #00e5ff44",
            animation: "topBtnIn 0.3s ease both",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 10px 32px #00e5ff66";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 24px #00e5ff44";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      )}

      <ChatBot dark={dark} C={C} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}