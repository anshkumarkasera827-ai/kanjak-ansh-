// src/components/AudioChime.js
'use client';

// Pure Web Audio API devotional temple bell synthesizer
// Zero external audio assets needed - 100% reliable and lightweight!
export function playTempleBell() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const fundamental = 523.25; // Auspicious C5 harmonic

    // Bell harmonics (ratios typical of Indian temple brass bells / ghanti)
    const harmonics = [1, 2.01, 3.02, 4.2, 5.4];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04];

    harmonics.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(fundamental * ratio, now);

      // Bell strike envelope: Instant attack, long resonant golden decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gains[index], now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.8 - index * 0.3);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.0);
    });
  } catch (e) {
    console.warn("Devotional audio chime not supported on this browser:", e);
  }
}
