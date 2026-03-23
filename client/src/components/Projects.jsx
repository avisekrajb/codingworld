import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, PROJ_ICON_SETS } from '../utils/constants';

const ExtSVG = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function SlideIcons({ icons, color }) {
  const [idx, setIdx] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % icons.length), 1400);
    return () => clearInterval(timer);
  }, [icons]);

  return (
    <div style={{
      position: "absolute",
      bottom: 8,
      left: 10,
      display: "flex",
      gap: 5
    }}>
      {icons.map((ic, i) => (
        <div
          key={ic + i}
          style={{
            width: 27,
            height: 27,
            borderRadius: 8,
            background: i === idx ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${i === idx ? color + "99" : color + "33"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            transform: i === idx ? "scale(1.15)" : "scale(0.92)",
            boxShadow: i === idx ? `0 4px 14px ${color}44` : "none"
          }}
        >
          {ic}
        </div>
      ))}
    </div>
  );
}

export default function Projects({ dark, C }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [projPage, setProjPage] = useState(0);

  const allTags = ["All", ...new Set(PROJECTS.flatMap(p => p.tags))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));
  const CARDS_PER = 4;
  const totalPages = Math.ceil(filtered.length / CARDS_PER);
  const pageCards = filtered.slice(projPage * CARDS_PER, (projPage + 1) * CARDS_PER);

  const handleViewProject = (projectLink, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (projectLink && projectLink !== '#') {
      window.open(projectLink, '_blank', 'noopener,noreferrer');
    } else {
      // If no external link, navigate to project details page or show modal
      navigate(`/project/${projectLink}` || '/projects');
    }
  };

  return (
    <section id="projects" style={{
      padding: "90px 5%",
      background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,200,0.025)"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="tb" style={{
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
            {t('projects.portfolio')}
          </span>
          <h2 style={{
            fontSize: "clamp(1.9rem,5vw,3rem)",
            fontWeight: 800,
            marginTop: 14,
            letterSpacing: "-1px",
            color: C.text
          }}>
            {t('projects.title')} <span style={{ color: "#bf5fff" }}>{t('projects.titleHighlight')}</span>
          </h2>
          <p style={{ color: C.muted, marginTop: 9, fontSize: 15 }}>
            {t('projects.subtitle')}
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 6,
          marginBottom: 30,
          scrollbarWidth: "none"
        }}>
          {allTags.map(tag => (
            <button
              key={tag}
              className="fb"
              onClick={() => {
                setFilter(tag);
                setProjPage(0);
              }}
              style={{
                padding: "6px 15px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                fontFamily: "'Outfit',sans-serif",
                whiteSpace: "nowrap",
                background: filter === tag ? "linear-gradient(135deg,#bf5fff,#7b2fff)" : "transparent",
                borderColor: filter === tag ? "#bf5fff" : C.border,
                color: filter === tag ? "#fff" : C.muted,
                flexShrink: 0
              }}
            >
              {tag === "All" ? t('projects.all') : tag}
            </button>
          ))}
        </div>

        <div
          key={`${filter}-${projPage}`}
          className="proj-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 18,
            animation: "si 0.4s ease"
          }}
        >
          {pageCards.map((p, pi) => {
            const pIdx = PROJECTS.indexOf(p);
            return (
              <div
                key={p.title}
                className="ch"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 15,
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color + "55";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 60px ${p.color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => {
                  if (p.link && p.link !== '#') {
                    window.open(p.link, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div style={{
                  height: 110,
                  background: `linear-gradient(135deg,${p.color}18,${p.color}06)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 44,
                  position: "relative",
                  borderBottom: `1px solid ${C.border}`
                }}>
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    p.emoji
                  )}
                  <div style={{
                    position: "absolute",
                    top: 9,
                    right: 9,
                    background: p.color + "22",
                    border: `1px solid ${p.color}44`,
                    borderRadius: 7,
                    padding: "2px 8px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: p.color,
                    fontFamily: "'Space Mono',monospace"
                  }}>
                    {t('projects.live')}
                  </div>
                  {!p.imageUrl && (
                    <SlideIcons
                      icons={PROJ_ICON_SETS[pIdx >= 0 ? pIdx % PROJ_ICON_SETS.length : 0] || ["⚡", "🔗", "📊"]}
                      color={p.color}
                    />
                  )}
                </div>

                <div style={{ padding: "16px 18px 18px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 7, color: C.text }}>
                    {p.title}
                  </h3>
                  <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6, marginBottom: 12 }}>
                    {p.desc}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 13 }}>
                    {p.tags.map(t => (
                      <span
                        key={t}
                        style={{
                          background: p.color + "14",
                          border: `1px solid ${p.color}2e`,
                          color: p.color,
                          borderRadius: 5,
                          padding: "2px 8px",
                          fontSize: 10,
                          fontWeight: 600
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.link && p.link !== '#') {
                        window.open(p.link, '_blank', 'noopener,noreferrer');
                      } else {
                        navigate(`/project-details/${p.title.toLowerCase().replace(/\s+/g, '-')}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: `linear-gradient(135deg,${p.color},${p.color}bb)`,
                      border: "none",
                      borderRadius: 7,
                      padding: "7px 14px",
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#07071a",
                      cursor: "pointer",
                      textDecoration: "none"
                    }}
                  >
                    {t('projects.view')} <ExtSVG />
                  </button>
                </div>
              </div>
            );
          })}
          {pageCards.length % 2 !== 0 && <div />}
        </div>

        {totalPages > 1 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginTop: 28
          }}>
            <button
              onClick={() => setProjPage(p => Math.max(0, p - 1))}
              disabled={projPage === 0}
              style={{
                background: projPage === 0 ? C.glass : "linear-gradient(135deg,#bf5fff,#7b2fff)",
                border: `1px solid ${projPage === 0 ? C.border : "transparent"}`,
                borderRadius: 11,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: projPage === 0 ? "default" : "pointer",
                color: projPage === 0 ? C.muted : "#fff",
                opacity: projPage === 0 ? 0.45 : 1
              }}
            >
              <ChevL />
            </button>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.muted }}>
              {projPage + 1}/{totalPages}
            </span>
            <button
              onClick={() => setProjPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={projPage === totalPages - 1}
              style={{
                background: projPage === totalPages - 1 ? C.glass : "linear-gradient(135deg,#bf5fff,#7b2fff)",
                border: `1px solid ${projPage === totalPages - 1 ? C.border : "transparent"}`,
                borderRadius: 11,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: projPage === totalPages - 1 ? "default" : "pointer",
                color: projPage === totalPages - 1 ? C.muted : "#fff",
                opacity: projPage === totalPages - 1 ? 0.45 : 1
              }}
            >
              <ChevR />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes si {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

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