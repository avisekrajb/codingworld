import { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from '../components/ContactForm';
import LiveChatPreview from '../components/LiveChatPreview';
import { useLanguage } from '../context/LanguageContext';

const SOCIAL_LINKS = [
  { icon: "github", label: "GitHub", url: "https://github.com/codingworld", color: "#c9d1d9" },
  { icon: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/codingworld", color: "#0a66c2" },
  { icon: "whatsapp", label: "WhatsApp", url: "https://wa.me/9779824380896", color: "#25d366" },
  { icon: "instagram", label: "Instagram", url: "https://instagram.com/codingworld", color: "#e1306c" },
  { icon: "youtube", label: "YouTube", url: "https://youtube.com/@codingworld", color: "#ff0000" },
  { icon: "twitter", label: "Twitter/X", url: "https://twitter.com/codingworld", color: "#1d9bf0" }
];

// SVG Icons
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

const YoutubeSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitterSVG = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LocationSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ClockSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const GlobeSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ChatSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

function SocialIcon({ icon, s = 19, c = "currentColor" }) {
  if (icon === "github") return <GithubSVG s={s} c={c} />;
  if (icon === "linkedin") return <LinkedinSVG s={s} c={c} />;
  if (icon === "whatsapp") return <WhatsappSVG s={s} c={c} />;
  if (icon === "instagram") return <InstagramSVG s={s} c={c} />;
  if (icon === "youtube") return <YoutubeSVG s={s} c={c} />;
  if (icon === "twitter") return <TwitterSVG s={s} c={c} />;
  return null;
}

export default function ContactPage({ dark, C }) {
  const { t } = useLanguage();
  const [hovSoc, setHovSoc] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    office: 'Kathmandu, Nepal',
    phone: '+977 9824380896',
    email: 'hello@codingworld.com',
    hours: 'Mon-Fri: 9AM - 6PM, Sat: 10AM - 2PM'
  });

  // Google Maps Embed URL (Kathmandu)
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625955572!2d85.28413327433483!3d27.708951994882674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1709876543210!5m2!1sen!2snp";

  const handleFormSubmit = () => {
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section */}
      <section style={{
        padding: "60px 5% 40px",
        background: dark ? "rgba(0,229,255,0.02)" : "rgba(0,150,255,0.02)",
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20px 20px, #00e5ff 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <span style={{
            display: "inline-block",
            background: "rgba(0,229,255,0.12)",
            border: "1px solid rgba(0,229,255,0.35)",
            color: "#00e5ff",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontFamily: "'Space Mono',monospace",
            letterSpacing: 1,
            marginBottom: 20
          }}>
            {t('contact.subtitle') || "📞 GET IN TOUCH"}
          </span>

          <h1 style={{
            fontSize: "clamp(2.2rem,6vw,4rem)",
            fontWeight: 900,
            color: C.text,
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            {t('contact.title') || "Let's"} <span style={{ color: "#00e5ff" }}>{t('contact.titleHighlight') || "Talk"}</span> {t('contact.subtitle2') || "About Your Project"}
          </h1>

          <p style={{
            fontSize: "clamp(1rem,2vw,1.2rem)",
            color: C.muted,
            maxWidth: 700,
            margin: "0 auto 40px",
            lineHeight: 1.8
          }}>
            {t('contact.description') || "Have a project in mind? We're here to help. Whether you need a website, mobile app, or consultation, our team is ready to bring your ideas to life."}
          </p>

          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00e5ff' }}>500+</div>
              <div style={{ fontSize: 13, color: C.muted }}>{t('hero.projects') || "Projects Completed"}</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#bf5fff' }}>100+</div>
              <div style={{ fontSize: 13, color: C.muted }}>{t('testimonials.subtitle') || "Happy Clients"}</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00ffb3' }}>24/7</div>
              <div style={{ fontSize: 13, color: C.muted }}>{t('contact.support') || "Support Available"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section style={{ padding: "40px 5% 60px" }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 30
        }}>
          {/* Left Column - Contact Info & Map */}
          <div>
            {/* Contact Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 15,
              marginBottom: 20
            }}>
              <ContactCard
                icon={<LocationSVG />}
                title={t('contact.visitUs') || "Visit Us"}
                content={contactInfo.office}
                color="#00e5ff"
                dark={dark}
                C={C}
              />
              <ContactCard
                icon={<PhoneSVG />}
                title={t('contact.callUs') || "Call Us"}
                content={contactInfo.phone}
                color="#bf5fff"
                dark={dark}
                C={C}
              />
              <ContactCard
                icon={<MailSVG />}
                title={t('contact.emailUs') || "Email Us"}
                content={contactInfo.email}
                color="#00ffb3"
                dark={dark}
                C={C}
              />
              <ContactCard
                icon={<ClockSVG />}
                title={t('contact.workingHours') || "Working Hours"}
                content={contactInfo.hours}
                color="#ff9d00"
                dark={dark}
                C={C}
              />
            </div>

            {/* Google Maps */}
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              overflow: 'hidden',
              marginBottom: 20
            }}>
              <div style={{
                padding: '15px 20px',
                borderBottom: `1px solid ${C.border}`,
                background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <GlobeSVG />
                <span style={{ color: C.text, fontWeight: 600 }}>{t('contact.ourLocation') || "Our Location"}</span>
              </div>
              <div style={{ height: 300 }}>
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div>

            {/* Social Links */}
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 20
            }}>
              <h3 style={{ color: C.text, fontSize: 16, marginBottom: 15 }}>{t('contact.connectWithUs') || "Connect With Us"}</h3>
              <div style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap'
              }}>
                {SOCIAL_LINKS.map(s => (
                  <a
                    key={s.icon}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setHovSoc(s.icon)}
                    onMouseLeave={() => setHovSoc(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      border: `1px solid ${hovSoc === s.icon ? s.color + "88" : C.border}`,
                      background: hovSoc === s.icon ? s.color + "22" : C.glass,
                      backdropFilter: "blur(8px)",
                      boxShadow: hovSoc === s.icon ? `0 8px 24px ${s.color}28` : "none",
                      transition: "all 0.25s",
                      cursor: "pointer",
                      textDecoration: "none"
                    }}
                  >
                    <SocialIcon icon={s.icon} s={17} c={hovSoc === s.icon ? s.color : C.muted} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <ContactForm
              dark={dark}
              C={C}
              onSuccess={handleFormSubmit}
            />
          </div>
        </div>
      </section>

      {/* Live Chat Preview Section */}
      <section style={{ padding: "0 5% 60px" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <LiveChatPreview dark={dark} C={C} onOpen={() => setShowChat(true)} />
        </div>
      </section>

      {/* FAQ Section */}
     {/* FAQ Section */}
<section style={{ padding: "0 5% 60px" }}>
  <div style={{ maxWidth: 800, margin: '0 auto' }}>
    <h2 style={{
      fontSize: 28,
      fontWeight: 800,
      textAlign: 'center',
      color: C.text,
      marginBottom: 30
    }}>
      Frequently Asked <span style={{ color: '#00e5ff' }}>Questions</span>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        {
          q: "How quickly do you respond to messages?",
          a: "We typically respond within 2-4 hours during business hours. For urgent matters, please use WhatsApp for faster response."
        },
        {
          q: "Do you offer free consultations?",
          a: "Yes! We offer a free 30-minute consultation to discuss your project requirements and provide initial recommendations."
        },
        {
          q: "Can I schedule a video call?",
          a: "Absolutely! After initial contact, we can schedule a video call via Zoom, Google Meet, or your preferred platform."
        },
        {
          q: "What information should I provide?",
          a: "Share your project idea, requirements, timeline, and budget if you have one. The more details, the better we can assist!"
        }
      ].map((faq, i) => (
        <div
          key={i}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '18px 20px',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateX(5px)';
            e.currentTarget.style.borderColor = '#00e5ff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          <h4 style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
            {faq.q}
          </h4>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
            {faq.a}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Newsletter Section */}
      <section style={{ padding: "0 5% 60px" }}>
        <div style={{
          maxWidth: 600,
          margin: '0 auto',
          background: `linear-gradient(135deg, ${C.card}, ${C.card}ee)`,
          border: `1px solid ${C.border}`,
          borderRadius: 24,
          padding: 40,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            fontSize: 100,
            opacity: 0.1,
            transform: 'rotate(15deg)'
          }}>
            ✉️
          </div>
          
          <h3 style={{
            fontSize: 22,
            fontWeight: 800,
            color: C.text,
            marginBottom: 10
          }}>
            {t('contact.newsletterTitle') || "Stay Updated"}
          </h3>
          <p style={{
            color: C.muted,
            fontSize: 14,
            marginBottom: 25,
            lineHeight: 1.6
          }}>
            {t('contact.newsletterDesc') || "Subscribe to our newsletter for the latest updates, tips, and exclusive offers."}
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="email"
              placeholder={t('contact.emailPlaceholder') || "Your email address"}
              style={{
                flex: 1,  
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '1px 5px',
                color: C.text,
                fontSize: 14,
                outline: 'none'
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
              border: 'none',
              borderRadius: 10,
              padding: '12px 25px',
              color: '#07071a',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              {t('contact.subscribe') || "Subscribe"}
            </button>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {formSubmitted && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 30,
          zIndex: 1000,
          background: 'linear-gradient(135deg,#00ffb3,#00e5ff)',
          color: '#07071a',
          padding: '15px 25px',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,255,179,0.3)',
          animation: 'slideIn 0.3s ease'
        }}>
          ✅ {t('contact.successMessage') || "Message sent successfully! We'll reply within 24 hours."}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// Contact Card Component
function ContactCard({ icon, title, content, color, dark, C }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${isHovered ? color : C.border}`,
        borderRadius: 16,
        padding: 20,
        transition: 'all 0.3s',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 10px 30px ${color}20` : 'none',
        cursor: 'default'
      }}
    >
      <div style={{ color: isHovered ? color : C.muted, marginBottom: 10, transition: 'color 0.3s' }}>
        {icon}
      </div>
      <h4 style={{
        fontSize: 14,
        fontWeight: 600,
        color: C.muted,
        marginBottom: 5,
        transition: 'color 0.3s'
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: 14,
        color: isHovered ? color : C.text,
        lineHeight: 1.5,
        transition: 'color 0.3s',
        fontWeight: isHovered ? 600 : 400
      }}>
        {content}
      </p>
    </div>
  );
}