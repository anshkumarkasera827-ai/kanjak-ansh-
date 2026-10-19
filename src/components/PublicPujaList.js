'use client';

import { useState } from 'react';

export default function PublicPujaList({ hosts, onSelectHost, onOpenBooking }) {
  const [filterTithi, setFilterTithi] = useState('all');
  const [searchArea, setSearchArea] = useState('');

  const filteredHosts = hosts.filter((host) => {
    const matchesTithi =
      filterTithi === 'all' ||
      (filterTithi === 'ashtami' && host.tithi?.toLowerCase().includes('ashtami')) ||
      (filterTithi === 'navami' && host.tithi?.toLowerCase().includes('navami'));

    const matchesSearch =
      searchArea.trim() === '' ||
      host.approximateArea?.toLowerCase().includes(searchArea.toLowerCase()) ||
      host.familyName?.toLowerCase().includes(searchArea.toLowerCase()) ||
      host.prasadMenu?.toLowerCase().includes(searchArea.toLowerCase());

    return matchesTithi && matchesSearch;
  });

  return (
    <section style={{ padding: '20px 0 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px' }}>
          ✨ पवित्र दर्शन एवं पूजन सूची
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--gold-light)', marginTop: '6px' }}>
          Available Kanjak Puja Offerings
        </h2>
        <p style={{ color: 'var(--ivory-muted)', maxWidth: '640px', margin: '8px auto 0', fontSize: '0.95rem' }}>
          Devotee host families opening their homes for Kanya & Langur Pujan. Exact address is shared only with confirmed guardians.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 500 }}>
            Tithi Filter:
          </span>
          <button
            onClick={() => setFilterTithi('all')}
            className={`btn-outline ${filterTithi === 'all' ? 'active-filter' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              backgroundColor: filterTithi === 'all' ? 'var(--gold-primary)' : 'transparent',
              color: filterTithi === 'all' ? '#1A1005' : 'var(--gold-light)'
            }}
          >
            All Tithis
          </button>
          <button
            onClick={() => setFilterTithi('ashtami')}
            className={`btn-outline ${filterTithi === 'ashtami' ? 'active-filter' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              backgroundColor: filterTithi === 'ashtami' ? 'var(--gold-primary)' : 'transparent',
              color: filterTithi === 'ashtami' ? '#1A1005' : 'var(--gold-light)'
            }}
          >
            Durga Ashtami (महाष्टमी)
          </button>
          <button
            onClick={() => setFilterTithi('navami')}
            className={`btn-outline ${filterTithi === 'navami' ? 'active-filter' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              backgroundColor: filterTithi === 'navami' ? 'var(--gold-primary)' : 'transparent',
              color: filterTithi === 'navami' ? '#1A1005' : 'var(--gold-light)'
            }}
          >
            Maha Navami (महानवमी)
          </button>
        </div>

        {/* Search input */}
        <div style={{ minWidth: '240px', flex: '1', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by sector, colony or prasad..."
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            style={{ padding: '8px 14px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Approximate Area Safety Notice */}
      <div
        style={{
          background: 'rgba(212, 175, 55, 0.08)',
          borderLeft: '4px solid var(--gold-primary)',
          padding: '12px 18px',
          borderRadius: '4px',
          marginBottom: '24px',
          fontSize: '0.86rem',
          color: 'var(--ivory-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>📍</span>
        <span>
          <strong>Neighborhood Privacy Notice:</strong> For the safety of devotee families and participating children,
          only approximate areas and nearest landmarks are shown below. Full addresses and contact details are disclosed
          only to confirmed guardians.
        </span>
      </div>

      {/* Cards Grid */}
      {filteredHosts.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '50px 20px',
            textAlign: 'center',
            color: 'var(--ivory-muted)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🕉️</div>
          <h3 style={{ color: 'var(--gold-light)', marginBottom: '8px' }}>No Offerings Found</h3>
          <p style={{ fontSize: '0.92rem' }}>
            Try adjusting your search criteria or register as a Host to create a new Puja event!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredHosts.map((host) => {
            const isFull = host.availableSlots <= 0 || host.status !== 'open';
            const progressPct = Math.min(100, Math.round((host.bookedSlots / host.totalSlots) * 100));

            return (
              <div
                key={host.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Card Header */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          color: 'var(--gold-light)',
                          marginBottom: '4px'
                        }}
                      >
                        {host.familyName}
                      </h3>
                      <span className="badge-saffron" style={{ fontSize: '0.76rem' }}>
                        📅 {host.tithi}
                      </span>
                    </div>

                    <span className={`badge-status ${isFull ? 'full' : 'open'}`}>
                      <span className="status-dot" />
                      {isFull ? 'Full / Closed' : 'Slots Open'}
                    </span>
                  </div>

                  {/* Timing & Approximate Location */}
                  <div
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--ivory-text)',
                      marginBottom: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--gold-primary)' }}>⏰</span>
                      <span><strong>Timings:</strong> {host.timeSlot}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--gold-primary)' }}>📍</span>
                      <span>
                        <strong>Public Area:</strong> {host.approximateArea}
                        {host.landmark ? ` (${host.landmark})` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Offerings: Prasad & Gifts */}
                  <div
                    style={{
                      background: 'rgba(20, 13, 8, 0.7)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      border: '1px solid rgba(212, 175, 55, 0.15)'
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--gold-light)' }}>🍲 Prasad Offering:</strong>
                      <div style={{ color: 'var(--ivory-muted)', marginTop: '2px' }}>
                        {host.prasadMenu}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.84rem' }}>
                      <strong style={{ color: 'var(--gold-light)' }}>🎁 Vastra & Gifts:</strong>
                      <div style={{ color: 'var(--ivory-muted)', marginTop: '2px' }}>
                        {host.gifts}
                      </div>
                    </div>
                  </div>

                  {/* Dakshina Highlight */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                      padding: '8px 12px',
                      background: 'rgba(216, 67, 21, 0.12)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(216, 67, 21, 0.3)'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: '#FFB74D', fontWeight: 500 }}>
                      🪙 Shubh Dakshina:
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                      ₹{host.dakshinaAmount} / Child
                    </span>
                  </div>

                  {/* Slot Capacity Meter */}
                  <div style={{ marginBottom: '18px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: 'var(--ivory-subtle)',
                        marginBottom: '4px'
                      }}
                    >
                      <span>Capacity: {host.bookedSlots} / {host.totalSlots} booked</span>
                      <strong style={{ color: isFull ? '#EF5350' : '#81C784' }}>
                        {host.availableSlots} {host.availableSlots === 1 ? 'Slot' : 'Slots'} Left
                      </strong>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPct}%`,
                          height: '100%',
                          background: isFull
                            ? 'var(--status-full)'
                            : 'linear-gradient(90deg, #81C784, var(--gold-primary))',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => onOpenBooking(host)}
                  disabled={isFull}
                  className={isFull ? 'btn-outline' : 'btn-gold'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.92rem',
                    opacity: isFull ? 0.6 : 1,
                    cursor: isFull ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isFull ? '🚫 Capacity Reached' : '🙏 Request / Book Slot'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
