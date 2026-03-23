import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const INTERN_BANNERS = [
  { 
    emoji: "🎓", 
    title: "Ready for Internship?", 
    sub: "Kick-start your career with real-world projects", 
    accent: "#00e5ff" 
  },
  { 
    emoji: "🏆", 
    title: "Get a Certificate", 
    sub: "Earn an industry-recognized certificate upon completion", 
    accent: "#bf5fff" 
  },
  { 
    emoji: "💰", 
    title: "It's a Paid Internship", 
    sub: "Learn, grow, and earn — all at the same time", 
    accent: "#ffd700" 
  }
];

export default function InternshipBanner({ dark, C, onOpenModal }) {
  const { t } = useLanguage();
  const [internBannerIdx, setInternBannerIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setInternBannerIdx(i => (i + 1) % INTERN_BANNERS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const ib = INTERN_BANNERS[internBannerIdx];

  // Handle interested click - directly open modal, no navigation
  const handleInterestedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenModal();
  };

  return (
    <section id="internship-banner" style={{
      padding: "48px 5% 60px",
      background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,200,0.015)"
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(191,95,255,0.12)",
            border: "1px solid rgba(191,95,255,0.35)",
            color: "#bf5fff",
            borderRadius: 20,
            padding: "4px 15px",
            fontSize: 12,
            fontFamily: "'Space Mono',monospace",
            letterSpacing: 1
          }}>
            {t('internship.subtitle')}
          </span>
          <h2 style={{
            fontSize: "clamp(1.5rem,4vw,2.3rem)",
            fontWeight: 800,
            marginTop: 12,
            color: C.text
          }}>
            {t('internship.title')} <span style={{ color: "#bf5fff" }}>{t('internship.titleHighlight')}</span>
          </h2>
        </div>

        {/* Single Banner Card - Rotating */}
        <div
          key={internBannerIdx}
          className="intern-banner-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: dark ? `linear-gradient(135deg,${ib.accent}12,${ib.accent}06)` : `linear-gradient(135deg,${ib.accent}09,${ib.accent}04)`,
            border: `1px solid ${ib.accent}44`,
            borderRadius: 18,
            padding: "24px 28px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 8px 32px ${ib.accent}22`,
            transition: "all 0.35s",
            animation: "fadeInBanner 0.5s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = `0 12px 40px ${ib.accent}28`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 8px 32px ${ib.accent}22`;
          }}
        >
          {/* Shimmer effect */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 2.5s ease infinite",
            borderRadius: 18,
            pointerEvents: "none",
            opacity: 0.5
          }} />

          {/* Left accent line */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 12,
            bottom: 12,
            width: 4,
            borderRadius: "0 4px 4px 0",
            background: `linear-gradient(to bottom, ${ib.accent}, ${ib.accent}44)`
          }} />

          {/* Emoji */}
          <div style={{
            fontSize: 48,
            flexShrink: 0,
            filter: `drop-shadow(0 4px 12px ${ib.accent}66)`,
            animation: "bounceEmoji 2s ease infinite"
          }}>
            {ib.emoji}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 800,
              fontSize: "clamp(16px, 2vw, 18px)",
              color: C.text,
              marginBottom: 6
            }}>
              {t('internship.banners')[internBannerIdx]?.title || ib.title}
            </div>
            <div style={{
              color: C.muted,
              fontSize: "clamp(12px, 1.5vw, 14px)",
              lineHeight: 1.5,
              marginBottom: 12
            }}>
              {t('internship.banners')[internBannerIdx]?.sub || ib.sub}
            </div>

            {/* Tags */}
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap"
            }}>
              {[t('internship.paid'), t('internship.certified'), t('internship.realProjects'), t('internship.mentorship')].map(tag => (
                <span
                  key={tag}
                  style={{
                    background: ib.accent + "18",
                    border: `1px solid ${ib.accent}33`,
                    color: ib.accent,
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: "clamp(10px, 1.2vw, 11px)",
                    fontWeight: 700,
                    whiteSpace: "nowrap"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button - Directly opens modal, no navigation */}
          <button
            onClick={handleInterestedClick}
            className="shine"
            style={{
              background: `linear-gradient(135deg,${ib.accent},${ib.accent}bb)`,
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontWeight: 800,
              fontSize: "clamp(12px, 1.5vw, 14px)",
              color: "#07071a",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: `0 4px 18px ${ib.accent}44`,
              transition: "all 0.3s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${ib.accent}66`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 18px ${ib.accent}44`;
            }}
          >
            <span>{t('internship.interested')}</span>
            <span style={{ fontSize: 16 }}>✨</span>
          </button>
        </div>

        {/* Dot Indicators */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 20
        }}>
          {INTERN_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setInternBannerIdx(i)}
              style={{
                width: i === internBannerIdx ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: i === internBannerIdx ? INTERN_BANNERS[i].accent : "rgba(128,128,180,0.2)",
                border: i === internBannerIdx ? `1px solid ${INTERN_BANNERS[i].accent}66` : `1px solid transparent`,
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                padding: 0
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes fadeInBanner {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          @keyframes bounceEmoji {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(5deg); }
          }

          @media (max-width: 768px) {
            .intern-banner-card {
              flex-direction: column !important;
              text-align: center !important;
              padding: 24px 20px !important;
              gap: 16px !important;
            }

            .intern-banner-card button {
              width: 100% !important;
              justify-content: center !important;
            }

            .intern-banner-card div[style*="position: absolute"]:first-of-type {
              width: 100% !important;
              height: 4px !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: auto !important;
              background: linear-gradient(to right, ${ib.accent}, ${ib.accent}44) !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}