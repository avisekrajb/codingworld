import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import ConsultationModal from '../components/ConsultationModal';

export default function PricingPage({ dark, C }) {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('one-time'); // 'one-time' or 'monthly'
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('upgrade');
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState('upgrade');
  const [pricingData, setPricingData] = useState({
    free: { price: '₹0', features: [], description: 'No commitment needed', isPopular: false },
    upgrade: { price: '₹500', features: [], description: 'One-time project fee', isPopular: true, badge: 'POPULAR' },
    premium: { price: 'Custom', features: [], description: 'Enterprise-grade, fully custom', isPopular: false }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
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
      setError('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: t('pricing.free.name') || 'FREE',
      price: billingCycle === 'one-time' ? pricingData.free.price : '₹0',
      originalPrice: null,
      description: pricingData.free.description,
      features: pricingData.free.features,
      color: '#00e5ff',
      icon: '🎯',
      popular: pricingData.free.isPopular,
      buttonText: t('pricing.free.button') || 'Start Free →',
      savings: null
    },
    {
      id: 'upgrade',
      name: t('pricing.upgrade.name') || 'UPGRADE',
      price: billingCycle === 'one-time' ? pricingData.upgrade.price : '₹399',
      originalPrice: billingCycle === 'one-time' ? null : pricingData.upgrade.price,
      description: pricingData.upgrade.description,
      features: pricingData.upgrade.features,
      color: '#bf5fff',
      icon: '⚡',
      popular: pricingData.upgrade.isPopular,
      badge: pricingData.upgrade.badge,
      buttonText: t('pricing.upgrade.button') || 'Upgrade Now →',
      savings: billingCycle === 'monthly' ? 'Save 33%' : null
    },
    {
      id: 'premium',
      name: t('pricing.premium.name') || 'PREMIUM',
      price: billingCycle === 'one-time' ? pricingData.premium.price : 'Custom',
      originalPrice: null,
      description: pricingData.premium.description,
      features: pricingData.premium.features,
      color: '#00ffb3',
      icon: '👑',
      popular: pricingData.premium.isPopular,
      buttonText: t('pricing.premium.button') || 'Contact for Quote →',
      savings: null
    }
  ];

  const comparisons = [
    { feature: 'Project Duration', free: '1 week', upgrade: 'Unlimited', premium: 'Unlimited' },
    { feature: 'Revisions', free: '3', upgrade: 'Unlimited', premium: 'Unlimited' },
    { feature: 'Support', free: 'Email', upgrade: 'Priority 24/7', premium: 'Dedicated Manager' },
    { feature: 'Analytics', free: 'Basic', upgrade: 'Advanced', premium: 'Custom Dashboard' },
    { feature: 'Deployment', free: 'Basic', upgrade: 'Automated', premium: 'Enterprise' },
    { feature: 'Security', free: 'Basic', upgrade: 'Advanced', premium: 'Enterprise Grade' }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Startup Founder',
      text: 'The upgrade plan was perfect for our MVP. Fast delivery and great support!',
      plan: 'upgrade',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'E-commerce Owner',
      text: 'Premium plan gave us everything we needed. Worth every penny!',
      plan: 'premium',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'Freelancer',
      text: 'Free consultation helped me understand my project requirements clearly.',
      plan: 'free',
      rating: 5
    }
  ];

  const handleConsultationClick = (planId) => {
    setSelectedPlanForModal(planId);
    setShowConsultation(true);
  };

  if (loading) {
    return (
      <div style={{ 
        paddingTop: "80px",
        minHeight: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 50,
            height: 50,
            border: '3px solid #00e5ff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: C.muted }}>Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section */}
      <section style={{
        padding: "60px 5% 40px",
        textAlign: "center",
        background: dark ? "linear-gradient(180deg, rgba(0,229,255,0.05) 0%, transparent 100%)" : "linear-gradient(180deg, rgba(0,150,255,0.05) 0%, transparent 100%)"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
            💰 PRICING PLANS
          </span>
          
          <h1 style={{
            fontSize: "clamp(2.2rem,6vw,4rem)",
            fontWeight: 900,
            color: C.text,
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            Simple, <span style={{ color: "#00e5ff" }}>Transparent</span> Pricing
          </h1>
          
          <p style={{
            fontSize: "clamp(1rem,2vw,1.2rem)",
            color: C.muted,
            maxWidth: 600,
            margin: "0 auto 30px",
            lineHeight: 1.8
          }}>
            Choose the perfect plan for your project. No hidden fees, no surprises.
            All plans include a free consultation to understand your needs.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: "inline-flex",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 40,
            padding: 4,
            marginBottom: 20
          }}>
            <button
              onClick={() => setBillingCycle('one-time')}
              style={{
                padding: "10px 24px",
                borderRadius: 30,
                border: "none",
                background: billingCycle === 'one-time' ? "linear-gradient(135deg,#00e5ff,#0095ff)" : "transparent",
                color: billingCycle === 'one-time' ? "#07071a" : C.muted,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              One-time
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: "10px 24px",
                borderRadius: 30,
                border: "none",
                background: billingCycle === 'monthly' ? "linear-gradient(135deg,#00e5ff,#0095ff)" : "transparent",
                color: billingCycle === 'monthly' ? "#07071a" : C.muted,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              Monthly
              <span style={{
                background: "#ff9d00",
                color: "#07071a",
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 12,
                fontWeight: 800
              }}>
                SAVE 33%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: "20px 5% 60px" }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "stretch"
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                background: C.card,
                border: `2px solid ${
                  selectedPlan === plan.id 
                    ? plan.color 
                    : hoveredPlan === plan.id 
                      ? `${plan.color}66` 
                      : C.border
                }`,
                borderRadius: 24,
                padding: 32,
                position: "relative",
                overflow: "hidden",
                transform: hoveredPlan === plan.id ? "translateY(-8px)" : "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                cursor: "pointer",
                boxShadow: selectedPlan === plan.id 
                  ? `0 20px 40px ${plan.color}33` 
                  : hoveredPlan === plan.id 
                    ? `0 15px 30px rgba(0,0,0,0.1)` 
                    : "none"
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 150,
                height: 150,
                background: `radial-gradient(circle, ${plan.color}15, transparent 70%)`,
                borderRadius: "50%",
                pointerEvents: "none"
              }} />

              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: 20,
                  right: -35,
                  background: "linear-gradient(135deg,#00e5ff,#0095ff)",
                  color: "#07071a",
                  padding: "8px 40px",
                  fontSize: 12,
                  fontWeight: 800,
                  transform: "rotate(45deg)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}>
                  {plan.badge || 'MOST POPULAR'}
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && (
                <div style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  background: "#ff9d00",
                  color: "#07071a",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800
                }}>
                  {plan.savings}
                </div>
              )}

              {/* Plan Icon */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: `${plan.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                marginBottom: 20
              }}>
                {plan.icon}
              </div>

              {/* Plan Name */}
              <h3 style={{
                fontSize: 24,
                fontWeight: 800,
                color: C.text,
                marginBottom: 8
              }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: 16 }}>
                <span style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: plan.color
                }}>
                  {plan.price}
                </span>
                {plan.originalPrice && (
                  <span style={{
                    fontSize: 18,
                    color: C.muted,
                    textDecoration: "line-through",
                    marginLeft: 10
                  }}>
                    {plan.originalPrice}
                  </span>
                )}
                {billingCycle === 'monthly' && plan.id !== 'free' && plan.id !== 'premium' && (
                  <span style={{
                    fontSize: 14,
                    color: C.muted,
                    marginLeft: 8
                  }}>
                    /month
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{
                color: C.muted,
                fontSize: 14,
                marginBottom: 24,
                lineHeight: 1.6
              }}>
                {plan.description}
              </p>

              {/* Features */}
              <div style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: 20,
                marginBottom: 24,
                minHeight: 250
              }}>
                {plan.features && plan.features.length > 0 ? (
                  plan.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 12
                      }}
                    >
                      <span style={{
                        color: plan.color,
                        fontSize: 16,
                        flexShrink: 0
                      }}>
                        {feature.icon || "✓"}
                      </span>
                      <div>
                        <div style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: C.text,
                          marginBottom: 2
                        }}>
                          {feature.label}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: C.muted,
                          lineHeight: 1.4
                        }}>
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: 20 }}>
                    No features listed
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConsultationClick(plan.id);
                }}
                style={{
                  width: "100%",
                  background: selectedPlan === plan.id 
                    ? `linear-gradient(135deg,${plan.color},${plan.color}bb)`
                    : "transparent",
                  border: `2px solid ${plan.color}`,
                  borderRadius: 12,
                  padding: "14px",
                  fontWeight: 700,
                  fontSize: 15,
                  color: selectedPlan === plan.id ? "#07071a" : plan.color,
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => {
                  if (selectedPlan !== plan.id) {
                    e.currentTarget.style.background = `${plan.color}20`;
                  }
                }}
                onMouseLeave={e => {
                  if (selectedPlan !== plan.id) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {plan.buttonText}
              </button>

              {/* Hover Effect Line */}
              {hoveredPlan === plan.id && (
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${plan.color}, transparent)`,
                  animation: "slideLine 0.3s ease"
                }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={{
        padding: "60px 5%",
        background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,200,0.025)"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 40,
            color: C.text
          }}>
            Compare <span style={{ color: "#bf5fff" }}>Features</span>
          </h2>

          <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{
                  background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  borderBottom: `2px solid ${C.border}`
                }}>
                  <th style={{ padding: "18px 20px", textAlign: "left", color: C.text }}>Feature</th>
                  <th style={{ padding: "18px 20px", textAlign: "center", color: "#00e5ff" }}>FREE</th>
                  <th style={{ padding: "18px 20px", textAlign: "center", color: "#bf5fff" }}>UPGRADE</th>
                  <th style={{ padding: "18px 20px", textAlign: "center", color: "#00ffb3" }}>PREMIUM</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, i) => (
                  <tr key={i} style={{
                    borderBottom: i < comparisons.length - 1 ? `1px solid ${C.border}` : "none"
                  }}>
                    <td style={{ padding: "15px 20px", color: C.text, fontWeight: 500 }}>{item.feature}</td>
                    <td style={{ padding: "15px 20px", textAlign: "center", color: C.muted }}>{item.free}</td>
                    <td style={{ padding: "15px 20px", textAlign: "center", color: "#bf5fff", fontWeight: 600 }}>{item.upgrade}</td>
                    <td style={{ padding: "15px 20px", textAlign: "center", color: "#00ffb3", fontWeight: 600 }}>{item.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "60px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 40,
            color: C.text
          }}>
            What Our <span style={{ color: "#00e5ff" }}>Clients Say</span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20
          }}>
            {testimonials.map((test, i) => {
              const planColor = test.plan === 'free' ? '#00e5ff' : test.plan === 'upgrade' ? '#bf5fff' : '#00ffb3';
              return (
                <div
                  key={i}
                  style={{
                    background: C.card,
                    border: `1px solid ${planColor}33`,
                    borderRadius: 16,
                    padding: 24,
                    position: "relative"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: -10,
                    right: 20,
                    background: planColor,
                    color: "#07071a",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 800
                  }}>
                    {test.plan.toUpperCase()} PLAN
                  </div>
                  <div style={{ fontSize: 30, color: planColor, marginBottom: 10 }}>"</div>
                  <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 15 }}>
                    {test.text}
                  </p>
                  <div style={{ display: "flex", gap: 2, marginBottom: 15 }}>
                    {[...Array(test.rating)].map((_, i) => (
                      <span key={i} style={{ color: "#ffd700" }}>★</span>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text }}>{test.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{test.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{
        padding: "60px 5%",
        background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,200,0.025)"
      }}>
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
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                q: "Is there a money-back guarantee?",
                a: "Absolutely! We offer a 30-day money-back guarantee on all paid plans. No questions asked."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, UPI, and bank transfers. For enterprise plans, we also offer invoicing."
              },
              {
                q: "Do you offer custom plans?",
                a: "Yes! Contact us for custom enterprise solutions tailored to your specific needs."
              },
              {
                q: "Is there a free trial?",
                a: "The FREE plan includes a demo and consultation. You can try before committing to a paid plan."
              }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "#00e5ff", fontSize: 18 }}>❓</span>
                  <span style={{ fontWeight: 600, color: C.text }}>{item.q}</span>
                </div>
                <p style={{ color: C.muted, fontSize: 14, marginTop: 10, marginLeft: 30 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "40px 5% 80px", textAlign: "center" }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          background: `linear-gradient(135deg, #00e5ff10, #bf5fff10)`,
          border: `1px solid #00e5ff33`,
          borderRadius: 24,
          padding: "40px 30px"
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✨</div>
          <h3 style={{
            fontSize: "clamp(1.5rem,3vw,2rem)",
            fontWeight: 800,
            color: C.text,
            marginBottom: 15
          }}>
            Not Sure Which Plan to Choose?
          </h3>
          <p style={{ color: C.muted, marginBottom: 25 }}>
            Book a free consultation call. We'll help you find the perfect plan for your project.
          </p>
          <button
            onClick={() => handleConsultationClick('upgrade')}
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
            Get Free Consultation →
          </button>
        </div>
      </section>

      {/* Consultation Modal */}
      {showConsultation && (
        <ConsultationModal
          onClose={() => setShowConsultation(false)}
          dark={dark}
          C={C}
          plan={selectedPlanForModal}
          accentColor={
            selectedPlanForModal === 'free' ? '#00e5ff' :
            selectedPlanForModal === 'upgrade' ? '#bf5fff' : '#00ffb3'
          }
        />
      )}

      <style>{`
        @keyframes slideLine {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}