import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CHAT_KB, CHAT_QUICK } from '../utils/chatbotData';

// ============= SVG Components =============
const BotSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="9" cy="16" r="1" fill="currentColor" />
    <circle cx="15" cy="16" r="1" fill="currentColor" />
  </svg>
);

const SendSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const MicSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const CloseSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SpeakerSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const HomeSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ServicesSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ProjectsSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PricingSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ContactSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const DownloadSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShareSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const ClearSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
    <path d="M18 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" />
  </svg>
);

// ============= Helper Functions =============
function getBotReply(msg, navigate, location, websiteData) {
  const lower = msg.toLowerCase();
  
  // Check for navigation commands
  if (lower.includes('go to home') || lower.includes('home page')) {
    navigate('/');
    return "Taking you to the Home page! 🏠";
  }
  if (lower.includes('go to services') || lower.includes('services page')) {
    navigate('/services');
    return "Taking you to the Services page! ⚡";
  }
  if (lower.includes('go to projects') || lower.includes('projects page')) {
    navigate('/projects');
    return "Taking you to the Projects page! 📁";
  }
  if (lower.includes('go to pricing') || lower.includes('pricing page')) {
    navigate('/pricing');
    return "Taking you to the Pricing page! 💰";
  }
  if (lower.includes('go to contact') || lower.includes('contact page')) {
    navigate('/contact');
    return "Taking you to the Contact page! 📞";
  }
  if (lower.includes('go to internship') || lower.includes('internship page')) {
    navigate('/internship');
    return "Taking you to the Internship page! 🎓";
  }

  // Check for website information queries
  if (lower.includes('what is this website') || lower.includes('about this site')) {
    return "This is **Coding World** - a full-stack development agency specializing in web development, mobile apps, UI/UX design, and digital solutions. We help businesses bring their ideas to life with cutting-edge technology! 🚀";
  }
  
  if (lower.includes('what services') || lower.includes('services offered')) {
    return "We offer **11+ services** including:\n• Web Development\n• Mobile Apps\n• UI/UX Design\n• E-Commerce\n• API Integration\n• SEO & Performance\n• Cyber Security\n• Cloud & DevOps\n• AI & Automation\n• Database Management\n• Analytics & BI\n\nWhich service interests you? 💡";
  }
  
  if (lower.includes('who is the founder') || lower.includes('owner')) {
    return "Coding World is founded by **Abhishek Rajbanshi**, a passionate full-stack developer with 3+ years of experience. He leads a team of creative builders dedicated to delivering exceptional digital solutions! 👨‍💻";
  }
  
  if (lower.includes('team size') || lower.includes('how many people')) {
    return "We have a growing team of **10+ talented professionals** including developers, designers, QA engineers, and project managers. Everyone is committed to delivering quality work! 👥";
  }
  
  if (lower.includes('technologies') || lower.includes('tech stack')) {
    return "Our tech stack includes:\n**Frontend:** React, Next.js, Vue.js, React Native\n**Backend:** Node.js, Express, Laravel, Python\n**Database:** MongoDB, PostgreSQL, MySQL\n**Cloud:** AWS, GCP, Docker, Kubernetes\n**Tools:** Git, Figma, Postman, Jira ⚡";
  }
  
  if (lower.includes('pricing') || lower.includes('cost') || lower.includes('price')) {
    return "We offer **3 flexible plans**:\n\n**FREE** - ₹0\n• Demo & Consultation\n• Requirement Analysis\n• Project Documentation\n\n**UPGRADE** - ₹500 one-time\n• Priority Support\n• Custom Design\n• Unlimited Revisions\n• Deployment Included\n\n**PREMIUM** - Custom Pricing\n• Dedicated Manager\n• Enterprise Security\n• AI Integration\n• 24/7 Support\n\nWant a custom quote? Contact us! 💰";
  }
  
  if (lower.includes('project timeline') || lower.includes('how long')) {
    return "Project timelines vary by complexity:\n• **Landing Page:** 2-5 days\n• **Web Application:** 2-4 weeks\n• **Mobile App:** 4-8 weeks\n• **Enterprise Solution:** Custom timeline\n\nWe pride ourselves on fast delivery without compromising quality! ⏱️";
  }
  
  if (lower.includes('internship') || lower.includes('intern')) {
    return "🎓 **Internship Program Details:**\n\n**Available Tracks:**\n• MEAN Stack\n• MERN Stack\n• Full Stack Java\n• Python\n\n**Duration:** 2, 3, or 4 months\n\n**Benefits:**\n• Paid internship with stipend\n• Industry-recognized certificate\n• Real-world projects\n• Expert mentorship\n• Job placement assistance\n\nClick the **'Interested'** button on the internship banner to apply! 🚀";
  }
  
  if (lower.includes('hire') || lower.includes('freelance')) {
    return "Yes! We're available for **freelance projects**. Whether it's a quick fix or a full-scale application, we're ready to collaborate. Contact us via WhatsApp at **+977-9824380896** or email at **hello@codingworld.com** for a free consultation! 💼";
  }
  
  if (lower.includes('portfolio') || lower.includes('projects done')) {
    return "📁 **Recent Projects:**\n\n• **ShopNP** - Full-stack e-commerce platform\n• **FoodDash** - Food delivery with GPS tracking\n• **EduLearn** - Learning platform with courses\n• **ClinicPro** - Hospital management system\n• **RealEstatePro** - Property listing platform\n• **FinTrack** - Finance tracker with analytics\n\nCheck out our **Projects** page for details! 🔍";
  }
  
  if (lower.includes('testimonial') || lower.includes('review') || lower.includes('client say')) {
    return "⭐ **What Our Clients Say:**\n\n\"Coding World transformed our idea into a stunning product!\" - Rajesh Kumar, Startup Founder\n\n\"Our sales doubled after the new website. Outstanding results!\" - Priya Sharma, E-Commerce Owner\n\n\"Best developers I've worked with. Clean code, great communication!\" - Mohammed Ali, Agency Director\n\nRead more on our **Testimonials** page! 💬";
  }
  
  if (lower.includes('contact') || lower.includes('reach out')) {
    return "📞 **Contact Us:**\n\n• **Email:** hello@codingworld.com\n• **WhatsApp:** +977-9824380896\n• **Phone:** +977-9824380896\n• **Location:** Kathmandu, Nepal\n\n**Working Hours:** Mon-Fri: 9AM-6PM, Sat: 10AM-2PM\n\nWe respond within 24 hours! 💬";
  }
  
  if (lower.includes('support') || lower.includes('help')) {
    return "🆘 **Need Help?**\n\nYou can:\n• Ask me anything about our services\n• Check our FAQ section\n• Contact support at hello@codingworld.com\n• WhatsApp us at +977-9824380896\n• Schedule a free consultation\n\nWhat would you like to know? 🤔";
  }
  
  if (lower.includes('location') || lower.includes('where are you')) {
    return "📍 We're based in **Kathmandu, Nepal**, but we work with clients **worldwide**! All our services are available remotely via video calls, chat, and email. 🌍";
  }
  
  if (lower.includes('payment') || lower.includes('pay')) {
    return "💳 **Payment Methods:**\n\nWe accept:\n• Bank Transfer\n• PayPal\n• Stripe\n• Wise\n• Cryptocurrency (for select clients)\n\nPayment terms are discussed during project kickoff. 50% advance, 50% upon completion for standard projects. 🔒";
  }
  
  if (lower.includes('guarantee') || lower.includes('warranty')) {
    return "✅ **Our Guarantee:**\n\n• 100% Satisfaction Guarantee\n• 30-day free support after project completion\n• Bug fixes at no additional cost\n• Money-back guarantee if not satisfied\n\nWe stand by our work! 💪";
  }
  
  if (lower.includes('maintenance') || lower.includes('update')) {
    return "🛠️ **Maintenance Services:**\n\nWe offer:\n• Regular security updates\n• Performance optimization\n• Content updates\n• Bug fixes\n• Feature enhancements\n\nMaintenance plans start at ₹2000/month. Ask for details! 🔧";
  }
  
  if (lower.includes('security') || lower.includes('safe')) {
    return "🔒 **Security Measures:**\n\nWe take security seriously:\n• SSL/TLS encryption\n• Regular security audits\n• DDoS protection\n• Secure coding practices\n• GDPR compliance\n\nYour data is safe with us! 🛡️";
  }
  
  if (lower.includes('current page') || lower.includes('this page')) {
    const pageName = location.pathname === '/' ? 'Home' : 
                      location.pathname === '/services' ? 'Services' :
                      location.pathname === '/projects' ? 'Projects' :
                      location.pathname === '/pricing' ? 'Pricing' :
                      location.pathname === '/testimonials' ? 'Testimonials' :
                      location.pathname === '/contact' ? 'Contact' :
                      location.pathname === '/internship' ? 'Internship' : 
                      'this page';
    return `You're currently on the **${pageName}** page. Need help with anything specific about ${pageName}? 😊`;
  }

  for (const kb of CHAT_KB) {
    if (kb.keys.some(k => lower.includes(k))) return kb.answer;
  }
  
  return "I'm not sure about that! 🤔 Try asking about:\n• **Services** we offer\n• **Pricing** plans\n• **Projects** portfolio\n• **Internship** program\n• **Contact** information\n• **Technologies** we use\n• **Timeline** for projects\n• **Location** and support\n\nType 'help' for more options! 💙";
}

