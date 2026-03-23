import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CAROUSEL_SLIDES, ORBIT_POS_MOBILE } from '../utils/constants';
import HiringMarquee from './HiringMarquee'; // Import the marquee

const PlaySVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ChevL = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevR = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Modern Glassmorphism Icon Cloud
const IconCloud = ({ accent, techIcons, extraIcons = [], dark }) => {
  const allIcons = [...techIcons, ...extraIcons].slice(0, 12);
  
  // Generate random positions for a 3D cloud effect
  const positions = allIcons.map(() => ({
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 300,
    z: Math.random() * 200,
    rotateX: Math.random() * 360,
    rotateY: Math.random() * 360,
    rotateZ: Math.random() * 360,
    scale: 0.8 + Math.random() * 0.7,
    delay: Math.random() * 5
  }));

  return (
    <div style={{
      position: "relative",
      width: 400,
      height: 400,
      perspective: "1000px",
      transformStyle: "preserve-3d"
    }}>
      {/* Floating Background Orbs */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${accent}30, transparent 70%)`,
        filter: "blur(40px)",
        animation: "pulseOrb 4s ease-in-out infinite"
      }} />

      {/* Central Glowing Core */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${accent}, ${accent}dd, ${accent}99)`,
        boxShadow: `0 0 60px ${accent}, 0 0 120px ${accent}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        color: "#fff",
        textShadow: "0 0 20px rgba(0,0,0,0.5)",
        zIndex: 10,
        animation: "corePulse 3s ease-in-out infinite"
      }}>
        <span style={{ transform: "rotate(0deg)" }}>⚡</span>
      </div>

      {/* Floating Icons in 3D Space */}
      {allIcons.map((icon, index) => {
        const pos = positions[index];
        const duration = 8 + Math.random() * 7;
        
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) rotateX(${pos.rotateX}deg) rotateY(${pos.rotateY}deg) rotateZ(${pos.rotateZ}deg)`,
              width: 60,
              height: 60,
              marginLeft: -30,
              marginTop: -30,
              animation: `float3d ${duration}s ease-in-out infinite`,
              animationDelay: `${pos.delay}s`,
              zIndex: 5,
              filter: `drop-shadow(0 0 15px ${accent}66)`
            }}
          >
            {/* Icon Container with Glass Effect */}
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: dark 
                ? `radial-gradient(circle at 30% 30%, ${accent}dd, rgba(20,20,40,0.9))`
                : `radial-gradient(circle at 30% 30%, ${accent}, rgba(255,255,255,0.9))`,
              backdropFilter: "blur(10px)",
              border: `2px solid ${accent}99`,
              boxShadow: `
                0 10px 30px ${accent}66,
                inset 0 0 20px ${accent}33,
                0 0 0 2px rgba(255,255,255,0.1) inset
              `,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#fff",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              transform: `scale(${pos.scale})`,
              transition: "all 0.3s ease",
              animation: `iconGlow ${duration}s ease-in-out infinite`
            }}>
              {icon}
            </div>

            {/* Orbital Ring */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: `1px dashed ${accent}66`,
              animation: `spinRing ${duration * 0.5}s linear infinite`,
              opacity: 0.3
            }} />
          </div>
        );
      })}

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => {
        const size = 2 + Math.random() * 4;
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 300;
        
        return (
          <div
            key={`particle-${i}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate3d(${x}px, ${y}px, ${z}px)`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 ${size * 4}px ${accent}`,
              opacity: 0.2 + Math.random() * 0.3,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        );
      })}

      {/* Connecting Lines */}
      <svg style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      }}>
        {allIcons.slice(0, 6).map((_, i) => {
          const start = positions[i];
          const end = positions[(i + 1) % 6];
          if (!start || !end) return null;
          
          return (
            <line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${end.x}px)`}
              y2={`calc(50% + ${end.y}px)`}
              stroke={accent}
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.2"
              style={{
                animation: `flowLine ${10 + i}s linear infinite`
              }}
            />
          );
        })}
      </svg>

      <style>{`
        @keyframes float3d {
          0%, 100% {
            transform: translate3d(var(--x), var(--y), var(--z)) rotateX(var(--rotateX)) rotateY(var(--rotateY)) rotateZ(var(--rotateZ));
          }
          25% {
            transform: translate3d(calc(var(--x) + 20px), calc(var(--y) - 20px), calc(var(--z) + 30px)) rotateX(calc(var(--rotateX) + 10deg)) rotateY(calc(var(--rotateY) + 15deg)) rotateZ(calc(var(--rotateZ) + 20deg));
          }
          50% {
            transform: translate3d(calc(var(--x) - 15px), calc(var(--y) + 25px), calc(var(--z) - 20px)) rotateX(calc(var(--rotateX) - 5deg)) rotateY(calc(var(--rotateY) - 10deg)) rotateZ(calc(var(--rotateZ) - 15deg));
          }
          75% {
            transform: translate3d(calc(var(--x) + 25px), calc(var(--y) + 15px), calc(var(--z) + 25px)) rotateX(calc(var(--rotateX) + 20deg)) rotateY(calc(var(--rotateY) - 5deg)) rotateZ(calc(var(--rotateZ) + 10deg));
          }
        }

        @keyframes iconGlow {
          0%, 100% {
            box-shadow: 0 10px 30px ${accent}66, inset 0 0 20px ${accent}33;
          }
          50% {
            box-shadow: 0 20px 40px ${accent}99, inset 0 0 30px ${accent}66;
          }
        }

        @keyframes spinRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes pulseOrb {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes corePulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 60px ${accent}, 0 0 120px ${accent}66;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 80px ${accent}, 0 0 160px ${accent}99;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.5);
          }
        }

        @keyframes flowLine {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 100;
          }
        }
      `}</style>
    </div>
  );
};

