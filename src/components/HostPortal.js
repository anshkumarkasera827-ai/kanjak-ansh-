'use client';

import { useState } from 'react';
import { playTempleBell } from './AudioChime';

export default function HostPortal({ onHostRegistered, prefilledToken }) {
  const [activeSubTab, setActiveSubTab] = useState(prefilledToken ? 'dashboard' : 'register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    familyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    pujaDate: '2026-10-20',
    tithi: 'Maha Ashtami (महाष्टमी)',
    timeSlot: '09:00 AM - 11:00 AM',
    totalSlots: 9,
    dakshinaAmount: 101,
    prasadMenu: 'Desi Ghee Sooji Halwa, Sukha Kala Chana, Garam Poori',
    gifts: 'Lal Chunri, Glass Bangles, Pencil Box, Coin',
    approximateArea: '',
    landmark: '',
    exactAddress: ''
  });

  // Host Dashboard State
  const [hostToken, setHostToken] = useState(prefilledToken || '');
  const [hostDetails, setHostDetails] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.familyName.trim() || !formData.contactPerson.trim() || !formData.phone.trim()) {
      setErrorMsg("Family name, contact person, and phone number are required.");
      return;
    }
    if (!formData.approximateArea.trim() || !formData.exactAddress.trim()) {
      setErrorMsg("Both approximate public area and exact address are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register Host Puja');
      }

      playTempleBell();
      setSuccessResult(data);
      setHostToken(data.hostToken);
      if (onHostRegistered) {
        onHostRegistered();
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHostDashboard = async (tokenToUse) => {
    const token = tokenToUse || hostToken;
    if (!token.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      // Find host by token
      const res = await fetch('/api/hosts');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error('Failed to query hosts');

      // Now query details with token
      let found = null;
      for (const h of data.hosts) {
        const detailRes = await fetch(`/api/hosts/${h.id}?token=${encodeURIComponent(token.trim())}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          if (detailData.success && detailData.host.hostToken === token.trim()) {
            found = detailData.host;
            break;
          }
        }
      }

      if (!found) {
        throw new Error("No Host Puja found matching this Host Secret Token. Please check your token.");
      }

      setHostDetails(found);
    } catch (err) {
      setHostDetails(null);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!hostDetails || !hostToken) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/hosts/${hostDetails.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: hostToken, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');

      setHostDetails((prev) => ({ ...prev, status: newStatus }));
      alert(`Puja availability status updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section style={{ padding: '20px 0 60px', maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px' }}>
          🪔 यजमान / पूजक परिवार पोर्टल
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--gold-light)', marginTop: '6px' }}>
          Host / Feeding Family Portal
        </h2>
        <p style={{ color: 'var(--ivory-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Register your Navratri Puja, offer sacred Prasad & Dakshina, and manage your Kanjak slots.
        </p>
      </div>

      {/* Sub Tabs */}
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
          🪔 Register New Puja Event
        </button>
        <button
          onClick={() => {
            setActiveSubTab('dashboard');
            setErrorMsg('');
            if (hostToken) fetchHostDashboard(hostToken);
          }}
          className={`btn-outline ${activeSubTab === 'dashboard' ? 'active-filter' : ''}`}
          style={{
            padding: '10px 22px',
            backgroundColor: activeSubTab === 'dashboard' ? 'var(--gold-primary)' : 'transparent',
            color: activeSubTab === 'dashboard' ? '#1A1005' : 'var(--gold-light)'
          }}
        >
          📊 Host Slot Management
        </button>
      </div>

      {/* Error message banner */}
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

      {/* SUB-TAB 1: REGISTER EVENT FORM */}
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
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🪔✨</div>
              <h3 style={{ color: 'var(--gold-light)', fontSize: '1.6rem', marginBottom: '10px' }}>
                Puja Event Successfully Listed!
              </h3>
              <p style={{ color: 'var(--ivory-muted)', maxWidth: '540px', margin: '0 auto 24px' }}>
                Your Kanjak Puja is now visible to families in your area. Your private address is safeguarded and
                will only be revealed to confirmed guardians.
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
                  YOUR HOST SECRET MANAGEMENT TOKEN
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
                  {successResult.hostToken}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
                  Host ID: {successResult.hostId} • Keep this token to update capacity or close slots.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(successResult.hostToken);
                    alert("Host token copied to clipboard!");
                  }}
                  className="btn-outline"
                >
                  📋 Copy Secret Token
                </button>
                <button
                  onClick={() => {
                    setActiveSubTab('dashboard');
                    fetchHostDashboard(successResult.hostToken);
                  }}
                  className="btn-gold"
                >
                  Manage My Slots →
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
                  Host Family & Contact Information
                </h3>
              </div>

              {/* Host Names & Phone */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Host Family Name *</label>
                  <input
                    type="text"
                    name="familyName"
                    required
                    placeholder="e.g. Mishra Parivar or Gupta Ji"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Person Name(s) *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    placeholder="e.g. Ramesh & Meena Mishra"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +91 98101 23456"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <div className="form-helper">Disclosed only to confirmed guardians.</div>
                </div>
              </div>

              {/* Date, Tithi, Time */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Puja Date *</label>
                  <input
                    type="date"
                    name="pujaDate"
                    required
                    value={formData.pujaDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Auspicious Tithi *</label>
                  <select
                    name="tithi"
                    value={formData.tithi}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="Maha Ashtami (महाष्टमी)">Maha Ashtami (महाष्टमी)</option>
                    <option value="Maha Navami (महानवमी)">Maha Navami (महानवमी)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Puja Time Window *</label>
                  <input
                    type="text"
                    name="timeSlot"
                    required
                    placeholder="e.g. 09:00 AM - 11:00 AM"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Slots & Dakshina */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Total Kanjak Slots Available *</label>
                  <input
                    type="number"
                    name="totalSlots"
                    required
                    min="1"
                    max="50"
                    value={formData.totalSlots}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <div className="form-helper">e.g. 9 Kanjak + 1 Langur = 10 total.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Shubh Dakshina Amount (₹ per Child) *</label>
                  <input
                    type="number"
                    name="dakshinaAmount"
                    required
                    min="0"
                    step="1"
                    value={formData.dakshinaAmount}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <div className="form-helper">e.g. ₹51, ₹101, ₹201, ₹501.</div>
                </div>
              </div>

              {/* Prasad & Offerings */}
              <div className="form-group">
                <label className="form-label">Prasad Menu Offerings *</label>
                <input
                  type="text"
                  name="prasadMenu"
                  required
                  placeholder="e.g. Desi Ghee Halwa, Kale Chane, Poori, Kheer, Fruits"
                  value={formData.prasadMenu}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gifts, Vastra & Offerings *</label>
                <input
                  type="text"
                  name="gifts"
                  required
                  placeholder="e.g. Lal Chunri, Bangles, Stationery Kit, Silver Coin"
                  value={formData.gifts}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              {/* Address Isolation: Public approximate vs Private exact */}
              <div
                style={{
                  background: 'rgba(20, 13, 8, 0.7)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--gold-light)', marginBottom: '8px' }}>
                  📍 Location Privacy Controls
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                    marginBottom: '12px'
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Public Neighborhood / Sector *</label>
                    <input
                      type="text"
                      name="approximateArea"
                      required
                      placeholder="e.g. Sector 14, Rohini or Indirapuram"
                      value={formData.approximateArea}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                    <div className="form-helper">Displayed publicly on search results.</div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Public Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near Hanuman Mandir Chowk"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: '#81C784' }}>
                    🔒 Exact Address (CONFIDENTIAL & PROTECTED) *
                  </label>
                  <textarea
                    rows={2}
                    name="exactAddress"
                    required
                    placeholder="e.g. Flat 302, Green Valley Apartments, Plot 14, Sector 14"
                    value={formData.exactAddress}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  <div className="form-helper" style={{ color: '#81C784' }}>
                    Shielded by server security rules. Only provided to guardians with a confirmed booking.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {loading ? 'Registering Puja...' : '🪔 Create Puja Event & Generate Host Token'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 2: HOST DASHBOARD & SLOT MANAGEMENT */}
      {activeSubTab === 'dashboard' && (
        <div>
          {/* Token Search Bar */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.2rem', marginBottom: '8px' }}>
              Host Puja Management Access
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ivory-muted)', marginBottom: '14px' }}>
              Enter your Host Secret Token (e.g. SEC-HST-XXXX) to review bookings and manage availability.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Enter Token (e.g. SEC-HST-7812)"
                value={hostToken}
                onChange={(e) => setHostToken(e.target.value.toUpperCase())}
                className="form-control"
                style={{ flex: '1', minWidth: '220px', textTransform: 'uppercase' }}
              />
              <button
                onClick={() => fetchHostDashboard(hostToken)}
                disabled={loading}
                className="btn-gold"
                style={{ padding: '10px 20px' }}
              >
                {loading ? 'Loading...' : '📊 Open Host Console'}
              </button>
            </div>
          </div>

          {/* Host Management Console */}
          {hostDetails && (
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
                  <h3 style={{ color: 'var(--gold-light)', fontSize: '1.4rem' }}>
                    {hostDetails.familyName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
                    {hostDetails.tithi} • {hostDetails.timeSlot} • {hostDetails.approximateArea}
                  </div>
                </div>

                {/* Current Status Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleUpdateStatus('open')}
                    disabled={updating || hostDetails.status === 'open'}
                    className="btn-outline"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      background: hostDetails.status === 'open' ? 'var(--status-open-bg)' : 'transparent',
                      borderColor: hostDetails.status === 'open' ? '#4CAF50' : 'var(--gold-border)'
                    }}
                  >
                    🟢 Open Slots
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('closed')}
                    disabled={updating || hostDetails.status === 'closed'}
                    className="btn-outline"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      background: hostDetails.status === 'closed' ? 'var(--status-full-bg)' : 'transparent',
                      borderColor: hostDetails.status === 'closed' ? '#E53935' : 'var(--gold-border)'
                    }}
                  >
                    🔴 Close Slots
                  </button>
                </div>
              </div>

              {/* Slot Progress Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '14px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ background: 'rgba(20, 13, 8, 0.7)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>Total Capacity</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    {hostDetails.totalSlots} Slots
                  </div>
                </div>

                <div style={{ background: 'rgba(20, 13, 8, 0.7)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>Confirmed Booked</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#81C784' }}>
                    {hostDetails.bookedSlots} Kanjaks
                  </div>
                </div>

                <div style={{ background: 'rgba(20, 13, 8, 0.7)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>Remaining Slots</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFB74D' }}>
                    {hostDetails.availableSlots} Slots
                  </div>
                </div>
              </div>

              {/* Confirmed Kanjaks List */}
              <div>
                <h4 style={{ color: 'var(--gold-light)', fontSize: '1.1rem', marginBottom: '14px' }}>
                  Confirmed Attending Kanjaks ({hostDetails.confirmedBookings?.length || 0})
                </h4>

                {(!hostDetails.confirmedBookings || hostDetails.confirmedBookings.length === 0) ? (
                  <div
                    style={{
                      background: 'rgba(20, 13, 8, 0.5)',
                      padding: '20px',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center',
                      color: 'var(--ivory-muted)',
                      fontSize: '0.9rem'
                    }}
                  >
                    No bookings confirmed yet. Your available slots are ready for devotee families.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {hostDetails.confirmedBookings.map((b) => (
                      <div
                        key={b.bookingId}
                        style={{
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid var(--gold-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 16px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--gold-light)' }}>
                            👧 {b.childFirstName}
                          </span>
                          <span className="badge-gold" style={{ fontSize: '0.72rem' }}>
                            {b.childAge} yrs
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--ivory-subtle)', marginTop: '4px' }}>
                          Ref: {b.bookingId} • Confirmed
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
