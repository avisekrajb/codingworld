import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import ConsultationModal from './ConsultationModal';

export default function Pricing({ dark, C }) {
  const { t } = useLanguage();
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('upgrade');
  const [pricingData, setPricingData] = useState({
    free: { 
      price: '₹0', 
      features: [], 
      description: 'No commitment needed',
      isPopular: false 
    },
    upgrade: { 
      price: '₹500', 
      features: [], 
      description: 'One-time project fee',
      isPopular: true,
      badge: 'POPULAR'
    },
    premium: { 
      price: 'Custom', 
      features: [], 
      description: 'Enterprise-grade, fully custom',
      isPopular: false 
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await axios.get('/api/admin/pricing/public');
      if (response.data.success && response.data.data.length > 0) {
        const data = {};
        response.data.data.forEach(p => {
          data[p.plan] = {
            price: p.price,
            features: p.features || [],
            description: p.description,
            isPopular: p.isPopular,
            badge: p.badge
          };
        });
        setPricingData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationClick = (plan) => {
    setSelectedPlan(plan);
    setShowConsultation(true);
  };

  // Use API data first, fallback to translations
  const freeFeatures = pricingData.free.features.length > 0 
    ? pricingData.free.features 
    : (Array.isArray(t('pricing.free.features')) ? t('pricing.free.features') : []);
  
  const upgradeFeatures = pricingData.upgrade.features.length > 0 
    ? pricingData.upgrade.features 
    : (Array.isArray(t('pricing.upgrade.features')) ? t('pricing.upgrade.features') : []);

  if (loading) {
    return (
      <section id="pricing" style={{ padding: "90px 5%" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #00e5ff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: C.muted }}>Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" style={{ padding: "90px 5%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{
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
            {t('pricing.plans')}
          </span>
          <h2 style={{
            fontSize: "clamp(1.9rem,5vw,3rem)",
            fontWeight: 800,
            marginTop: 14,
            letterSpacing: "-1px",
            color: C.text
          }}>
            {t('pricing.title')} <span style={{ color: "#00e5ff" }}>{t('pricing.titleHighlight')}</span> {t('pricing.subtitle')}
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 20
        }}>
          {/* Free Plan */}
          <div style={{
            background: C.card,
            border: `1px solid ${pricingData.free.isPopular ? '#00e5ff' : C.border}`,
            borderRadius: 20,
            padding: 28,
            transition: "all 0.3s",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,229,255,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            {/* Background Pattern */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              background: "radial-gradient(circle, #00e5ff15, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none"
            }} />

            <span style={{
              background: "rgba(0,229,255,0.1)",
              color: "#00e5ff",
              border: "1px solid rgba(0,229,255,0.3)",
              borderRadius: 20,
              padding: "3px 13px",
              fontSize: 11,
              fontWeight: 700
            }}>
              {t('pricing.free.name')}
            </span>
            
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 13, color: C.text }}>
              {pricingData.free.price}
            </div>
            
            <div style={{ color: C.muted, fontSize: 13, marginTop: 3, marginBottom: 18 }}>
              {pricingData.free.description}
            </div>
            
            <div style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 280
            }}>
              {freeFeatures.length > 0 ? (
                freeFeatures.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                    <span style={{ fontSize: 18, color: '#00e5ff' }}>{item.icon || "✓"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{item.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{item.desc}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: 20 }}>
                  No features listed
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleConsultationClick('free')}
              style={{
                marginTop: 20,
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(0,229,255,0.4)",
                borderRadius: 9,
                padding: "11px",
                fontWeight: 700,
                fontSize: 13,
                color: "#00e5ff",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(0,229,255,0.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {t('pricing.free.button')}
            </button>
          </div>

          {/* Upgrade Plan */}
          <div style={{
            background: C.card,
            border: `1px solid ${pricingData.upgrade.isPopular ? '#bf5fff' : C.border}`,
            borderRadius: 20,
            padding: 28,
            position: "relative",
            overflow: "hidden",
            boxShadow: pricingData.upgrade.isPopular ? "0 0 50px rgba(191,95,255,0.15)" : "none",
            transform: "scale(1.02)",
            zIndex: 2
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 20px 50px rgba(191,95,255,0.25)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = pricingData.upgrade.isPopular ? "0 0 50px rgba(191,95,255,0.15)" : "none";
          }}>
            {/* Background Pattern */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              background: "radial-gradient(circle, #bf5fff15, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none"
            }} />

            {/* Popular Badge */}
            {pricingData.upgrade.isPopular && (
              <div style={{
                position: "absolute",
                top: 13,
                right: 13,
                background: "linear-gradient(135deg,#bf5fff,#7b2fff)",
                color: "#fff",
                fontSize: 9,
                fontWeight: 800,
                borderRadius: 20,
                padding: "3px 10px",
                zIndex: 3
              }}>
                {pricingData.upgrade.badge || 'POPULAR'}
              </div>
            )}

            <span style={{
              background: "rgba(191,95,255,0.1)",
              color: "#bf5fff",
              border: "1px solid rgba(191,95,255,0.3)",
              borderRadius: 20,
              padding: "3px 13px",
              fontSize: 11,
              fontWeight: 700
            }}>
              {t('pricing.upgrade.name')}
            </span>
            
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 13, color: "#bf5fff" }}>
              {pricingData.upgrade.price}
            </div>
            
            <div style={{ color: C.muted, fontSize: 13, marginTop: 3, marginBottom: 18 }}>
              {pricingData.upgrade.description}
            </div>
            
            <div style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 280
            }}>
              {upgradeFeatures.length > 0 ? (
                upgradeFeatures.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                    <span style={{ fontSize: 18, color: '#bf5fff' }}>{item.icon || "⚡"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{item.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{item.desc}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: 20 }}>
                  No features listed
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleConsultationClick('upgrade')}
              style={{
                marginTop: 20,
                width: "100%",
                background: "linear-gradient(135deg,#bf5fff,#7b2fff)",
                border: "none",
                borderRadius: 9,
                padding: "11px",
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(191,95,255,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {t('pricing.upgrade.button')}
            </button>
          </div>

          {/* Premium Plan */}
          <div style={{
            background: dark ? "linear-gradient(135deg,rgba(0,255,179,0.07),rgba(0,229,255,0.03))" : "linear-gradient(135deg,rgba(0,255,179,0.05),rgba(0,229,255,0.02))",
            border: "1px solid rgba(0,255,179,0.35)",
            borderRadius: 20,
            padding: 28,
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,255,179,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            {/* Background Pattern */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              background: "radial-gradient(circle, #00ffb315, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none"
            }} />

            <span style={{
              background: "rgba(0,255,179,0.1)",
              color: "#00ffb3",
              border: "1px solid rgba(0,255,179,0.35)",
              borderRadius: 20,
              padding: "3px 13px",
              fontSize: 11,
              fontWeight: 700
            }}>
              {t('pricing.premium.name')}
            </span>
            
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 13, color: "#00ffb3" }}>
              {pricingData.premium.price}
            </div>
            
            <div style={{ color: C.muted, fontSize: 13, marginTop: 3, marginBottom: 18 }}>
              {pricingData.premium.description}
            </div>
            
            <button
              onClick={() => handleConsultationClick('premium')}
              style={{
                marginTop: 20,
                width: "100%",
                background: "linear-gradient(135deg,#00ffb3,#00e5ff)",
                border: "none",
                borderRadius: 9,
                padding: "11px",
                fontWeight: 700,
                fontSize: 13,
                color: "#07071a",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,255,179,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {t('pricing.premium.button')}
            </button>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {showConsultation && (
        <ConsultationModal
          onClose={() => setShowConsultation(false)}
          dark={dark}
          C={C}
          plan={selectedPlan}
          accentColor={
            selectedPlan === 'free' ? '#00e5ff' :
            selectedPlan === 'upgrade' ? '#bf5fff' : '#00ffb3'
          }
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}