// Neon Cyberpunk Design
const NeonCyberpunk = ({ accent, techIcons, extraIcons = [], dark }) => {
    const allIcons = [...techIcons, ...extraIcons].slice(0, 8);
    const radius = 140;
  
    return (
      <div style={{
        position: "relative",
        width: 400,
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Grid Background */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${accent}22 1px, transparent 1px),
            linear-gradient(90deg, ${accent}22 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          transform: "perspective(500px) rotateX(60deg)",
          animation: "gridMove 10s linear infinite"
        }} />
  
        {/* Circular Scanner */}
        <div style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `2px solid ${accent}`,
          boxShadow: `0 0 30px ${accent}, inset 0 0 30px ${accent}`,
          animation: "rotateScanner 8s linear infinite"
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "50%",
            height: 2,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            transform: "translateY(-50%)",
            animation: "scan 4s ease-in-out infinite"
          }} />
        </div>
  
        {/* Central Hub */}
        <div style={{
          position: "relative",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${accent}, ${accent}dd)`,
          boxShadow: `0 0 50px ${accent}, 0 0 100px ${accent}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          color: "#fff",
          zIndex: 10,
          animation: "hubPulse 2s ease-in-out infinite"
        }}>
          💎
        </div>
  
        {/* Icons on Circular Paths */}
        {allIcons.map((icon, index) => {
          const angle = (index * 45) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const delay = index * 0.5;
  
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: 60,
                height: 60,
                animation: `neonFloat${index} ${3 + index}s ease-in-out infinite`,
                animationDelay: `${delay}s`
              }}
            >
              {/* Neon Ring */}
              <div style={{
                position: "absolute",
                inset: -5,
                borderRadius: "50%",
                border: `2px solid ${accent}`,
                boxShadow: `0 0 20px ${accent}, inset 0 0 10px ${accent}`,
                animation: `neonPulse ${2 + index}s ease-in-out infinite`
              }} />
              
              {/* Icon Container */}
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: dark ? "#0a0a1e" : "#fff",
                border: `2px solid ${accent}`,
                boxShadow: `0 0 30px ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: accent,
                backdropFilter: "blur(5px)",
                animation: `iconFlicker ${3 + index}s ease-in-out infinite`
              }}>
                {icon}
              </div>
  
              {/* Data Stream */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 2,
                height: 30,
                background: `linear-gradient(to top, ${accent}, transparent)`,
                transform: "translate(-50%, -50%)",
                animation: `dataStream ${2 + index}s linear infinite`
              }} />
            </div>
          );
        })}
  
        {/* Floating Binary Numbers */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`binary-${i}`}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: accent,
              fontSize: 12,
              fontFamily: "'Space Mono', monospace",
              opacity: 0.3,
              animation: `floatBinary ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}
  
        <style>{`
          @keyframes rotateScanner {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
  
          @keyframes scan {
            0%, 100% { transform: translateY(-50%) scaleX(1); opacity: 0.5; }
            50% { transform: translateY(-50%) scaleX(1.5); opacity: 1; }
          }
  
          @keyframes hubPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 50px ${accent}, 0 0 100px ${accent}66; }
            50% { transform: scale(1.1); box-shadow: 0 0 70px ${accent}, 0 0 140px ${accent}99; }
          }
  
          @keyframes neonFloat0 {
            0%, 100% { transform: translate(calc(-50% + 140px), calc(-50% + 0px)) translateY(0); }
            50% { transform: translate(calc(-50% + 140px), calc(-50% + 0px)) translateY(-15px); }
          }
  
          @keyframes neonFloat1 {
            0%, 100% { transform: translate(calc(-50% + 99px), calc(-50% + 99px)) translateY(0); }
            50% { transform: translate(calc(-50% + 99px), calc(-50% + 99px)) translateY(-15px); }
          }
  
          @keyframes neonFloat2 {
            0%, 100% { transform: translate(calc(-50% + 0px), calc(-50% + 140px)) translateY(0); }
            50% { transform: translate(calc(-50% + 0px), calc(-50% + 140px)) translateY(-15px); }
          }
  
          @keyframes neonFloat3 {
            0%, 100% { transform: translate(calc(-50% - 99px), calc(-50% + 99px)) translateY(0); }
            50% { transform: translate(calc(-50% - 99px), calc(-50% + 99px)) translateY(-15px); }
          }
  
          @keyframes neonFloat4 {
            0%, 100% { transform: translate(calc(-50% - 140px), calc(-50% + 0px)) translateY(0); }
            50% { transform: translate(calc(-50% - 140px), calc(-50% + 0px)) translateY(-15px); }
          }
  
          @keyframes neonFloat5 {
            0%, 100% { transform: translate(calc(-50% - 99px), calc(-50% - 99px)) translateY(0); }
            50% { transform: translate(calc(-50% - 99px), calc(-50% - 99px)) translateY(-15px); }
          }
  
          @keyframes neonFloat6 {
            0%, 100% { transform: translate(calc(-50% + 0px), calc(-50% - 140px)) translateY(0); }
            50% { transform: translate(calc(-50% + 0px), calc(-50% - 140px)) translateY(-15px); }
          }
  
          @keyframes neonFloat7 {
            0%, 100% { transform: translate(calc(-50% + 99px), calc(-50% - 99px)) translateY(0); }
            50% { transform: translate(calc(-50% + 99px), calc(-50% - 99px)) translateY(-15px); }
          }
  
          @keyframes neonPulse {
            0%, 100% { opacity: 0.8; box-shadow: 0 0 20px ${accent}; }
            50% { opacity: 1; box-shadow: 0 0 40px ${accent}, 0 0 60px ${accent}; }
          }
  
          @keyframes iconFlicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 1; }
            93% { opacity: 0.4; }
            94% { opacity: 1; }
            95% { opacity: 0.2; }
            96% { opacity: 1; }
          }
  
          @keyframes dataStream {
            0% { transform: translate(-50%, -50%) translateY(-30px); opacity: 0; }
            50% { transform: translate(-50%, -50%) translateY(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) translateY(30px); opacity: 0; }
          }
  
          @keyframes floatBinary {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
          }
  
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 30px 30px; }
          }
        `}</style>
      </div>
    );
  };

