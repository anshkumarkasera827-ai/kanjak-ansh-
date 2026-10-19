'use client';

import { useState } from 'react';
import { playTempleBell } from './AudioChime';

export default function BookingModal({ host, onClose, guardianTokenDefault, onBookingSuccess, onGoToGuardianRegister }) {
  const [guardianToken, setGuardianToken] = useState(guardianTokenDefault || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isConflict, setIsConflict] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!guardianToken.trim()) {
      setErrorMsg("Please enter your private Guardian Token (e.g. KNJ-SEC-XXXX) to book.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setIsConflict(false);

    try {
      const res = await fetch('/api/bookings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: host.id,
          guardianToken: guardianToken.trim(),
          notes
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.conflict || res.status === 409) {
          setIsConflict(true);
          throw new Error(data.error || "This slot was just claimed by another family at this exact second.");
        }
        throw new Error(data.error || "Booking request could not be processed.");
      }

      playTempleBell();
      setConfirmedBooking(data);
      if (onBookingSuccess) {
        onBookingSuccess(data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: 'var(--ivory-subtle)',
            fontSize: '1.4rem',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close Modal"
        >
          ✕
        </button>

        {confirmedBooking ? (
          /* SUCCESS STATE: SACRED BOOKING PASS */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🕉️✨</div>
            <span className="badge-status open" style={{ marginBottom: '10px' }}>
              Confirmed Booking Pass
            </span>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.5rem', marginBottom: '4px' }}>
              Jai Mata Di!
            </h3>
            <p style={{ color: 'var(--ivory-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Slot successfully confirmed for <strong style={{ color: 'var(--gold-light)' }}>{confirmedBooking.childFirstName}</strong> with{' '}
              <strong style={{ color: 'var(--gold-light)' }}>{confirmedBooking.hostFamilyName}</strong>.
            </p>

            {/* Devotional Pass Container */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '2px solid var(--gold-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--gold-border)',
                  paddingBottom: '10px',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ivory-subtle)' }}>BOOKING REFERENCE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-light)', fontFamily: 'monospace' }}>
                    {confirmedBooking.bookingId}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ivory-subtle)' }}>TITHI & TIME</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ivory-text)', fontWeight: 600 }}>
                    {confirmedBooking.tithi} • {confirmedBooking.timeSlot}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.86rem', color: 'var(--ivory-text)', marginBottom: '14px' }}>
                <div>🪙 <strong>Dakshina:</strong> ₹{confirmedBooking.dakshinaAmount} per child</div>
                <div>🍲 <strong>Prasad:</strong> {confirmedBooking.prasadMenu}</div>
                <div>🎁 <strong>Offerings:</strong> {confirmedBooking.gifts}</div>
              </div>

              {/* REVEALED EXACT ADDRESS */}
              <div
                style={{
                  background: 'rgba(20, 13, 8, 0.95)',
                  border: '1px solid #4CAF50',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#81C784', fontWeight: 700, marginBottom: '2px' }}>
                  📍 CONFIDENTIAL ADDRESS REVEALED TO CONFIRMED GUARDIAN:
                </div>
                <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 500 }}>
                  {confirmedBooking.exactAddress}
                  {confirmedBooking.landmark && ` (Landmark: ${confirmedBooking.landmark})`}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', marginTop: '4px' }}>
                  Contact: {confirmedBooking.contactPerson} • {confirmedBooking.hostPhone}
                </div>
              </div>
            </div>

            <button onClick={onClose} className="btn-gold" style={{ width: '100%', padding: '12px' }}>
              Done & Return to Offerings
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            <div style={{ marginBottom: '18px' }}>
              <span className="badge-gold" style={{ marginBottom: '6px' }}>
                🙏 Kanjak Puja Slot Request
              </span>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.4rem', marginTop: '4px' }}>
                Book with {host.familyName}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ivory-muted)' }}>
                {host.tithi} • {host.timeSlot} • {host.approximateArea}
              </p>
            </div>

            {/* Offerings Summary */}
            <div
              style={{
                background: 'rgba(20, 13, 8, 0.7)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                marginBottom: '20px',
                fontSize: '0.84rem',
                border: '1px solid var(--gold-border)'
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                <strong style={{ color: 'var(--gold-light)' }}>Dakshina:</strong> ₹{host.dakshinaAmount} per Kanjak
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong style={{ color: 'var(--gold-light)' }}>Prasad:</strong> {host.prasadMenu}
              </div>
              <div>
                <strong style={{ color: 'var(--gold-light)' }}>Gifts:</strong> {host.gifts}
              </div>
            </div>

            {/* Conflict or Error Notice */}
            {errorMsg && (
              <div
                className="toast-error"
                style={{
                  position: 'relative',
                  marginBottom: '18px',
                  width: '100%',
                  maxWidth: '100%',
                  bottom: 'auto',
                  right: 'auto',
                  border: isConflict ? '2px solid #FF5252' : '1px solid #E53935'
                }}
              >
                <div>
                  <strong>{isConflict ? '⚡ Concurrency Conflict Detected:' : '⚠️ Notice:'}</strong>
                  <div style={{ marginTop: '2px', fontSize: '0.88rem' }}>{errorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Your Guardian Private Token *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KNJ-SEC-5511"
                  value={guardianToken}
                  onChange={(e) => setGuardianToken(e.target.value.toUpperCase())}
                  className="form-control"
                  style={{ textTransform: 'uppercase' }}
                />
                <div className="form-helper">
                  Don't have a token yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGoToGuardianRegister();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-light)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Register your child in 1 minute here
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Devotional Note / Timings (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Arriving around 9:30 AM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-control"
                />
              </div>

              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--ivory-muted)',
                  marginBottom: '20px'
                }}
              >
                🔒 <strong>Privacy Assurance:</strong> Slot booking is executed with atomic server-side locking to prevent
                double-bookings. Exact host address is revealed upon confirmation.
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onClose} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-gold">
                  {loading ? 'Securing Slot Atomically...' : '🙏 Confirm Slot Booking'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
