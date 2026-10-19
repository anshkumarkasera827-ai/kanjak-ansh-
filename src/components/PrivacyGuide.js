'use client';

export default function PrivacyGuide() {
  return (
    <section style={{ padding: '20px 0 60px', maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge-saffron" style={{ marginBottom: '8px' }}>
          🛡️ मर्यादा एवं बाल सुरक्षा नीति
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--gold-light)', marginTop: '6px' }}>
          Child Safety, Privacy & Maryada
        </h2>
        <p style={{ color: 'var(--ivory-muted)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '640px', margin: '6px auto 0' }}>
          Kanjak Puja is a sacred spiritual tradition honoring young girls as representations of Divine Shakti (Mata Rani). We have engineered child privacy and safety into every layer of our platform.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Pillar 1 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🚫</span>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.25rem' }}>
              1. Zero Public Child Directory or Tracking
            </h3>
          </div>
          <p style={{ color: 'var(--ivory-text)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            There is <strong>no public directory, search bar, or browse page for children</strong>. A child’s name,
            contact information, and location are never published on the internet, indexed by search engines, or exposed
            in public APIs. Only devotee host families with confirmed bookings receive the child's first name for Puja
            seating.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🔒</span>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.25rem' }}>
              2. Data Minimization & Privacy by Design
            </h3>
          </div>
          <p style={{ color: 'var(--ivory-text)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            We only collect the absolute minimum data required to facilitate a sacred Puja: first name / alias, age
            (2–20 years), guardian phone, general neighborhood, and dietary preferences. We never collect surnames,
            birthdates, school information, photos, or exact home addresses from children.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📍</span>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.25rem' }}>
              3. Approximate Public Areas vs. Private Exact Addresses
            </h3>
          </div>
          <p style={{ color: 'var(--ivory-text)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Public listings only display approximate localities (e.g. "Sector 14, Rohini") and landmarks. Exact host
            addresses and contact numbers are protected on our backend and only revealed to guardians who hold a
            verified, confirmed booking pass.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🗑️</span>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.25rem' }}>
              4. Complete Right to Withdraw & Immediate Erasure
            </h3>
          </div>
          <p style={{ color: 'var(--ivory-text)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Parents and guardians retain complete ownership of their family's information. Using your private Guardian
            Token, you can withdraw your registration anytime with a single click. When withdrawn, all child details are
            permanently purged from our database and any reserved slots are returned to the community.
          </p>
        </div>

        {/* Pillar 5 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>⚡</span>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.25rem' }}>
              5. Concurrency Protection & Zero Double-Booking
            </h3>
          </div>
          <p style={{ color: 'var(--ivory-text)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Slot availability is guarded by server-side atomic transaction locks. Even if two families attempt to book
            the final available slot simultaneously, the server processes them sequentially: one booking is confirmed
            and the other is rejected with a clear notification, guaranteeing that host families never face overcrowding.
          </p>
        </div>
      </div>
    </section>
  );
}
