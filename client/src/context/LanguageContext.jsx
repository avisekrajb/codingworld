import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
  ENGLISH: 'en',
  NEPALI: 'np'
};

export const translations = {
  [languages.ENGLISH]: {
    // Navigation
    nav: {
      home: 'Home',
      services: 'Services',
      projects: 'Projects',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      contact: 'Contact',
      internship: 'Internship',
      getStarted: 'Get Started',
      availableForFreelance: 'Available for freelance'
    },
    
    // Hero Carousel
    hero: {
      slides: [
        {
          title: 'Code That Speaks',
          subtitle: 'Your Vision, Engineered to Perfection',
          tag: 'Full-Stack Dev'
        },
        {
          title: 'Design with Purpose',
          subtitle: 'Interfaces That Users Love & Trust',
          tag: 'UI/UX Design'
        },
        {
          title: 'Build the Future',
          subtitle: 'Scalable Solutions for Modern Business',
          tag: 'Web & Mobile'
        },
        {
          title: 'Ship Products Fast',
          subtitle: 'From Concept to Live in Record Time',
          tag: 'Rapid Delivery'
        },
        {
          title: 'Ready for Freelance',
          subtitle: 'Hire Me for Your Next Big Project',
          tag: 'Freelance Available'
        },
        {
          title: 'We Are Hiring',
          subtitle: 'Join Our Team of Creative Builders',
          tag: 'Careers Open'
        }
      ],
      startProject: 'Start Project',
      watchDemo: 'Watch Demo',
      projects: 'Projects',
      satisfaction: 'Satisfaction',
      experience: 'Experience'
    },

    // Services
    services: {
      title: 'Services That',
      titleHighlight: 'Deliver',
      subtitle: 'Comprehensive solutions from concept to deployment',
      whatWeDo: 'What We Do',
      items: [
        { title: 'Web Development', desc: 'Modern, fast, responsive websites with cutting-edge stacks.' },
        { title: 'Mobile Apps', desc: 'Cross-platform iOS & Android with native-like experiences.' },
        { title: 'UI/UX Design', desc: 'Beautiful, user-centered designs that convert visitors.' },
        { title: 'E-Commerce', desc: 'Online stores with seamless payment & admin panels.' },
        { title: 'API Integration', desc: 'Connect your business via custom REST/GraphQL APIs.' },
        { title: 'SEO & Performance', desc: 'Optimize for speed, ranking and maximum visibility.' },
        { title: 'Cyber Security', desc: 'Penetration testing, audits and security hardening.' },
        { title: 'Cloud & DevOps', desc: 'CI/CD, Docker, AWS/GCP deployment & auto-scaling.' },
        { title: 'AI & Automation', desc: 'Smart bots, ML integrations and workflow automation.' },
        { title: 'Database Mgmt', desc: 'Schema design, query optimization & migration at scale.' },
        { title: 'Analytics & BI', desc: 'Custom dashboards, data pipelines & business intel.' }
      ],
      award: 'Award Winning',
      rated: '5-Star Rated',
      secure: '100% Secure',
      fast: 'Fast Delivery'
    },

    // Projects
    projects: {
      title: 'Our',
      titleHighlight: 'Projects',
      subtitle: 'Real products, real impact — built with passion',
      portfolio: 'Portfolio',
      view: 'View',
      live: 'LIVE',
      all: 'All'
    },

    // Pricing
    pricing: {
      title: 'Simple,',
      titleHighlight: 'Transparent',
      subtitle: 'Pricing',
      plans: 'Plans',
      free: {
        name: 'FREE',
        price: '₹0',
        desc: 'No commitment needed',
        features: [
          { label: 'Demo', desc: 'Live demo of your project concept' },
          { label: 'Understand', desc: 'Deep requirement analysis session' },
          { label: 'Meetup', desc: '1-on-1 consultation call' },
          { label: 'Paper', desc: 'Project scope document' },
          { label: 'Documents', desc: 'Technical specification sheets' },
          { label: 'Baina', desc: 'Initial agreement & commitment' }
        ],
        button: 'Start Free →'
      },
      upgrade: {
        name: 'UPGRADE',
        price: '₹500',
        desc: 'One-time project fee',
        popular: 'POPULAR',
        features: [
          { label: 'Priority Support', desc: '24/7 dedicated support channel' },
          { label: 'Custom Design', desc: 'Unique UI tailored to your brand' },
          { label: 'Unlimited Revisions', desc: 'Until you\'re 100% satisfied' },
          { label: 'Analytics Setup', desc: 'Full tracking & reporting dashboard' },
          { label: 'Deployment', desc: 'Full server setup & go-live' },
          { label: 'Mobile Optimized', desc: 'Perfect on every device' }
        ],
        button: 'Upgrade Now →'
      },
      premium: {
        name: 'PREMIUM',
        price: 'Custom',
        desc: 'Enterprise-grade, fully custom',
        button: 'Contact for Quote →'
      }
    },

    // Testimonials
    testimonials: {
      title: 'What Clients',
      titleHighlight: 'Say',
      subtitle: 'Happy Clients',
      readMore: 'Read more'
    },

    // Contact - COMPLETE SECTION
    contact: {
      title: "Let's",
      titleHighlight: "Talk",
      subtitle2: "About Your Project",
      subtitle: "📞 GET IN TOUCH",
      description: "Have a project in mind? We're here to help. Whether you need a website, mobile app, or consultation, our team is ready to bring your ideas to life.",
      support: "Support Available",
      emailMe: "📧 Email Me",
      whatsapp: "💬 WhatsApp",
      visitUs: "Visit Us",
      callUs: "Call Us",
      emailUs: "Email Us",
      workingHours: "Working Hours",
      ourLocation: "Our Location",
      connectWithUs: "Connect With Us",
      
      // FAQ Translations
      faqTitle: "Frequently Asked",
      questions: "Questions",
      faq1q: "How quickly do you respond to messages?",
      faq1a: "We typically respond within 2-4 hours during business hours. For urgent matters, please use WhatsApp for faster response.",
      faq2q: "Do you offer free consultations?",
      faq2a: "Yes! We offer a free 30-minute consultation to discuss your project requirements and provide initial recommendations.",
      faq3q: "Can I schedule a video call?",
      faq3a: "Absolutely! After initial contact, we can schedule a video call via Zoom, Google Meet, or your preferred platform.",
      faq4q: "What information should I provide?",
      faq4a: "Share your project idea, requirements, timeline, and budget if you have one. The more details, the better we can assist!",
      
      // Newsletter Translations
      newsletterTitle: "Stay Updated",
      newsletterDesc: "Subscribe to our newsletter for the latest updates, tips, and exclusive offers.",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
      successMessage: "Message sent successfully! We'll reply within 24 hours."
    },

    // Internship
    internship: {
      title: 'Start Your',
      titleHighlight: 'Career Journey',
      subtitle: 'Internship Program',
      banners: [
        { title: 'Ready for Internship?', sub: 'Kick-start your career with real-world projects' },
        { title: 'Get a Certificate', sub: 'Earn an industry-recognized certificate upon completion' },
        { title: "It's a Paid Internship", sub: 'Learn, grow, and earn — all at the same time' }
      ],
      interested: 'Interested ✨',
      paid: 'Paid',
      certified: 'Certified',
      realProjects: 'Real Projects',
      mentorship: 'Mentorship'
    },

    // Internship Modal
    internshipModal: {
      title: 'Internship Application',
      badge: 'PAID · CERTIFIED · REAL PROJECTS',
      fullName: 'FULL NAME *',
      email: 'EMAIL *',
      phone: 'PHONE *',
      chooseTrack: 'CHOOSE TRACK *',
      selectOneOrMore: '(Select one or more)',
      chooseDuration: 'CHOOSE DURATION *',
      uploadCV: 'UPLOAD CV / RESUME',
      dropCV: 'Drop your CV here or click to browse',
      acceptedFormats: 'PDF, DOC, DOCX accepted',
      submit: 'Submit Application 🚀',
      required: '* Required fields. We respond within 2-3 business days.',
      tracks: ['MEAN Stack', 'MERN Stack', 'Full Stack Java', 'Python'],
      durations: ['2 Months', '3 Months', '4 Months'],
      submitted: {
        title: 'Application Submitted!',
        message: 'Thank you',
        message2: 'We\'ll review your application and reach out to',
        message3: 'within 2-3 business days.',
        done: 'Done ✓'
      }
    },

    // Chatbot
    chatbot: {
      welcome: "Hi! 👋 I'm **Coding World Bot**, your AI assistant. Ask me about services, pricing, projects, internships, or how to get started!",
      online: 'Online · AI Assistant',
      placeholder: 'Ask me anything...',
      quickReplies: ['Pricing', 'Services', 'Projects', 'Hire Me', 'Contact', 'Internship', 'Tech Stack', 'Timeline', 'Apply Now', 'About']
    },

    // Footer
    footer: {
      rights: '© 2025 Coding World. All rights reserved. Built with ❤️ in Nepal.',
      language: 'Language'
    },

    // Admin
    admin: {
      login: 'Admin Login',
      username: 'USERNAME',
      password: 'PASSWORD',
      loginButton: 'Login to Dashboard',
      dashboard: 'Admin Dashboard',
      manage: 'Manage your website content and view applications',
      logout: 'Logout',
      totalVisitors: 'Total Visitors',
      applications: 'Applications',
      pending: 'Pending',
      projects: 'Projects',
      services: 'Services',
      welcome: 'Welcome to Admin Dashboard',
      welcomeDesc: 'Use the tabs above to manage internships, services, pricing, and projects.'
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      yes: 'Yes',
      no: 'No',
      confirm: 'Are you sure?',
      showLess: 'Show Less',
      viewMore: 'View More',
      learnMore: 'Learn More'
    }
  },

  [languages.NEPALI]: {
    // Navigation
    nav: {
      home: 'गृहपृष्ठ',
      services: 'सेवाहरू',
      projects: 'परियोजनाहरू',
      pricing: 'मूल्य निर्धारण',
      testimonials: 'प्रशंसापत्र',
      contact: 'सम्पर्क',
      internship: 'इन्टर्नशिप',
      getStarted: 'सुरु गर्नुहोस्',
      availableForFreelance: 'फ्रिलान्सको लागि उपलब्ध'
    },
    
    // Hero Carousel
    hero: {
      slides: [
        {
          title: 'कोड जसले बोल्छ',
          subtitle: 'तपाईंको दृष्टि, उत्तम रूपमा इन्जिनियर गरिएको',
          tag: 'फुल-स्ट्याक डेभ'
        },
        {
          title: 'उद्देश्यपूर्ण डिजाइन',
          subtitle: 'प्रयोगकर्ताहरूले मन पराउने इन्टरफेसहरू',
          tag: 'UI/UX डिजाइन'
        },
        {
          title: 'भविष्य निर्माण गर्नुहोस्',
          subtitle: 'आधुनिक व्यवसायको लागि स्केलेबल समाधान',
          tag: 'वेब र मोबाइल'
        },
        {
          title: 'छिटो उत्पादन पठाउनुहोस्',
          subtitle: 'अवधारणाबाट लाइभ सम्म रेकर्ड समयमा',
          tag: 'द्रुत डेलिभरी'
        },
        {
          title: 'फ्रिलान्सको लागि तयार',
          subtitle: 'तपाईंको अर्को ठूलो परियोजनाको लागि मलाई काममा राख्नुहोस्',
          tag: 'फ्रिलान्स उपलब्ध'
        },
        {
          title: 'हामी कर्मचारी माग्दैछौं',
          subtitle: 'हाम्रो रचनात्मक टोलीमा सामेल हुनुहोस्',
          tag: 'करियर खुला'
        }
      ],
      startProject: 'परियोजना सुरु गर्नुहोस्',
      watchDemo: 'डेमो हेर्नुहोस्',
      projects: 'परियोजनाहरू',
      satisfaction: 'सन्तुष्टि',
      experience: 'अनुभव'
    },

    // Services
    services: {
      title: 'सेवाहरू जसले',
      titleHighlight: 'परिणाम दिन्छ',
      subtitle: 'अवधारणादेखि तैनातीसम्म व्यापक समाधानहरू',
      whatWeDo: 'हामी के गर्छौं',
      items: [
        { title: 'वेब विकास', desc: 'आधुनिक, छिटो, उत्तरदायी वेबसाइटहरू।' },
        { title: 'मोबाइल एप्स', desc: 'क्रस-प्लेटफर्म iOS र एन्ड्रोइड एपहरू।' },
        { title: 'UI/UX डिजाइन', desc: 'प्रयोगकर्ता-केन्द्रित डिजाइनहरू।' },
        { title: 'ई-कमर्स', desc: 'सिमलेस भुक्तानी र एडमिन प्यानल स्टोरहरू।' },
        { title: 'API एकीकरण', desc: 'कस्टम REST/GraphQL APIs मार्फत जडान गर्नुहोस्।' },
        { title: 'SEO र प्रदर्शन', desc: 'गति, रैंकिंग र दृश्यताको लागि अनुकूलन।' },
        { title: 'साइबर सुरक्षा', desc: 'प्रवेश परीक्षण, अडिट र सुरक्षा।' },
        { title: 'क्लाउड र DevOps', desc: 'CI/CD, Docker, AWS/GCP तैनाती।' },
        { title: 'AI र अटोमेशन', desc: 'स्मार्ट बोट्स, ML एकीकरण।' },
        { title: 'डाटाबेस व्यवस्थापन', desc: 'स्कीमा डिजाइन, क्वेरी अनुकूलन।' },
        { title: 'एनालिटिक्स र BI', desc: 'कस्टम ड्यासबोर्ड, डाटा पाइपलाइन।' }
      ],
      award: 'पुरस्कार विजेता',
      rated: '५-स्टार मूल्यांकन',
      secure: '१००% सुरक्षित',
      fast: 'द्रुत डेलिभरी'
    },

    // Projects
    projects: {
      title: 'हाम्रा',
      titleHighlight: 'परियोजनाहरू',
      subtitle: 'वास्तविक उत्पादनहरू, वास्तविक प्रभाव — जोशका साथ निर्मित',
      portfolio: 'पोर्टफोलियो',
      view: 'हेर्नुहोस्',
      live: 'लाइभ',
      all: 'सबै'
    },

    // Pricing
    pricing: {
      title: 'सरल,',
      titleHighlight: 'पारदर्शी',
      subtitle: 'मूल्य निर्धारण',
      plans: 'योजनाहरू',
      free: {
        name: 'नि:शुल्क',
        price: 'रू०',
        desc: 'कुनै प्रतिबद्धता आवश्यक छैन',
        features: [
          { label: 'डेमो', desc: 'तपाईंको परियोजना अवधारणाको लाइभ डेमो' },
          { label: 'बुझाइ', desc: 'गहिरो आवश्यकता विश्लेषण सत्र' },
          { label: 'भेटघाट', desc: 'एक-एक परामर्श कल' },
          { label: 'कागजात', desc: 'परियोजना दायरा दस्तावेज' },
          { label: 'प्राविधिक विवरण', desc: 'प्राविधिक विशिष्टता पानाहरू' },
          { label: 'सम्झौता', desc: 'प्रारम्भिक सम्झौता र प्रतिबद्धता' }
        ],
        button: 'नि:शुल्क सुरु गर्नुहोस् →'
      },
      upgrade: {
        name: 'अपग्रेड',
        price: 'रू५००',
        desc: 'एक-पटक परियोजना शुल्क',
        popular: 'लोकप्रिय',
        features: [
          { label: 'प्राथमिकता समर्थन', desc: '२४/७ समर्पित समर्थन च्यानल' },
          { label: 'कस्टम डिजाइन', desc: 'तपाईंको ब्रान्ड अनुरूप अद्वितीय UI' },
          { label: 'असीमित संशोधन', desc: 'तपाईं १००% सन्तुष्ट नभएसम्म' },
          { label: 'एनालिटिक्स सेटअप', desc: 'पूर्ण ट्र्याकिङ र रिपोर्टिङ ड्यासबोर्ड' },
          { label: 'तैनाती', desc: 'पूर्ण सर्भर सेटअप र गो-लाइभ' },
          { label: 'मोबाइल अनुकूलित', desc: 'हरेक डिभाइसमा उत्तम' }
        ],
        button: 'अपग्रेड गर्नुहोस् →'
      },
      premium: {
        name: 'प्रिमियम',
        price: 'अनुकूल',
        desc: 'एन्टरप्राइज-ग्रेड, पूर्ण रूपमा अनुकूल',
        button: 'मूल्यको लागि सम्पर्क गर्नुहोस् →'
      }
    },

    // Testimonials
    testimonials: {
      title: 'ग्राहकहरू के',
      titleHighlight: 'भन्छन्',
      subtitle: 'खुसी ग्राहकहरू',
      readMore: 'थप पढ्नुहोस्'
    },

    // Contact - COMPLETE SECTION IN NEPALI
    contact: {
      title: 'तपाईंको',
      titleHighlight: 'परियोजना सुरु गर्न तयार हुनुहुन्छ?',
      subtitle: '📞 सम्पर्क गर्नुहोस्',
      subtitle2: 'बारेमा कुरा गरौं',
      description: 'एउटा परियोजना दिमागमा छ? हामी मद्दत गर्न यहाँ छौं। वेबसाइट, मोबाइल एप, वा परामर्श चाहिएको भए पनि, हाम्रो टोली तपाईंको विचारहरूलाई जीवनमा ल्याउन तयार छ।',
      support: 'सहायता उपलब्ध',
      emailMe: '📧 इमेल गर्नुहोस्',
      whatsapp: '💬 ह्वाट्सएप',
      visitUs: 'भेट्नुहोस्',
      callUs: 'फोन गर्नुहोस्',
      emailUs: 'इमेल गर्नुहोस्',
      workingHours: 'कार्यालय समय',
      ourLocation: 'हाम्रो स्थान',
      connectWithUs: 'हामीसँग जोडिनुहोस्',
      
      // FAQ Translations in Nepali
      faqTitle: 'अक्सर सोधिने',
      questions: 'प्रश्नहरू',
      faq1q: 'तपाईंले सन्देशको जवाफ कति छिटो दिनुहुन्छ?',
      faq1a: 'हामी सामान्यतया व्यापारिक समयमा २-४ घण्टाभित्र जवाफ दिन्छौं। तत्कालका लागि कृपया ह्वाट्सएप प्रयोग गर्नुहोस्।',
      faq2q: 'के तपाईं नि:शुल्क परामर्श प्रदान गर्नुहुन्छ?',
      faq2a: 'हो! हामी तपाईंको परियोजना आवश्यकताहरू छलफल गर्न र प्रारम्भिक सिफारिसहरू प्रदान गर्न ३० मिनेटको नि:शुल्क परामर्श प्रदान गर्दछौं।',
      faq3q: 'के म भिडियो कल तालिका बनाउन सक्छु?',
      faq3a: 'पक्कै पनि! प्रारम्भिक सम्पर्क पछि, हामी Zoom, Google Meet, वा तपाईंको मनपर्ने प्लेटफर्म मार्फत भिडियो कल तालिका बनाउन सक्छौं।',
      faq4q: 'मैले के जानकारी प्रदान गर्नुपर्छ?',
      faq4a: 'आफ्नो परियोजना विचार, आवश्यकताहरू, समयरेखा, र बजेट साझा गर्नुहोस्। जति धेरै विवरणहरू, उति राम्रो सहायता गर्न सक्छौं!',
      
      // Newsletter Translations in Nepali
      newsletterTitle: 'अपडेट रहनुहोस्',
      newsletterDesc: 'नवीनतम अपडेटहरू, सुझावहरू, र विशेष प्रस्तावहरूको लागि हाम्रो न्यूजलेटरमा सदस्यता लिनुहोस्।',
      emailPlaceholder: 'तपाईंको इमेल',
      subscribe: 'सदस्यता लिनु',
      successMessage: 'सन्देश सफलतापूर्वक पठाइयो! हामी २४ घण्टाभित्र जवाफ दिनेछौं।'
    },

    // Internship
    internship: {
      title: 'तपाईंको करियर',
      titleHighlight: 'यात्रा सुरु गर्नुहोस्',
      subtitle: 'इन्टर्नशिप कार्यक्रम',
      banners: [
        { title: 'इन्टर्नशिपको लागि तयार हुनुहुन्छ?', sub: 'वास्तविक-विश्व परियोजनाहरूसँग करियर सुरु गर्नुहोस्' },
        { title: 'प्रमाणपत्र प्राप्त गर्नुहोस्', sub: 'पूरा भएपछि उद्योग-मान्यता प्राप्त प्रमाणपत्र कमाउनुहोस्' },
        { title: 'यो भुक्तान इन्टर्नशिप हो', sub: 'सिक्नुहोस्, बढ्नुहोस्, र कमाउनुहोस् — एकै समयमा' }
      ],
      interested: 'इच्छुक ✨',
      paid: 'भुक्तान',
      certified: 'प्रमाणित',
      realProjects: 'वास्तविक परियोजनाहरू',
      mentorship: 'मेन्टरशिप'
    },

    // Internship Modal
    internshipModal: {
      title: 'इन्टर्नशिप आवेदन',
      badge: 'भुक्तान · प्रमाणित · वास्तविक परियोजनाहरू',
      fullName: 'पूरा नाम *',
      email: 'इमेल *',
      phone: 'फोन नम्बर *',
      chooseTrack: 'ट्र्याक छान्नुहोस् *',
      selectOneOrMore: '(एक वा धेरै छान्नुहोस्)',
      chooseDuration: 'अवधि छान्नुहोस् *',
      uploadCV: 'CV / रिज्युमे अपलोड गर्नुहोस्',
      dropCV: 'CV यहाँ छोड्नुहोस् वा ब्राउज गर्न क्लिक गर्नुहोस्',
      acceptedFormats: 'PDF, DOC, DOCX स्वीकार गरिन्छ',
      submit: 'आवेदन पेश गर्नुहोस् 🚀',
      required: '* आवश्यक फिल्डहरू। हामी २-३ कार्य दिनभित्र जवाफ दिन्छौं।',
      tracks: ['MEAN स्ट्याक', 'MERN स्ट्याक', 'फुल स्ट्याक Java', 'Python'],
      durations: ['२ महिना', '३ महिना', '४ महिना'],
      submitted: {
        title: 'आवेदन पेश भयो!',
        message: 'धन्यवाद',
        message2: 'हामी तपाईंको आवेदन समीक्षा गर्नेछौं र सम्पर्क गर्नेछौं',
        message3: '२-३ कार्य दिनभित्र।',
        done: 'सम्पन्न ✓'
      }
    },

    // Chatbot
    chatbot: {
      welcome: "नमस्ते! 👋 म **कोडिङ वर्ल्ड बोट** हुँ, तपाईंको AI सहायक। सेवाहरू, मूल्य निर्धारण, परियोजनाहरू, इन्टर्नशिप, वा कसरी सुरु गर्ने भन्ने बारे सोध्नुहोस्!",
      online: 'अनलाइन · AI सहायक',
      placeholder: 'जे पनि सोध्नुहोस्...',
      quickReplies: ['मूल्य', 'सेवाहरू', 'परियोजनाहरू', 'मलाई काममा राख्नुहोस्', 'सम्पर्क', 'इन्टर्नशिप', 'टेक स्ट्याक', 'समयरेखा', 'अहिले नै आवेदन', 'बारेमा']
    },

    // Footer
    footer: {
      rights: '© २०२५ कोडिङ वर्ल्ड। सर्वाधिकार सुरक्षित। ❤️ र नेपालमा निर्मित।',
      language: 'भाषा'
    },

    // Admin
    admin: {
      login: 'प्रशासक लगइन',
      username: 'प्रयोगकर्ता नाम',
      password: 'पासवर्ड',
      loginButton: 'ड्यासबोर्डमा लगइन गर्नुहोस्',
      dashboard: 'प्रशासक ड्यासबोर्ड',
      manage: 'तपाईंको वेबसाइट सामग्री व्यवस्थापन गर्नुहोस् र आवेदनहरू हेर्नुहोस्',
      logout: 'लगआउट',
      totalVisitors: 'कुल आगन्तुकहरू',
      applications: 'आवेदनहरू',
      pending: 'विचाराधीन',
      projects: 'परियोजनाहरू',
      services: 'सेवाहरू',
      welcome: 'प्रशासक ड्यासबोर्डमा स्वागत छ',
      welcomeDesc: 'इन्टर्नशिप, सेवाहरू, मूल्य निर्धारण, र परियोजनाहरू व्यवस्थापन गर्न माथिका ट्याबहरू प्रयोग गर्नुहोस्।'
    },

    // Common
    common: {
      loading: 'लोड हुँदै...',
      error: 'केही गलत भयो',
      save: 'सुरक्षित गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      edit: 'सम्पादन गर्नुहोस्',
      add: 'थप्नुहोस्',
      search: 'खोज्नुहोस्',
      filter: 'फिल्टर',
      all: 'सबै',
      yes: 'हो',
      no: 'होइन',
      confirm: 'के तपाईं निश्चित हुनुहुन्छ?',
      showLess: 'कम देखाउनुहोस्',
      viewMore: 'थप हेर्नुहोस्',
      learnMore: 'थप जान्नुहोस्'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || languages.ENGLISH;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to English
        let fallback = translations[languages.ENGLISH];
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        return fallback || key;
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};