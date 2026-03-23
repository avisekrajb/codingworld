import { useState } from 'react';
import axios from 'axios';

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function InternshipModal({ onClose, dark, C, accentColor = "#00e5ff" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tracks: [],
    duration: "",
    cv: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const tracks = ["MEAN Stack", "MERN Stack", "Full Stack Java", "Python"];
  const durations = ["2 Months", "3 Months", "4 Months"];

  const toggleTrack = t => {
    setForm(f => ({
      ...f,
      tracks: f.tracks.includes(t)
        ? f.tracks.filter(x => x !== t)
        : [...f.tracks, t]
    }));
  };

  const handleFile = file => {
    if (file) setForm(f => ({ ...f, cv: file }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.tracks.length || !form.duration) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('tracks', JSON.stringify(form.tracks));
      formData.append('duration', form.duration);
      if (form.cv) {
        formData.append('cv', form.cv);
      }

      const response = await axios.post('/api/internship/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
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
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)"
      }} />
      
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: isMobile ? "100%" : "min(560px,94vw)",
          maxHeight: isMobile ? "90vh" : "88vh",
          background: dark ? "linear-gradient(160deg,#0d0d28,#0a0a1e)" : "linear-gradient(160deg,#f8f8ff,#eeeefa)",
          border: `1px solid ${accentColor}33`,
          borderRadius: isMobile ? "28px 28px 0 0" : "24px",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 0 80px ${accentColor}22, 0 30px 80px rgba(0,0,0,0.5)`,
          animation: isMobile
            ? "slideUpModal 0.38s cubic-bezier(0.34,1.4,0.64,1) both"
            : "popModal 0.32s cubic-bezier(0.34,1.4,0.64,1) both",
          overflow: "hidden"
        }}
      >
        <style>{`
          @keyframes slideUpModal {
            from { opacity: 0; transform: translateY(100%); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes popModal {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
          background: `linear-gradient(135deg,${accentColor}12,rgba(191,95,255,0.07))`
        }}>
          {isMobile && (
            <div style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: C.muted,
              margin: "0 auto 14px",
              opacity: 0.4
            }} />
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `linear-gradient(135deg,${accentColor},#bf5fff)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18
                }}>🎓</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: C.text }}>Internship Application</div>
                  <div style={{
                    fontSize: 11,
                    color: accentColor,
                    fontFamily: "'Space Mono',monospace"
                  }}>
                    PAID · CERTIFIED · REAL PROJECTS
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
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
                color: C.muted,
                flexShrink: 0
              }}
            >
              <CloseSVG />
            </button>
          </div>
        </div>

        {submitted ? (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: C.text, marginBottom: 8 }}>
              Application Submitted!
            </div>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Thank you <strong style={{ color: accentColor }}>{form.name}</strong>! We'll review your application and reach out to{' '}
              <strong style={{ color: accentColor }}>{form.email}</strong> within 2-3 business days.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
              {form.tracks.map(t => (
                <span
                  key={t}
                  style={{
                    background: accentColor + "20",
                    border: `1px solid ${accentColor}44`,
                    color: accentColor,
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {t}
                </span>
              ))}
              <span style={{
                background: "rgba(191,95,255,0.15)",
                border: "1px solid rgba(191,95,255,0.4)",
                color: "#bf5fff",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700
              }}>
                ⏱ {form.duration}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: `linear-gradient(135deg,${accentColor},#0095ff)`,
                border: "none",
                borderRadius: 11,
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: 14,
                color: "#07071a",
                cursor: "pointer"
              }}
            >
              Done ✓
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* Full Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: "block",
                marginBottom: 6,
                letterSpacing: "0.5px"
              }}>
                FULL NAME *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                style={{
                  width: "100%",
                  background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 13px",
                  fontSize: 13,
                  color: C.text,
                  outline: "none",
                  fontFamily: "'Outfit',sans-serif",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = accentColor + "77"}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: "block",
                marginBottom: 6,
                letterSpacing: "0.5px"
              }}>
                EMAIL *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 13px",
                  fontSize: 13,
                  color: C.text,
                  outline: "none",
                  fontFamily: "'Outfit',sans-serif",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = accentColor + "77"}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: "block",
                marginBottom: 6,
                letterSpacing: "0.5px"
              }}>
                PHONE *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+977 9800000000"
                style={{
                  width: "100%",
                  background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 13px",
                  fontSize: 13,
                  color: C.text,
                  outline: "none",
                  fontFamily: "'Outfit',sans-serif",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = accentColor + "77"}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Track checkboxes */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: "block",
                marginBottom: 8,
                letterSpacing: "0.5px"
              }}>
                CHOOSE TRACK * <span style={{ fontSize: 10, color: accentColor }}>(Select one or more)</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {tracks.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTrack(t)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: `1.5px solid ${form.tracks.includes(t) ? accentColor : C.border}`,
                      background: form.tracks.includes(t) ? accentColor + "15" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left"
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: `2px solid ${form.tracks.includes(t) ? accentColor : C.muted}`,
                      background: form.tracks.includes(t) ? accentColor : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s"
                    }}>
                      {form.tracks.includes(t) && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#07071a" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: form.tracks.includes(t) ? accentColor : C.text
                    }}>
                      {t}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: "block",
                marginBottom: 8,
                letterSpacing: "0.5px"
              }}>
                CHOOSE DURATION *
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {durations.map(d => (
                  <button
                    key={d}
                    onClick={() => setForm(f => ({ ...f, duration: d }))}
                    style={{
                      flex: 1,
                      padding: "10px 8px",
                      borderRadius: 10,
                      border: `1.5px solid ${form.duration === d ? "#bf5fff" : C.border}`,
                      background: form.duration === d ? "rgba(191,95,255,0.15)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      color: form.duration === d ? "#bf5fff" : C.text,
                      fontWeight: 700,
                      fontSize: 12.5,
                      fontFamily: "'Outfit',sans-serif"
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* CV Upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                display: "block",
                marginBottom: 8,
                letterSpacing: "0.5px"
              }}>
                UPLOAD CV / RESUME
              </label>
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => document.getElementById('cv-upload').click()}
                style={{
                  border: `2px dashed ${dragging ? accentColor : form.cv ? accentColor + "66" : C.border}`,
                  borderRadius: 12,
                  padding: "18px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragging ? accentColor + "08" : form.cv ? accentColor + "06" : "transparent",
                  transition: "all 0.25s"
                }}
              >
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={e => handleFile(e.target.files[0])}
                />
                <div style={{ fontSize: 28, marginBottom: 6 }}>{form.cv ? "📄" : "📎"}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: form.cv ? accentColor : C.muted }}>
                  {form.cv ? form.cv.name : "Drop your CV here or click to browse"}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                  PDF, DOC, DOCX accepted
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#888" : `linear-gradient(135deg,${accentColor},#bf5fff)`,
                border: "none",
                borderRadius: 12,
                padding: "13px",
                fontWeight: 800,
                fontSize: 14,
                color: "#07071a",
                cursor: loading ? "default" : "pointer",
                boxShadow: loading ? "none" : `0 6px 24px ${accentColor}44`,
                transition: "all 0.25s",
                marginBottom: 4,
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? "Submitting..." : "Submit Application 🚀"}
            </button>
            <p style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 8 }}>
              * Required fields. We respond within 2-3 business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}