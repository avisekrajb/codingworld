import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import InternshipModal from '../components/InternshipModal'; // Import modal

const INTERNSHIP_FEATURES = [
  {
    icon: "🎯",
    title: "Real Projects",
    desc: "Work on live projects with real clients and deadlines"
  },
  {
    icon: "👨‍🏫",
    title: "Expert Mentorship",
    desc: "1-on-1 guidance from industry professionals"
  },
  {
    icon: "📜",
    title: "Certificate",
    desc: "Get certified upon successful completion"
  },
  {
    icon: "💰",
    title: "Stipend",
    desc: "Earn while you learn with monthly stipend"
  },
  {
    icon: "💼",
    title: "Job Opportunity",
    desc: "Top performers get full-time offers"
  },
  {
    icon: "🌐",
    title: "Remote Work",
    desc: "Work from anywhere, flexible hours"
  }
];

const TRACKS = [
  {
    name: "MEAN Stack",
    icon: "🟢",
    color: "#00e5ff",
    duration: "2-4 months",
    projects: ["E-commerce API", "Real-time Chat App", "Task Management System"]
  },
  {
    name: "MERN Stack",
    icon: "⚛️",
    color: "#bf5fff",
    duration: "2-4 months",
    projects: ["Social Media Clone", "Blog Platform", "Portfolio Builder"]
  },
  {
    name: "Full Stack Java",
    icon: "☕",
    color: "#ff9d00",
    duration: "3-4 months",
    projects: ["Banking App", "Inventory System", "HR Management"]
  },
  {
    name: "Python",
    icon: "🐍",
    color: "#00ffb3",
    duration: "2-3 months",
    projects: ["Data Analysis Tool", "ML Model Deployment", "Web Scraper"]
  }
];

const FAQ = [
  {
    q: "Is the internship paid?",
    a: "Yes! All our internships are paid. You'll receive a monthly stipend based on your performance and track."
  },
  {
    q: "What is the duration?",
    a: "Internships are available for 2, 3, or 4 months. You can choose based on your availability."
  },
  {
    q: "Do I need prior experience?",
    a: "Basic programming knowledge is required. We provide training and mentorship throughout."
  },
  {
    q: "Is it remote or in-office?",
    a: "Fully remote! You can work from anywhere with flexible timing."
  },
  {
    q: "Will I get a certificate?",
    a: "Yes, you'll receive an industry-recognized certificate upon successful completion."
  },
  {
    q: "Can I get a job after internship?",
    a: "Top performers get direct full-time offers. We also provide placement assistance."
  }
];

export default function InternshipPage({ dark, C }) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false); // State for modal
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section */}
      <section style={{
        padding: "60px 5% 40px",
        textAlign: "center",
        background: dark ? "rgba(0,229,255,0.02)" : "rgba(0,150,255,0.02)"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(191,95,255,0.12)",
            border: "1px solid rgba(191,95,255,0.35)",
            color: "#bf5fff",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontFamily: "'Space Mono',monospace",
            letterSpacing: 1,
            marginBottom: 20
          }}>
            🎓 INTERNSHIP PROGRAM 2025
          </span>
          
          <h1 style={{
            fontSize: "clamp(2.2rem,6vw,4rem)",
            fontWeight: 900,
            color: C.text,
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            Launch Your <span style={{ color: "#00e5ff" }}>Tech Career</span> With Us
          </h1>
          
          <p style={{
            fontSize: "clamp(1rem,2vw,1.2rem)",
            color: C.muted,
            maxWidth: 600,
            margin: "0 auto 30px",
            lineHeight: 1.8
          }}>
            Join our paid internship program and work on real-world projects with industry experts.
            Get hands-on experience, mentorship, and a certificate.
          </p>

          <div style={{ display: "flex", gap: 15, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowModal(true)} // Open modal on click
              style={{
                background: "linear-gradient(135deg,#00e5ff,#0095ff)",
                border: "none",
                borderRadius: 12,
                padding: "14px 32px",
                fontWeight: 800,
                fontSize: 15,
                color: "#07071a",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              Apply Now 🚀
            </button>
            <button
              onClick={() => document.getElementById('faq').scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "14px 32px",
                fontWeight: 600,
                fontSize: 15,
                color: C.text,
                cursor: "pointer"
              }}
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginTop: 50,
            flexWrap: "wrap"
          }}>
            {[
              ["50+", "Interns Hired"],
              ["100%", "Placement Rate"],
              ["₹15k", "Avg Stipend"],
              ["4.9", "Rating"]
            ].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#00e5ff" }}>{num}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "60px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 40,
            color: C.text
          }}>
            Why Join Our <span style={{ color: "#bf5fff" }}>Internship?</span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20
          }}>
            {INTERNSHIP_FEATURES.map((feature, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 24,
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,229,255,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 15 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.text }}>
                  {feature.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section style={{
        padding: "60px 5%",
        background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,200,0.025)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 40,
            color: C.text
          }}>
            Choose Your <span style={{ color: "#00e5ff" }}>Track</span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20
          }}>
            {TRACKS.map((track, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${track.color}44`,
                  borderRadius: 16,
                  padding: 24,
                  borderTop: `4px solid ${track.color}`
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{track.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 5, color: C.text }}>
                  {track.name}
                </h3>
                <p style={{ color: track.color, fontSize: 13, marginBottom: 15 }}>
                  ⏱ {track.duration}
                </p>
                <div>
                  <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Sample Projects:</p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {track.projects.map((proj, j) => (
                      <li key={j} style={{
                        fontSize: 12,
                        color: C.muted,
                        marginBottom: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 5
                      }}>
                        <span style={{ color: track.color }}>→</span> {proj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: "60px 5%" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 40,
            color: C.text
          }}>
            Frequently Asked <span style={{ color: "#ff9d00" }}>Questions</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  overflow: "hidden"
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color: C.text,
                    fontSize: 15,
                    fontWeight: 600,
                    textAlign: "left"
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{
                    transform: activeFaq === i ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s",
                    color: "#00e5ff"
                  }}>
                    ▼
                  </span>
                </button>
                {activeFaq === i && (
                  <div style={{
                    padding: "0 20px 18px 20px",
                    color: C.muted,
                    fontSize: 14,
                    lineHeight: 1.6,
                    animation: "slideDown 0.3s ease"
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: "40px 5% 60px",
        textAlign: "center"
      }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          background: `linear-gradient(135deg, #00e5ff10, #bf5fff10)`,
          border: `1px solid #00e5ff33`,
          borderRadius: 24,
          padding: "40px 30px"
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
          <h3 style={{
            fontSize: "clamp(1.5rem,3vw,2rem)",
            fontWeight: 800,
            color: C.text,
            marginBottom: 15
          }}>
            Ready to Start Your Journey?
          </h3>
          <p style={{ color: C.muted, marginBottom: 25 }}>
            Apply now and take the first step towards your tech career
          </p>
          <button
            onClick={() => setShowModal(true)} // Open modal on click
            style={{
              background: "linear-gradient(135deg,#00e5ff,#0095ff)",
              border: "none",
              borderRadius: 12,
              padding: "14px 32px",
              fontWeight: 800,
              fontSize: 15,
              color: "#07071a",
              cursor: "pointer"
            }}
          >
            Apply for Internship →
          </button>
        </div>
      </section>

      {/* Modal - opens when Apply Now or Apply for Internship is clicked */}
      {showModal && (
        <InternshipModal
          onClose={() => setShowModal(false)}
          dark={dark}
          C={C}
          accentColor="#00e5ff"
        />
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}