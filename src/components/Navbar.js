'use client';

import { useState } from 'react';
import { playTempleBell } from './AudioChime';

export default function Navbar({ activeTab, setActiveTab, theme, setTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const ringBell = () => {
    playTempleBell();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'warm-ivory' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 90, width: '100%' }}>
      {/* Auspicious Shlok Bar */}
      <div className="sacred-shlok-bar">
        <span>॥ या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥</span>
      </div>

      {/* Main Navigation Bar */}
      <nav
        style={{
          background: 'rgba(24, 16, 10, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--gold-border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('browse')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div className="diya-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="diya-flame" />
              <div className="diya-base" />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }} className="font-sacred">
                कंजक सेवा
              </span>
              <span className="badge-saffron" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Navratri 2026
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ivory-subtle)', letterSpacing: '0.5px' }}>
              Sacred Kanya Pujan & Dakshina Seva
            </div>
          </div>
        </div>

        {/* Desktop Portal Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          className="desktop-nav"
        >
          <button
            onClick={() => handleTabClick('browse')}
            className={`btn-outline ${activeTab === 'browse' ? 'active-nav-btn' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              backgroundColor: activeTab === 'browse' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              borderColor: activeTab === 'browse' ? 'var(--gold-primary)' : 'var(--gold-border)'
            }}
          >
            🕉️ Puja Darshan
          </button>

          <button
            onClick={() => handleTabClick('guardian')}
            className={`btn-outline ${activeTab === 'guardian' ? 'active-nav-btn' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              backgroundColor: activeTab === 'guardian' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              borderColor: activeTab === 'guardian' ? 'var(--gold-primary)' : 'var(--gold-border)'
            }}
          >
            👧 Kanjak Parivar (Guardians)
          </button>

          <button
            onClick={() => handleTabClick('host')}
            className={`btn-outline ${activeTab === 'host' ? 'active-nav-btn' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              backgroundColor: activeTab === 'host' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              borderColor: activeTab === 'host' ? 'var(--gold-primary)' : 'var(--gold-border)'
            }}
          >
            🪔 Pujari Parivar (Hosts)
          </button>

          <button
            onClick={() => handleTabClick('safety')}
            className={`btn-outline ${activeTab === 'safety' ? 'active-nav-btn' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              backgroundColor: activeTab === 'safety' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              borderColor: activeTab === 'safety' ? 'var(--gold-primary)' : 'var(--gold-border)'
            }}
          >
            🛡️ Maryada & Safety
          </button>

          <button
            onClick={() => handleTabClick('concurrency')}
            className={`btn-outline ${activeTab === 'concurrency' ? 'active-nav-btn' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              backgroundColor: activeTab === 'concurrency' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              borderColor: activeTab === 'concurrency' ? 'var(--gold-primary)' : 'var(--gold-border)'
            }}
          >
            ⚡ Test Concurrency
          </button>
        </div>

        {/* Action Controls: Temple Bell Chime & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={ringBell}
            className="audio-toggle-btn"
            title="Ring Sacred Temple Bell (Pavitra Ghanti)"
            aria-label="Ring Temple Bell"
          >
            🔔 <span className="hide-on-mobile">Ring Bell</span>
          </button>

          <button
            onClick={toggleTheme}
            className="audio-toggle-btn"
            title="Toggle Divine Dark / Warm Ivory Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️ Warm' : '🌙 Dark'}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold-light)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
            aria-label="Toggle Mobile Navigation"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '2px solid var(--gold-primary)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <button
            onClick={() => handleTabClick('browse')}
            className="btn-outline"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            🕉️ Puja Darshan (Browse Offerings)
          </button>
          <button
            onClick={() => handleTabClick('guardian')}
            className="btn-outline"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            👧 Kanjak Parivar (Guardian Registration)
          </button>
          <button
            onClick={() => handleTabClick('host')}
            className="btn-outline"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            🪔 Pujari Parivar (Host Puja Registration)
          </button>
          <button
            onClick={() => handleTabClick('safety')}
            className="btn-outline"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            🛡️ Maryada & Child Safety
          </button>
          <button
            onClick={() => handleTabClick('concurrency')}
            className="btn-outline"
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            ⚡ Test Concurrency Protection
          </button>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.desktop-nav) {
            display: none !important;
          }
          :global(.mobile-menu-btn) {
            display: block !important;
          }
          :global(.hide-on-mobile) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