function formatMsg(text, navigate, dark) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**')) {
      const content = p.slice(2, -2);
      // Check if it's a navigation link
      if (content.toLowerCase().includes('home')) {
        return (
          <button
            key={i}
            onClick={() => navigate('/')}
            style={{
              background: dark ? '#00e5ff20' : '#00e5ff10',
              border: '1px solid #00e5ff44',
              borderRadius: 12,
              padding: '4px 10px',
              color: '#00e5ff',
              cursor: 'pointer',
              margin: '0 2px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <HomeSVG /> Home
          </button>
        );
      }
      if (content.toLowerCase().includes('service')) {
        return (
          <button
            key={i}
            onClick={() => navigate('/services')}
            style={{
              background: dark ? '#bf5fff20' : '#bf5fff10',
              border: '1px solid #bf5fff44',
              borderRadius: 12,
              padding: '4px 10px',
              color: '#bf5fff',
              cursor: 'pointer',
              margin: '0 2px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <ServicesSVG /> Services
          </button>
        );
      }
      if (content.toLowerCase().includes('project')) {
        return (
          <button
            key={i}
            onClick={() => navigate('/projects')}
            style={{
              background: dark ? '#00ffb320' : '#00ffb310',
              border: '1px solid #00ffb344',
              borderRadius: 12,
              padding: '4px 10px',
              color: '#00ffb3',
              cursor: 'pointer',
              margin: '0 2px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <ProjectsSVG /> Projects
          </button>
        );
      }
      if (content.toLowerCase().includes('pricing')) {
        return (
          <button
            key={i}
            onClick={() => navigate('/pricing')}
            style={{
              background: dark ? '#ff9d0020' : '#ff9d0010',
              border: '1px solid #ff9d0044',
              borderRadius: 12,
              padding: '4px 10px',
              color: '#ff9d00',
              cursor: 'pointer',
              margin: '0 2px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <PricingSVG /> Pricing
          </button>
        );
      }
      if (content.toLowerCase().includes('contact')) {
        return (
          <button
            key={i}
            onClick={() => navigate('/contact')}
            style={{
              background: dark ? '#ff6b6b20' : '#ff6b6b10',
              border: '1px solid #ff6b6b44',
              borderRadius: 12,
              padding: '4px 10px',
              color: '#ff6b6b',
              cursor: 'pointer',
              margin: '0 2px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <ContactSVG /> Contact
          </button>
        );
      }
      if (content.toLowerCase().includes('internship')) {
        return (
          <button
            key={i}
            onClick={() => navigate('/internship')}
            style={{
              background: dark ? '#25d36620' : '#25d36610',
              border: '1px solid #25d36644',
              borderRadius: 12,
              padding: '4px 10px',
              color: '#25d366',
              cursor: 'pointer',
              margin: '0 2px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            🎓 Internship
          </button>
        );
      }
      return <strong key={i} style={{ color: "#00e5ff" }}>{content}</strong>;
    }
    return p.split('\n').map((line, j) => (
      <span key={j}>
        {line}
        {j < p.split('\n').length - 1 ? <br /> : null}
      </span>
    ));
  });
}

// ============= Main Component =============
export default function ChatBot({ dark, C }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatTyping, setChatTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const STORAGE_KEY = 'coding_world_chat_history';
  const EXPIRY_DAYS = 5;
  const isMobile = window.innerWidth <= 768;

  // Website data for context
  const websiteData = {
    name: "Coding World",
    founder: "Abhishek Rajbanshi",
    teamSize: "10+",
    location: "Kathmandu, Nepal",
    services: 11,
    projects: 50,
    clients: 100,
    satisfaction: "100%",
    support: "24/7"
  };

  // Close chat on navigation (mobile only)
  useEffect(() => {
    if (isMobile && chatOpen) {
      setChatOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Load chat history from localStorage with expiry
  useEffect(() => {
    const loadChatHistory = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const { messages, timestamp } = JSON.parse(stored);
          const now = new Date().getTime();
          const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
          
          if (now - timestamp < expiryTime) {
            setChatMsgs(messages);
            return;
          }
        } catch (e) {
          console.error("Error loading chat history:", e);
        }
      }
      
      setChatMsgs([{
        role: "bot",
        text: "Hi! 👋 I'm **Coding World Bot**, your AI assistant. I know everything about our website! Ask me about **services**, **pricing**, **projects**, **internship**, **technologies**, or just type 'help' to see what I can do!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };

    loadChatHistory();
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatMsgs.length > 0) {
      const toStore = {
        messages: chatMsgs,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [chatMsgs]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs, chatTyping]);

  // Auto-suggestions based on input
  useEffect(() => {
    if (chatInput.length > 2) {
      const lower = chatInput.toLowerCase();
      const matches = CHAT_QUICK.filter(q => 
        q.toLowerCase().includes(lower)
      ).slice(0, 3);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [chatInput]);

  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMsgs(m => [...m, { role: "user", text: msg, time }]);
    setChatInput("");
    setSuggestions([]);
    setChatTyping(true);
    
    setTimeout(() => {
      setChatTyping(false);
      const reply = getBotReply(msg, navigate, location, websiteData);
      const t2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMsgs(m => [...m, { role: "bot", text: reply, time: t2 }]);
    }, 850 + Math.random() * 500);
  };

  const sendQuick = (q) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMsgs(m => [...m, { role: "user", text: q, time }]);
    setChatTyping(true);
    
    setTimeout(() => {
      setChatTyping(false);
      const reply = getBotReply(q, navigate, location, websiteData);
      const t2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMsgs(m => [...m, { role: "bot", text: reply, time: t2 }]);
    }, 850 + Math.random() * 500);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition not supported.");
      return;
    }
    
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.continuous = false;
    
    r.onresult = e => {
      const transcript = e.results[0][0].transcript;
      setChatInput(transcript);
      setListening(false);
      setTimeout(() => {
        if (transcript.trim()) {
          sendChat();
        }
      }, 500);
    };
    
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    
    recognitionRef.current = r;
    r.start();
    setListening(true);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*/g, '').replace(/•/g, '').replace(/\n/g, ' ');
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.05;
    u.pitch = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const clearChat = () => {
    if (window.confirm('Clear chat history?')) {
      setChatMsgs([{
        role: "bot",
        text: "Chat cleared! I'm still here to help. Ask me anything about Coding World! 👋",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      localStorage.removeItem(STORAGE_KEY);
      setUnreadCount(0);
    }
  };

  const downloadChat = () => {
    const chatText = chatMsgs.map(m => 
      `[${m.time}] ${m.role === 'bot' ? '🤖 Bot' : '👤 You'}: ${m.text.replace(/\*\*/g, '')}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareChat = async () => {
    const chatText = chatMsgs.map(m => 
      `[${m.time}] ${m.role === 'bot' ? '🤖 Bot' : '👤 You'}: ${m.text.replace(/\*\*/g, '')}`
    ).join('\n\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat with Coding World Bot',
          text: chatText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(chatText);
      alert('Chat copied to clipboard!');
    }
  };

  const showHelp = () => {
    sendQuick('help');
  };

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '🚀', '💡', '💻', '📱', '⚡', '💰', '📞', '✉️', '👋', '🙏', '✅', '❌', '⭐', '🏆'];

  return (
    <div style={{ 
      position: "fixed", 
      bottom: isMobile ? 0 : 22, 
      right: isMobile ? 0 : 22, 
      left: isMobile ? 0 : 'auto',
      zIndex: 400, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "flex-end", 
      gap: 10 
    }}>
      {chatOpen && (
        <div className="chat-window" style={{
          width: isMobile ? '100%' : 400,
          height: isMobile ? '85vh' : 580,
          background: dark ? "linear-gradient(160deg,#0d0d28,#0a0a1e)" : "linear-gradient(160deg,#f8f8ff,#eeeefa)",
          backdropFilter: "blur(32px)",
          border: isMobile ? 'none' : `1px solid ${C.border}`,
          borderRadius: isMobile ? '24px 24px 0 0' : 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: isMobile ? '0 -10px 30px rgba(0,0,0,0.3)' : `0 28px 80px rgba(0,0,0,0.4), 0 0 0 1px #00e5ff22`,
          animation: isMobile ? "slideUpMobile 0.35s cubic-bezier(0.34,1.4,0.64,1) both" : "chatPop 0.35s cubic-bezier(0.34,1.4,0.64,1) both",
          position: isMobile ? 'fixed' : 'relative',
          bottom: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : 'auto'
        }}>
          <style>{`
            @keyframes chatPop {
              from { opacity: 0; transform: translateY(30px) scale(0.92); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes slideUpMobile {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            @keyframes typingDot {
              0%,80%,100% { transform: scale(0.8); opacity: 0.5; }
              40% { transform: scale(1.2); opacity: 1; }
            }
            @keyframes chatBubble {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulseGreen {
              0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.4); }
              50% { box-shadow: 0 0 0 8px rgba(37,211,102,0); }
            }
            @keyframes pulse {
              0%,100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: isMobile ? "20px 16px 14px" : "16px 20px",
            background: `linear-gradient(135deg, #00e5ff, #bf5fff)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0
          }}>
            {isMobile && (
              <div style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 40,
                height: 4,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.5)'
              }} />
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
                }}>
                  <BotSVG />
                </div>
                <div style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#25d366",
                  border: `2px solid ${dark ? "#0d0d28" : "#f8f8ff"}`,
                  animation: "pulseGreen 2s ease infinite"
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#07071a" }}>Coding World Bot</div>
                <div style={{ fontSize: 11, color: "#07071a", opacity: 0.8, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#25d366", display: "inline-block" }} />
                  Online · Knows everything about us!
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={showHelp}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#07071a"
                }}
                title="Help"
              >
                ❓
              </button>
              <button
                onClick={clearChat}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#07071a"
                }}
                title="Clear chat"
              >
                <ClearSVG />
              </button>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#07071a"
                }}
              >
                <CloseSVG />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            scrollbarWidth: "thin"
          }}>
            {chatMsgs.map((m, i) => (
              <div
                key={i}
                className="chat-msg"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.role === "user" ? "flex-end" : "flex-start",
                  gap: 4,
                  animation: "chatBubble 0.3s ease both"
                }}
              >
                {m.role === "bot" && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, maxWidth: "85%" }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#00e5ff,#bf5fff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 14
                    }}>🤖</div>
                    <div>
                      <div style={{
                        background: dark ? "rgba(0,229,255,0.1)" : "rgba(0,150,255,0.08)",
                        border: `1px solid ${dark ? '#00e5ff33' : '#00e5ff22'}`,
                        borderRadius: "4px 14px 14px 14px",
                        padding: "10px 14px",
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: C.text
                      }}>
                        {formatMsg(m.text, navigate, dark)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: C.muted }}>{m.time}</span>
                        <button
                          onClick={() => speakText(m.text)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: C.muted,
                            display: "flex",
                            padding: 0,
                            opacity: 0.6
                          }}
                        >
                          <SpeakerSVG />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {m.role === "user" && (
                  <div style={{ maxWidth: "85%" }}>
                    <div style={{
                      background: "linear-gradient(135deg,#00e5ff,#0095ff)",
                      borderRadius: "14px 4px 14px 14px",
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "#07071a"
                    }}>
                      {m.text}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                  </div>
                )}
              </div>
            ))}
            {chatTyping && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#00e5ff,#bf5fff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14
                }}>🤖</div>
                <div style={{
                  background: dark ? "rgba(0,229,255,0.1)" : "rgba(0,150,255,0.08)",
                  border: `1px solid #00e5ff22`,
                  borderRadius: "4px 14px 14px 14px",
                  padding: "12px 16px",
                  display: "flex",
                  gap: 6,
                  alignItems: "center"
                }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#00e5ff",
                        animation: `typingDot 1.2s ease ${d}s infinite`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Navigation Chips */}
          <div style={{
            padding: "10px 16px",
            borderTop: `1px solid ${C.border}11`,
            borderBottom: `1px solid ${C.border}11`,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
          }}>
            {/* <NavChip icon="🏠" label="Home" onClick={() => { navigate('/'); setChatOpen(false); }} color="#00e5ff" dark={dark} />
            <NavChip icon="⚡" label="Services" onClick={() => { navigate('/services'); setChatOpen(false); }} color="#bf5fff" dark={dark} />
            <NavChip icon="📁" label="Projects" onClick={() => { navigate('/projects'); setChatOpen(false); }} color="#00ffb3" dark={dark} />
            <NavChip icon="💰" label="Pricing" onClick={() => { navigate('/pricing'); setChatOpen(false); }} color="#ff9d00" dark={dark} />
            <NavChip icon="📞" label="Contact" onClick={() => { navigate('/contact'); setChatOpen(false); }} color="#ff6b6b" dark={dark} />
            <NavChip icon="🎓" label="Internship" onClick={() => { navigate('/internship'); setChatOpen(false); }} color="#25d366" dark={dark} /> */}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{
              padding: "8px 16px",
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              background: dark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)'
            }}>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setChatInput(s);
                    sendQuick(s);
                  }}
                  style={{
                    background: dark ? '#00e5ff15' : '#00e5ff10',
                    border: `1px solid #00e5ff44`,
                    borderRadius: 20,
                    padding: '5px 12px',
                    fontSize: 12,
                    color: '#00e5ff',
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: "12px 16px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexShrink: 0
          }}>
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: showEmoji ? '#00e5ff' : (dark ? '#00e5ff20' : '#00e5ff10'),
                border: `1px solid ${showEmoji ? '#00e5ff' : '#00e5ff44'}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 18
              }}
            >
              😊
            </button>

            <button
              onClick={toggleVoice}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: listening ? "#ff6b6b" : (dark ? '#00e5ff20' : '#00e5ff10'),
                border: `1px solid ${listening ? "#ff6b6b" : "#00e5ff44"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: listening ? "#fff" : "#00e5ff"
              }}
            >
              {listening ? <MicOffSVG /> : <MicSVG />}
            </button>

            <input
              ref={inputRef}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
              placeholder="Ask me anything about Coding World..."
              style={{
                flex: 1,
                background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 13,
                color: C.text,
                outline: "none",
                fontFamily: "'Outfit', sans-serif"
              }}
            />

            <button
              onClick={sendChat}
              disabled={!chatInput.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                cursor: chatInput.trim() ? "pointer" : "default",
                background: chatInput.trim() ? "linear-gradient(135deg,#00e5ff,#0095ff)" : "rgba(128,128,180,0.2)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: chatInput.trim() ? "#07071a" : C.muted
              }}
            >
              <SendSVG />
            </button>

            {showEmoji && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: 16,
                background: dark ? '#0d0d28' : '#ffffff',
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: 12,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 8,
                marginBottom: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 10
              }}>
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setChatInput(prev => prev + emoji);
                      setShowEmoji(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 22,
                      cursor: 'pointer',
                      padding: 5,
                      borderRadius: 8,
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: "linear-gradient(135deg,#00e5ff,#bf5fff)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#07071a",
            boxShadow: "0 6px 28px #00e5ff55",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            position: isMobile ? 'fixed' : 'relative',
            bottom: isMobile ? 20 : 'auto',
            right: isMobile ? 20 : 'auto',
            animation: 'pulse 2s ease infinite'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <BotSVG />
          {unreadCount > 0 && (
            <div style={{
              position: "absolute",
              top: -5,
              right: -5,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              background: "#ff6b6b",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5px"
            }}>
              {unreadCount}
            </div>
          )}
        </button>
      )}
    </div>
  );
}

// Navigation Chip Component
function NavChip({ icon, label, onClick, color, dark }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: dark ? `${color}15` : `${color}08`,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        color: color,
        fontSize: 12,
        fontWeight: 500,
        transition: 'all 0.2s'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}30`;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = dark ? `${color}15` : `${color}08`;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}