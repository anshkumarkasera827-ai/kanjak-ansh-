'use client';

import { useState } from 'react';
import { playTempleBell } from './AudioChime';

export default function GuardianPortal({ onRegisteredSuccess, prefilledToken }) {
  const [activeSubTab, setActiveSubTab] = useState(prefilledToken ? 'dashboard' : 'register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    childFirstName: '',
    childAge: '6',
    childType: 'kanjak',
    guardianName: '',
    guardianRelation: 'Mother',
    phone: '',
    email: '',
    locality: '',
    dietaryNotes: 'Satvik (Pure Vegetarian)',
    consentGiven: false
  });

  // Dashboard Lookup State
  const [lookupToken, setLookupToken] = useState(prefilledToken || '');
  const [guardianRecord, setGuardianRecord] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.childFirstName.trim()) {
      setErrorMsg("Please provide your child's first name or devotional alias.");
      return;
    }
    if (!formData.guardianName.trim() || !formData.phone.trim()) {
      setErrorMsg("Guardian name and contact phone number are required.");
      return;
    }
    if (!formData.locality.trim()) {
      setErrorMsg("Please provide your approximate neighborhood or sector.");
      return;
    }
    if (!formData.consentGiven) {
      setErrorMsg("You must give explicit legal guardian consent to register.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/guardians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      playTempleBell();
      setSuccessResult(data);
      setLookupToken(data.guardianToken);
      if (onRegisteredSuccess) {
        onRegisteredSuccess(data.guardianToken);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuardianDashboard = async (tokenToUse) => {
    const token = tokenToUse || lookupToken;
    if (!token.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/guardians/${encodeURIComponent(token.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No registration found for this token');
      }
      setGuardianRecord(data.guardian);
    } catch (err) {
      setGuardianRecord(null);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRegistration = async () => {
    if (!lookupToken.trim()) return;
    setIsDeleting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/guardians/${encodeURIComponent(lookupToken.trim())}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to withdraw registration');
      }

      alert("Your registration and all child data have been permanently deleted, and any reserved slots released.");
      setGuardianRecord(null);
      setSuccessResult(null);
      setLookupToken('');
      setDeleteConfirmOpen(false);
      setActiveSubTab('register');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section style={{ padding: '20px 0 60px', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="badge-saffron" style={{ marginBottom: '8px' }}>
          👧 कंजक एवं लांगूर परिवार पोर्टल
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--gold-light)', marginTop: '6px' }}>
          Kanjak / Guardian Portal
        </h2>
        <p style={{ color: 'var(--ivory-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Respectful registration with absolute child privacy, data minimization, and 1-click withdrawal rights.
        </p>
      </div>

      {/* Sub Tab Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '28px'
        }}
      >
        <button
          onClick={() => {
            setActiveSubTab('register');
            setErrorMsg('');
          }}
          className={`btn-outline ${activeSubTab === 'register' ? 'active-filter' : ''}`}
          style={{
            padding: '10px 22px',
            backgroundColor: activeSubTab === 'register' ? 'var(--gold-primary)' : 'transparent',
            color: activeSubTab === 'register' ? '#1A1005' : 'var(--gold-light)'
          }}
        >
          📝 Register Child (Kanjak / Langur)
        </button>
        <button
          onClick={() => {
            setActiveSubTab('dashboard');
            setErrorMsg('');
            if (lookupToken) fetchGuardianDashboard(lookupToken);
          }}
          className={`btn-outline ${activeSubTab === 'dashboard' ? 'active-filter' : ''}`}
          style={{
            padding: '10px 22px',
            backgroundColor: activeSubTab === 'dashboard' ? 'var(--gold-primary)' : 'transparent',
            color: activeSubTab === 'dashboard' ? '#1A1005' : 'var(--gold-light)'
          }}
        >
          🔍 View My Bookings & Manage
        </button>
      </div>

      {/* Alert Error Banner */}
      {errorMsg && (
        <div
          className="toast-error"
          style={{
            position: 'relative',
            marginBottom: '20px',
            width: '100%',
            maxWidth: '100%',
            bottom: 'auto',
            right: 'auto'
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      {/* SUB-TAB 1: REGISTRATION FORM */}
      {activeSubTab === 'register' && (
        <div>
          {successResult ? (
            <div
              className="glass-card"
              style={{
                padding: '36px',
                textAlign: 'center',
                border: '2px solid var(--gold-primary)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🙏✨</div>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.6rem', marginBottom: '10px' }}>
                Jai Mata Di! Registration Successful
              </h3>
              <p style={{ color: 'var(--ivory-muted)', maxWidth: '540px', margin: '0 auto 24px' }}>
                {successResult.message}
              </p>

              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px dashed var(--gold-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'inline-block',
                  marginBottom: '24px'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--ivory-subtle)', marginBottom: '4px' }}>
                  YOUR PRIVATE GUARDIAN ACCESS TOKEN
                </div>
                <div
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--gold-light)',
                    letterSpacing: '2px',
                    fontFamily: 'monospace'
                  }}
                >
                  {successResult.guardianToken}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
                  Keep this token safe. You will need it to book slots and manage bookings.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(successResult.guardianToken);
                    alert("Token copied to clipboard!");
                  }}
                  className="btn-outline"
                >
                  📋 Copy Token
                </button>
                <button
                  onClick={() => {
                    setActiveSubTab('dashboard');
                    fetchGuardianDashboard(successResult.guardianToken);
                  }}
                  className="btn-gold"
                >
                  View My Dashboard →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="glass-card" style={{ padding: '32px' }}>
              <div
                style={{
                  borderBottom: '1px solid var(--gold-border)',
                  paddingBottom: '14px',
                  marginBottom: '24px'
                }}
              >
                <h3 style={{ color: 'var(--gold-light)', fontSize: '1.25rem' }}>
                  Child & Guardian Details
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--ivory-subtle)', marginTop: '4px' }}>
                  Data Minimization Policy: We only collect what is necessary to confirm Puja attendance.
                </div>
              </div>

              {/* Grid 1: Child info */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Child's First Name / Devotional Alias *</label>
                  <input
                    type="text"
                    name="childFirstName"
                    required
                    placeholder="e.g. Aaradhya or Kanha"
                    value={formData.childFirstName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <div className="form-helper">First name or nickname only. No surname required.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Child Age (2 - 20 Years) *</label>
                  <select
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((age) => (
                      <option key={age} value={age}>
                        {age} Years Old
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Devotional Role *</label>
                  <select
                    name="childType"
                    value={formData.childType}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="kanjak">Kanjak Devi (कन्या रूप)</option>
                    <option value="langur">Langur / Batuk Bhairav (लांगूर रूप)</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Guardian Info */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Parent / Guardian Full Name *</label>
                  <input
                    type="text"
                    name="guardianName"
                    required
                    placeholder="e.g. Meenakshi Devi"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship with Child *</label>
                  <select
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="Mother">Mother (माता)</option>
                    <option value="Father">Father (पिता)</option>
                    <option value="Grandparent">Grandparent (दादी / नानी)</option>
                    <option value="Legal Guardian">Legal Guardian (अभिभावक)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Guardian Mobile Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Locality & Dietary Notes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}
              >
                <div className="form-group">
                  <label className="form-label">General Neighborhood / Locality *</label>
                  <input
                    type="text"
                    name="locality"
                    required
                    placeholder="e.g. Sector 14, Rohini or Indirapuram"
                    value={formData.locality}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <div className="form-helper">
                    Neighborhood or sector only. Do not provide your home house number.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dietary or Allergy Preferences</label>
                  <input
                    type="text"
                    name="dietaryNotes"
                    placeholder="e.g. Satvik pure vegetarian, no peanuts"
                    value={formData.dietaryNotes}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Explicit Consent & Privacy Agreement */}
              <div
                style={{
                  background: 'rgba(216, 67, 21, 0.1)',
                  border: '1px solid rgba(216, 67, 21, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  marginBottom: '24px'
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    color: 'var(--ivory-text)'
                  }}
                >
                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={formData.consentGiven}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px',
                      accentColor: 'var(--gold-primary)',
                      cursor: 'pointer'
                    }}
                  />
                  <div>
                    <strong style={{ color: 'var(--gold-light)' }}>
                      Explicit Legal Guardian Consent & Privacy Terms *
                    </strong>
                    <div style={{ color: 'var(--ivory-muted)', marginTop: '4px', lineHeight: 1.45 }}>
                      I certify that I am the legal parent or guardian of this child. I explicitly consent to
                      participating in Kanjak Puja coordination. I understand that my child's details are strictly
                      private, never publicly indexed, and shared solely with a confirmed host family upon mutual
                      confirmation. I reserve the right to withdraw or permanently delete this registration at any time.
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {loading ? 'Submitting Registration...' : '🙏 Complete Guardian Registration & Get Access Key'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 2: GUARDIAN DASHBOARD & WITHDRAWAL */}
      {activeSubTab === 'dashboard' && (
        <div>
          {/* Token Search Bar */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.2rem', marginBottom: '8px' }}>
              Lookup Your Guardian Registration
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ivory-muted)', marginBottom: '14px' }}>
              Enter the private Guardian Token provided during registration (e.g. KNJ-SEC-XXXX).
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Enter Token (e.g. KNJ-SEC-5511)"
                value={lookupToken}
                onChange={(e) => setLookupToken(e.target.value.toUpperCase())}
                className="form-control"
                style={{ flex: '1', minWidth: '220px', textTransform: 'uppercase' }}
              />
              <button
                onClick={() => fetchGuardianDashboard(lookupToken)}
                disabled={loading}
                className="btn-gold"
                style={{ padding: '10px 20px' }}
              >
                {loading ? 'Searching...' : '🔍 Access Dashboard'}
              </button>
            </div>
          </div>

          {/* Record Display */}
          {guardianRecord && (
            <div className="glass-card" style={{ padding: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid var(--gold-border)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ color: 'var(--gold-light)', fontSize: '1.4rem' }}>
                      {guardianRecord.childFirstName}
                    </h3>
                    <span className="badge-gold">
                      {guardianRecord.childType === 'kanjak' ? 'Kanjak Devi' : 'Langur Bhairav'} ({guardianRecord.childAge} yrs)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
                    Guardian: {guardianRecord.guardianName} ({guardianRecord.guardianRelation}) • Locality: {guardianRecord.locality}
                  </div>
                </div>

                {/* Withdraw / Delete Button */}
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="btn-danger-outline"
                >
                  🗑️ Withdraw Registration
                </button>
              </div>

              {/* Confirmed Bookings Section */}
              <div>
                <h4 style={{ color: 'var(--gold-light)', marginBottom: '14px', fontSize: '1.1rem' }}>
                  Confirmed Puja Invitations ({guardianRecord.bookings.length})
                </h4>

                {guardianRecord.bookings.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(20, 13, 8, 0.6)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '24px',
                      textAlign: 'center',
                      color: 'var(--ivory-muted)'
                    }}
                  >
                    <p style={{ marginBottom: '12px' }}>
                      No Puja bookings requested yet for {guardianRecord.childFirstName}.
                    </p>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="btn-gold"
                      style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                    >
                      Browse Offerings & Book a Slot
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {guardianRecord.bookings.map((booking) => (
                      <div
                        key={booking.bookingId}
                        style={{
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid var(--gold-primary)',
                          borderRadius: 'var(--radius-md)',
                          padding: '20px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '10px',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}
                        >
                          <div>
                            <span className="badge-saffron" style={{ marginBottom: '6px' }}>
                              {booking.tithi}
                            </span>
                            <h4 style={{ fontSize: '1.2rem', color: 'var(--gold-light)' }}>
                              {booking.hostFamilyName}
                            </h4>
                          </div>
                          <span className="badge-status open">
                            <span className="status-dot" /> Confirmed: {booking.bookingId}
                          </span>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '12px',
                            fontSize: '0.88rem',
                            marginBottom: '14px'
                          }}
                        >
                          <div>⏰ <strong>Timings:</strong> {booking.timeSlot}</div>
                          <div>🪙 <strong>Dakshina:</strong> ₹{booking.dakshinaAmount}</div>
                          <div>🍲 <strong>Prasad:</strong> {booking.prasadMenu}</div>
                          <div>🎁 <strong>Gifts:</strong> {booking.gifts}</div>
                        </div>

                        {/* REVEALED PRIVATE HOST ADDRESS & CONTACT (Exclusively for confirmed guardians) */}
                        <div
                          style={{
                            background: 'rgba(24, 16, 10, 0.95)',
                            border: '1px dashed var(--gold-primary)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '12px 16px',
                            marginTop: '10px'
                          }}
                        >
                          <div style={{ fontSize: '0.82rem', color: '#81C784', fontWeight: 600, marginBottom: '4px' }}>
                            ✅ REVEALED HOST ADDRESS & CONTACT (Private to Confirmed Guardian):
                          </div>
                          <div style={{ fontSize: '0.92rem', color: 'var(--ivory-text)' }}>
                            <strong>Host Address:</strong> {booking.exactAddress}
                            {booking.landmark && ` (Landmark: ${booking.landmark})`}
                          </div>
                          <div style={{ fontSize: '0.88rem', color: 'var(--gold-light)', marginTop: '4px' }}>
                            <strong>Contact:</strong> {booking.contactPerson} • {booking.hostPhone}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmOpen && (
            <div className="modal-backdrop">
              <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
                <h3 style={{ color: '#FF8A80', marginBottom: '10px' }}>
                  Withdraw Registration?
                </h3>
                <p style={{ color: 'var(--ivory-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  This will permanently delete {guardianRecord?.childFirstName}'s record and cancel all confirmed Puja
                  slots. This action is immediate and cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawRegistration}
                    disabled={isDeleting}
                    className="btn-danger-outline"
                    style={{ background: '#D32F2F', color: '#FFFFFF', border: 'none' }}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Permanently Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