// Holographic Design
const Holographic = ({ accent, techIcons, extraIcons = [], dark }) => {
  const allIcons = [...techIcons, ...extraIcons].slice(0, 8);
  
  return (
    <div style={{
      position: "relative",
      width: 400,
      height: 400,
      perspective: "1200px"
    }}>
      {/* Holographic Base */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${accent}33, transparent 70%)`,
        filter: "blur(20px)",
        animation: "hologramPulse 5s ease-in-out infinite"
      }} />

      {/* Rotating Rings */}
      {[1, 2, 3].map((ring, i) => (
        <div
          key={`ring-${i}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200 + i * 60,
            height: 200 + i * 60,
            borderRadius: "50%",
            border: `2px solid ${accent}`,
            boxShadow: `0 0 30px ${accent}, inset 0 0 20px ${accent}`,
            opacity: 0.2 + i * 0.1,
            animation: `rotateRing ${8 + i * 2}s linear infinite`,
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateX(${i * 30}deg) rotateY(${i * 20}deg)`
          }}
        />
      ))}

      {/* Floating Holographic Icons */}
      {allIcons.map((icon, index) => {
        const angle = (index * 45) * (Math.PI / 180);
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = Math.sin(angle * 2) * 50;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px)`,
              width: 70,
              height: 70,
              transformStyle: "preserve-3d",
              animation: `hologramFloat ${5 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            {/* Icon with Holographic Effect */}
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accent}dd, transparent)`,
              backdropFilter: "blur(10px)",
              border: `2px solid ${accent}`,
              boxShadow: `
                0 0 50px ${accent},
                0 0 100px ${accent}66,
                inset 0 0 30px ${accent}
              `,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: "#fff",
              textShadow: "0 0 10px rgba(0,0,0,0.5)",
              animation: `hologramGlow ${3 + index}s ease-in-out infinite`
            }}>
              {icon}
            </div>

            {/* Reflection Layer */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`,
              mixBlendMode: "overlay",
              pointerEvents: "none"
            }} />

            {/* Holographic Ring */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: `1px solid ${accent}66`,
              animation: `spinRing ${4 + index}s linear infinite`
            }} />
          </div>
        );
      })}

      {/* Light Beams */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        return (
          <div
            key={`beam-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              width: 2,
              height: 200,
              background: `linear-gradient(to top, transparent, ${accent}, transparent)`,
              opacity: 0.2,
              animation: `beamPulse ${3 + i}s ease-in-out infinite`,
              transformOrigin: "center"
            }}
          />
        );
      })}

      <style>{`
        @keyframes hologramPulse {
          0%, 100% { opacity: 0.3; filter: blur(20px); }
          50% { opacity: 0.6; filter: blur(30px); }
        }

        @keyframes rotateRing {
          from { transform: translate(-50%, -50%) rotateX(30deg) rotateY(20deg) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotateX(30deg) rotateY(20deg) rotate(360deg); }
        }

        @keyframes hologramFloat {
          0%, 100% { transform: translate3d(calc(-50% + var(--x)), calc(-50% + var(--y)), var(--z)) translateY(0); }
          50% { transform: translate3d(calc(-50% + var(--x)), calc(-50% + var(--y)), var(--z)) translateY(-20px); }
        }

        @keyframes hologramGlow {
          0%, 100% { box-shadow: 0 0 50px ${accent}, 0 0 100px ${accent}66; }
          50% { box-shadow: 0 0 70px ${accent}, 0 0 140px ${accent}99; }
        }

        @keyframes beamPulse {
          0%, 100% { opacity: 0.2; height: 200px; }
          50% { opacity: 0.4; height: 250px; }
        }

        @keyframes spinRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default function Hero({ dark, C, pal }) {
  const { t } = useLanguage();
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [designStyle, setDesignStyle] = useState('holographic'); // 'cloud', 'cyberpunk', 'holographic'

  const slides = t('hero.slides');

  const nextSlide = useCallback(() => {
    setSlide(s => (s + 1) % CAROUSEL_SLIDES.length);
    setAnimKey(k => k + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setSlide(s => (s - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    setAnimKey(k => k + 1);
  }, []);

  const gotoSlide = (i) => {
    setSlide(i);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4800);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Rotate design styles
  useEffect(() => {
    const timer = setInterval(() => {
      setDesignStyle(current => {
        if (current === 'cloud') return 'cyberpunk';
        if (current === 'cyberpunk') return 'holographic';
        return 'cloud';
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const dx = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(dx) > 50) {
      dx < 0 ? nextSlide() : prevSlide();
    }
    setTouchStart(null);
  };

  const currentSlide = CAROUSEL_SLIDES[slide];

  const renderDesign = () => {
    switch(designStyle) {
      case 'cloud':
        return <IconCloud 
          accent={currentSlide.accent}
          techIcons={currentSlide.techIcons}
          extraIcons={currentSlide.extraIcons}
          dark={dark}
        />;
      case 'cyberpunk':
        return <NeonCyberpunk 
          accent={currentSlide.accent}
          techIcons={currentSlide.techIcons}
          extraIcons={currentSlide.extraIcons}
          dark={dark}
        />;
      case 'holographic':
        return <Holographic 
          accent={currentSlide.accent}
          techIcons={currentSlide.techIcons}
          extraIcons={currentSlide.extraIcons}
          dark={dark}
        />;
      default:
        return <IconCloud 
          accent={currentSlide.accent}
          techIcons={currentSlide.techIcons}
          extraIcons={currentSlide.extraIcons}
          dark={dark}
        />;
    }
  };

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        padding: "100px 5% 0"
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="gbg" style={{
        position: "absolute",
        inset: 0,
        opacity: dark ? 0.8 : 0.3,
        backgroundImage: `linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        animation: "gm 12s linear infinite"
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 60% 50%, ${currentSlide.accent}1e 0%, transparent 70%)`,
        transition: "background 1.2s"
      }} />

      {currentSlide.badge && (
        <div style={{
          position: "absolute",
          top: 90,
          right: "5%",
          zIndex: 5,
          background: `linear-gradient(135deg,${currentSlide.badgeColor},${currentSlide.badgeColor}aa)`,
          color: "#fff",
          borderRadius: 30,
          padding: "6px 18px",
          fontWeight: 800,
          fontSize: 11,
          fontFamily: "'Space Mono',monospace",
          letterSpacing: "1.5px",
          boxShadow: `0 4px 20px ${currentSlide.badgeColor}55`
        }}>
          {currentSlide.badge}
        </div>
      )}

      {/* Animated Design Container - Top Right */}
      <div className="design-container" style={{
        position: "absolute",
        right: "5%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 3,
        transition: "all 0.5s ease"
      }}>
        {renderDesign()}
        
        {/* Style Indicator Dots */}
        <div style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8
        }}>
          {['cloud', 'cyberpunk', 'holographic'].map((style, i) => (
            <div
              key={style}
              onClick={() => setDesignStyle(style)}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: designStyle === style ? currentSlide.accent : "rgba(128,128,180,0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
                transform: designStyle === style ? "scale(1.5)" : "scale(1)"
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile Icons */}
      <div className="hero-mobile-icons" style={{
        display: "none",
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}>
        {currentSlide.techIcons.map((ic, i) => (
          <div
            key={`m-${slide}-${i}`}
            style={{
              position: "absolute",
              ...ORBIT_POS_MOBILE[i],
              width: ORBIT_POS_MOBILE[i].size,
              height: ORBIT_POS_MOBILE[i].size,
              borderRadius: Math.round(ORBIT_POS_MOBILE[i].size * 0.28),
              background: dark ? `${currentSlide.accent}16` : `${currentSlide.accent}12`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${currentSlide.accent}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: Math.round(ORBIT_POS_MOBILE[i].size * 0.44),
              animation: `fl${i} ${3 + i * 0.4}s ease-in-out infinite, mobileIconPop 0.5s ease ${i * 0.08}s both`
            }}
          >
            {ic}
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <div key={animKey} style={{ animation: "heroIn 0.65s cubic-bezier(0.34,1.2,0.64,1) both" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: C.glass,
            backdropFilter: "blur(16px)",
            border: `1px solid ${currentSlide.accent}44`,
            borderRadius: 14,
            padding: "8px 16px",
            marginBottom: 20,
            boxShadow: `0 4px 20px ${currentSlide.accent}14`
          }}>
            <span style={{ fontSize: 22 }}>{currentSlide.icon}</span>
            <span style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 11,
              color: currentSlide.accent,
              letterSpacing: "1.5px"
            }}>
              {slides[slide]?.tag || currentSlide.tag}
            </span>
            {currentSlide.particles.map((pc, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: pc,
                  opacity: 0.7,
                  animation: `fl${i} ${2 + i}s ease-in-out infinite`
                }}
              />
            ))}
          </div>

          <h1 className="hero-title" style={{
            fontSize: "clamp(2.6rem,7vw,5.6rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 18,
            letterSpacing: "-2px",
            color: C.text,
            maxWidth: 680
          }}>
            {(slides[slide]?.title || currentSlide.title).split(" ").map((w, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span style={{ color: currentSlide.accent, textShadow: `0 0 50px ${currentSlide.accent}55` }}>
                    {w}{' '}
                  </span>
                ) : w + " "}
              </span>
            ))}
          </h1>

          <p className="hero-sub" style={{
            fontSize: "clamp(0.95rem,2.3vw,1.2rem)",
            color: C.muted,
            maxWidth: 520,
            lineHeight: 1.78,
            marginBottom: 36
          }}>
            {slides[slide]?.subtitle || currentSlide.subtitle}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}>
            <button
              className="shine"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: `linear-gradient(135deg,${currentSlide.accent},#0095ff)`,
                border: "none",
                borderRadius: 11,
                padding: "13px 28px",
                fontWeight: 800,
                fontSize: 14,
                color: "#07071a",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0
              }}
            >
              {t('hero.startProject')} <span>→</span>
            </button>
            <button
              onClick={() => setShowVideo(true)}
              style={{
                background: C.glass,
                backdropFilter: "blur(12px)",
                border: `1px solid ${currentSlide.accent}55`,
                borderRadius: 11,
                padding: "13px 22px",
                fontWeight: 700,
                fontSize: 14,
                color: currentSlide.accent,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 9,
                transition: "all 0.25s",
                flexShrink: 0
              }}
              onMouseEnter={e => e.currentTarget.style.background = currentSlide.accent + "22"}
              onMouseLeave={e => e.currentTarget.style.background = C.glass}
            >
              <span style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: currentSlide.accent + "22",
                border: `1px solid ${currentSlide.accent}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: currentSlide.accent,
                flexShrink: 0
              }}>
                <PlaySVG />
              </span>
              {t('hero.watchDemo')}
            </button>
          </div>

          <div className="hero-stats" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              ["50+", t('hero.projects')],
              ["100%", t('hero.satisfaction')],
              ["3yr+", t('hero.experience')]
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{
                  fontSize: "clamp(1.4rem,3.5vw,2rem)",
                  fontWeight: 900,
                  color: currentSlide.accent,
                  lineHeight: 1
                }}>
                  {n}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40 }}>
          <button
            onClick={prevSlide}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.glass,
              backdropFilter: "blur(10px)",
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.muted,
              transition: "all 0.2s",
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = currentSlide.accent + "88";
              e.currentTarget.style.color = currentSlide.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.muted;
            }}
          >
            <ChevL />
          </button>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {CAROUSEL_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => gotoSlide(i)}
                style={{
                  width: i === slide ? 24 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i === slide ? currentSlide.accent : "rgba(128,128,180,0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s",
                  padding: 0,
                  boxShadow: i === slide ? `0 0 10px ${currentSlide.accent}66` : "none"
                }}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.glass,
              backdropFilter: "blur(10px)",
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.muted,
              transition: "all 0.2s",
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = currentSlide.accent + "88";
              e.currentTarget.style.color = currentSlide.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.muted;
            }}
          >
            <ChevR />
          </button>

          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.muted, marginLeft: 4 }}>
            {slide + 1}/{CAROUSEL_SLIDES.length}
          </span>
        </div>
      </div>

      {/* Marquee Section - Added Below Everything */}
      <div style={{
        width: '100%',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 10
      }}>
        <HiringMarquee dark={dark} C={C} />
      </div>

      {/* Gradient Fade at Bottom */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: `linear-gradient(to bottom, transparent, ${C.bg})`,
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* Video Modal */}
      {showVideo && (
        <div
          className="video-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)"
          }}
          onClick={() => setShowVideo(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(840px,94vw)",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 80px rgba(0,229,255,0.18)"
            }}
          >
            <button
              onClick={() => setShowVideo(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                background: "rgba(0,0,0,0.7)",
                border: "none",
                borderRadius: "50%",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Demo"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none"
                }}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fl0 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(5deg); } }
        @keyframes fl1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
        @keyframes fl2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-16px) rotate(3deg); } }
        @keyframes fl3 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-6deg); } }
        @keyframes fl4 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(4deg); } }
        @keyframes fl5 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-18px) rotate(-3deg); } }
        @keyframes heroIn { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes gm { 0% { background-position: 0 0; } 100% { background-position: 60px 60px; } }
        @keyframes mobileIconPop { from { opacity: 0; transform: scale(0) rotate(20deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        
        @media (max-width: 1024px) {
          .design-container {
            transform: translateY(-50%) scale(0.8);
          }
        }

        @media (max-width: 768px) {
          .design-container {
            display: none !important;
          }
          .hero-mobile-icons {
            display: block !important;
          }
          .hero-stats { gap: 20px !important; }
          .hero-title { font-size: clamp(2rem,10vw,3rem) !important; letter-spacing: -1px !important; }
          .hero-sub { font-size: 14px !important; max-width: 100% !important; }
          .hero-section { padding: 90px 4% 60px !important; min-height: 100svh !important; }
        }
      `}</style>
    </section>
  );
}