'use client';

export default function Hero({ setActiveTab, onBookClick }) {
  return (
    <section
      style={{
        padding: '50px 20px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Devotional Centerpiece with Glowing Diya */}
      <div style={{ display: 'inline-block', marginBottom: '20px' }}>
        <div className="halo-glow" style={{ padding: '16px', borderRadius: '50%' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(216, 67, 21, 0.15) 70%, transparent 100%)',
              border: '2px solid var(--gold-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
            }}
          >
            <div className="diya-flame" style={{ width: '18px', height: '28px' }} />
            <div className="diya-base" style={{ width: '40px', height: '14px' }} />
          </div>
        </div>
      </div>

      {/* Main Devotional Title */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          fontWeight: 800,
          marginBottom: '16px',
          lineHeight: 1.2
        }}
      >
        <span className="text-gold-gradient">पवित्र कंजक सेवा</span>
        <br />
        <span style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: 'var(--ivory-text)', fontWeight: 600 }}>
          Navratri Kanya Pujan & Divine Offerings
        </span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          maxWidth: '680px',
          margin: '0 auto 28px',
          color: 'var(--ivory-muted)',
          fontSize: '1.05rem',
          lineHeight: 1.6
        }}
      >
        A respectful, <strong style={{ color: 'var(--gold-light)' }}>privacy-first platform</strong> bridging devotee
        host families with Kanjak & Langur children for Ashtami & Navami. Respectful Seva, Satvik Prasad, Dakshina & strict child safety.
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '40px'
        }}
      >
        <button
          onClick={() => setActiveTab('guardian')}
          className="btn-gold"
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          👧 Register as Kanjak Parivar
        </button>

        <button
          onClick={() => setActiveTab('host')}
          className="btn-outline"
          style={{ padding: '13px 26px', fontSize: '1rem' }}
        >
          🪔 Host a Kanjak Puja
        </button>

        <button
          onClick={() => setActiveTab('browse')}
          className="btn-outline"
          style={{
            padding: '13px 24px',
            fontSize: '0.95rem',
            background: 'rgba(216, 67, 21, 0.15)',
            borderColor: 'rgba(255, 111, 0, 0.4)'
          }}
        >
          🕉️ Browse Puja Offerings
        </button>
      </div>

      {/* Trust & Safety Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          maxWidth: '920px',
          margin: '0 auto'
        }}
      >
        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🔒</div>
          <div style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.95rem' }}>100% Child Privacy</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>
            Zero public lists or live location tracking. Private access tokens only.
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>⚡</div>
          <div style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.95rem' }}>Atomic Slot Booking</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>
            Database-level mutex locking prevents double-booking race conditions.
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🍲</div>
          <div style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.95rem' }}>Satvik Prasad & Gifts</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>
            Desi Ghee Halwa-Poori-Chana, Chunri, Dakshina & blessings transparently shared.
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📋</div>
          <div style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.95rem' }}>Guardian Right to Delete</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>
            Instant self-service withdrawal anytime with 1 click.
          </div>
        </div>
      </div>
    </section>
  );
}
