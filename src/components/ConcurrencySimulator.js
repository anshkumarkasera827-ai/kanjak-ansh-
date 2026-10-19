'use client';

import { useState } from 'react';

export default function ConcurrencySimulator() {
  const [running, setRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const runTest = async () => {
    setRunning(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/concurrency-test', {
        method: 'POST'
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <section style={{ padding: '20px 0 60px', maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px' }}>
          ⚡ कॉनकरेंसी एवं रेस कंडीशन सुरक्षा
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: 'var(--gold-light)', marginTop: '6px' }}>
          Backend Concurrency Race-Condition Verification
        </h2>
        <p style={{ color: 'var(--ivory-muted)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '640px', margin: '6px auto 0' }}>
          Verify that our database and backend mutex lock prevents double-booking, even when two families submit at the exact same millisecond.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            color: 'var(--ivory-text)'
          }}
        >
          <h4 style={{ color: 'var(--gold-light)', marginBottom: '8px' }}>
            How This Test Works:
          </h4>
          <ol style={{ paddingLeft: '20px', lineHeight: 1.6, color: 'var(--ivory-muted)' }}>
            <li>Creates an automated temporary Puja event with <strong>exactly 1 open slot</strong>.</li>
            <li>Creates two separate registered guardians (Child A and Child B).</li>
            <li>
              Fires two simultaneous booking requests in parallel using <code>Promise.all()</code> to simulate an identical millisecond collision.
            </li>
            <li>
              Verifies that the backend atomic transaction locks the slot: <strong>Request 1 is confirmed (200 OK)</strong> while <strong>Request 2 is immediately rejected with HTTP 409 Conflict</strong>.
            </li>
          </ol>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={runTest}
            disabled={running}
            className="btn-gold"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            {running ? '⚡ Firing Simultaneous Colliding Requests...' : '▶ Run Live Concurrency Collision Test'}
          </button>
        </div>

        {testResult && (
          <div
            style={{
              background: testResult.concurrencyProtected ? 'rgba(46, 125, 50, 0.15)' : 'rgba(198, 40, 40, 0.15)',
              border: `2px solid ${testResult.concurrencyProtected ? '#4CAF50' : '#E53935'}`,
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              animation: 'slide-up 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>{testResult.concurrencyProtected ? '✅' : '❌'}</span>
              <h3 style={{ color: testResult.concurrencyProtected ? '#81C784' : '#FF8A80', fontSize: '1.25rem' }}>
                {testResult.concurrencyProtected ? 'Concurrency Protection Verified!' : 'Test Failed'}
              </h3>
            </div>

            <p style={{ color: 'var(--ivory-text)', fontSize: '0.92rem', marginBottom: '18px' }}>
              {testResult.verdict}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px'
              }}
            >
              {/* Request 1 result */}
              <div
                style={{
                  background: 'rgba(20, 13, 8, 0.8)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>REQUEST 1 (Child A)</div>
                <div style={{ fontWeight: 600, color: testResult.request1?.success ? '#81C784' : '#FF8A80', marginTop: '4px' }}>
                  {testResult.request1?.success ? '🟢 200 OK - Slot Secured' : '🔴 409 Conflict'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
                  {testResult.request1?.message}
                </div>
              </div>

              {/* Request 2 result */}
              <div
                style={{
                  background: 'rgba(20, 13, 8, 0.8)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--ivory-subtle)' }}>REQUEST 2 (Child B)</div>
                <div style={{ fontWeight: 600, color: testResult.request2?.success ? '#81C784' : '#FF8A80', marginTop: '4px' }}>
                  {testResult.request2?.success ? '🟢 200 OK - Slot Secured' : '🔴 409 Conflict - Atomic Lock Rejected'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
                  {testResult.request2?.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
