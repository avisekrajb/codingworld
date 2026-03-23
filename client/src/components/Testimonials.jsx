import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TESTIMONIALS } from '../utils/constants';

export default function Testimonials({ dark, C }) {
  const { t } = useLanguage();
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveT(i => (i + 1) % TESTIMONIALS.length), 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" style={{
      padding: "90px 5%",
      background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,200,0.025)"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="tb" style={{
            display: "inline-block",
            background: "rgba(0,229,255,0.12)",
            border: "1px solid rgba(0,229,255,0.35)",
            color: "#00e5ff",
            borderRadius: 20,
            padding: "4px 15px",
            fontSize: 12,
            fontFamily: "'Space Mono',monospace",
            letterSpacing: 1
          }}>
            {t('testimonials.subtitle')}
          </span>
          <h2 style={{
            fontSize: "clamp(1.9rem,5vw,3rem)",
            fontWeight: 800,
            marginTop: 14,
            letterSpacing: "-1px",
            color: C.text
          }}>
            {t('testimonials.title')} <span style={{ color: "#00e5ff" }}>{t('testimonials.titleHighlight')}</span>
          </h2>
        </div>

        <div style={{ maxWidth: 620, margin: "0 auto 34px", textAlign: "center" }} key={activeT}>
          <div style={{
            background: C.card,
            border: "1px solid rgba(0,229,255,0.14)",
            borderRadius: 20,
            padding: "28px 34px",
            backdropFilter: "blur(12px)",
            animation: "fadeIn 0.5s ease"
          }}>
            <div style={{ fontSize: 30, marginBottom: 10, color: "#00e5ff", fontFamily: "Georgia,serif" }}>"</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, color: C.text, marginBottom: 18 }}>
              {TESTIMONIALS[activeT].text}
            </p>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 14 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#ffd700", fontSize: 13 }}>★</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, justifyContent: "center" }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#00e5ff,#bf5fff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 14,
                color: "#07071a"
              }}>
                {TESTIMONIALS[activeT].avatar}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{TESTIMONIALS[activeT].name}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{TESTIMONIALS[activeT].role}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 34 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveT(i)}
              style={{
                width: i === activeT ? 22 : 7,
                height: 7,
                borderRadius: 4,
                background: i === activeT ? "#00e5ff" : "rgba(128,128,180,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s",
                padding: 0
              }}
            />
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 14
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="ch"
              onClick={() => setActiveT(i)}
              style={{
                background: i === activeT
                  ? (dark ? "rgba(0,229,255,0.06)" : "rgba(0,150,255,0.06)")
                  : C.card,
                border: `1px solid ${i === activeT ? "rgba(0,229,255,0.35)" : C.border}`,
                borderRadius: 12,
                padding: "15px 16px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s"
              }}
            >
              <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 8 }}>
                <div style={{
                  width: 33,
                  height: 33,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#00e5ff88,#bf5fff88)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "#07071a",
                  fontSize: 13
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{t.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{t.text.slice(0, 68)}...</p>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </section>
  );
}