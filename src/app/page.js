'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PublicPujaList from '@/components/PublicPujaList';
import GuardianPortal from '@/components/GuardianPortal';
import HostPortal from '@/components/HostPortal';
import BookingModal from '@/components/BookingModal';
import ConcurrencySimulator from '@/components/ConcurrencySimulator';
import PrivacyGuide from '@/components/PrivacyGuide';

export default function Home() {
  const [activeTab, setActiveTab] = useState('browse');
  const [theme, setTheme] = useState('dark');
  const [hosts, setHosts] = useState([]);
  const [loadingHosts, setLoadingHosts] = useState(true);
  const [selectedHostForBooking, setSelectedHostForBooking] = useState(null);
  const [activeGuardianToken, setActiveGuardianToken] = useState('');
  const [petals, setPetals] = useState([]);

  // Generate subtle floating petals for auspicious devotional atmosphere
  useEffect(() => {
    const generatedPetals = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7) % 95}%`,
      animationDuration: `${7 + (i % 6) * 2}s`,
      animationDelay: `${(i % 5) * 1.5}s`,
      size: `${12 + (i % 3) * 6}px`,
      color: i % 2 === 0 ? '#FFA000' : '#FFD54F' // Marigold golden petals
    }));
    setPetals(generatedPetals);
  }, []);

  // Fetch host puja offerings
  const fetchHosts = async () => {
    try {
      setLoadingHosts(true);
      const res = await fetch('/api/hosts');
      const data = await res.json();
      if (data.success && Array.isArray(data.hosts)) {
        setHosts(data.hosts);
      }
    } catch (err) {
      console.error("Error loading hosts:", err);
    } finally {
      setLoadingHosts(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const handleGuardianRegistered = (token) => {
    setActiveGuardianToken(token);
  };

  const handleBookingSuccess = () => {
    fetchHosts(); // Refresh available slot counts
  };

  return (
    <div className="divine-bg-container">
      {/* Floating Marigold Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal-particle"
          style={{
            left: petal.left,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            width: petal.size,
            height: petal.size,
            background: `radial-gradient(circle, ${petal.color} 30%, rgba(216, 67, 21, 0.4) 100%)`,
            borderRadius: '50% 0 50% 50%',
            transform: 'rotate(45deg)'
          }}
        />
      ))}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Hero Section */}
        <Hero
          setActiveTab={setActiveTab}
          onBookClick={() => setActiveTab('browse')}
        />

        {/* Dynamic Tab Content */}
        {activeTab === 'browse' && (
          <div>
            {loadingHosts ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gold-light)' }}>
                <div className="diya-flame" style={{ margin: '0 auto 16px' }} />
                <div>Loading Sacred Puja Offerings...</div>
              </div>
            ) : (
              <PublicPujaList
                hosts={hosts}
                onOpenBooking={(host) => setSelectedHostForBooking(host)}
              />
            )}
          </div>
        )}

        {activeTab === 'guardian' && (
          <GuardianPortal
            onRegisteredSuccess={handleGuardianRegistered}
            prefilledToken={activeGuardianToken}
          />
        )}

        {activeTab === 'host' && (
          <HostPortal
            onHostRegistered={fetchHosts}
          />
        )}

        {activeTab === 'safety' && (
          <PrivacyGuide />
        )}

        {activeTab === 'concurrency' && (
          <ConcurrencySimulator />
        )}
      </main>

      {/* Booking Modal */}
      {selectedHostForBooking && (
        <BookingModal
          host={selectedHostForBooking}
          guardianTokenDefault={activeGuardianToken}
          onClose={() => setSelectedHostForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
          onGoToGuardianRegister={() => {
            setSelectedHostForBooking(null);
            setActiveTab('guardian');
          }}
        />
      )}

      {/* Devotional Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--gold-border)',
          background: 'rgba(18, 12, 7, 0.95)',
          padding: '40px 20px 24px',
          textAlign: 'center',
          marginTop: '60px',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🪔 🕉️ 🪔</div>
          <h3 className="font-sacred text-gold-gradient" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
            शुभ नवरात्रि • जय माता दी
          </h3>
          <p style={{ color: 'var(--ivory-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
            A community seva initiative to facilitate Navratri Kanya Pujan and Prasad distribution with utmost respect,
            maryada, and child privacy protection.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              fontSize: '0.82rem',
              color: 'var(--gold-light)',
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}
          >
            <button
              onClick={() => setActiveTab('browse')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              Puja Darshan
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('guardian')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              Guardian Portal
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('host')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              Host Registration
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('safety')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              Child Safety & Privacy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('concurrency')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              Concurrency Verification
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--ivory-subtle)' }}>
            Strict Data Protection: No child data is shared publicly. Zero advertising trackers.
          </div>
        </div>
      </footer>
    </div>
  );
}
