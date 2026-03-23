import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../context/LanguageContext';

export default function LanguageSelector({ dark, C }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languagesList = [
    { code: languages.ENGLISH, name: 'English', flag: '🇬🇧' },
    { code: languages.NEPALI, name: 'नेपाली', flag: '🇳🇵' }
  ];

  const currentLang = languagesList.find(l => l.code === language) || languagesList[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: '6px 12px',
          cursor: 'pointer',
          color: C.text,
          fontSize: 13,
          transition: 'all 0.2s'
        }}
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: 8,
            background: dark ? '#0d0d28' : '#ffffff',
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            minWidth: 140,
            zIndex: 1000
          }}
        >
          {languagesList.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 15px',
                border: 'none',
                background: language === lang.code 
                  ? (dark ? '#00e5ff20' : '#00e5ff10')
                  : 'transparent',
                color: language === lang.code ? '#00e5ff' : C.text,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s',
                borderBottom: index < languagesList.length - 1 ? `1px solid ${C.border}` : 'none'
              }}
              onMouseEnter={e => {
                if (language !== lang.code) {
                  e.currentTarget.style.background = dark ? '#00e5ff10' : '#00e5ff05';
                }
              }}
              onMouseLeave={e => {
                if (language !== lang.code) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00e5ff"
                  style={{ marginLeft: 'auto' }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}