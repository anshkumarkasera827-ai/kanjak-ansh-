import './globals.css';

export const metadata = {
  title: 'Kanjak Puja (कंजक पूजा) • Divine Offerings & Sacred Kanya Seva',
  description: 'A sacred, privacy-first devotional platform connecting Kanjak & Langur families with devotee Host families for Navratri Kanya Pujan, Prasad, and Dakshina.',
  keywords: 'Kanjak, Kanya Pujan, Navratri, Durga Ashtami, Maha Navami, Puja Slots, Prasad, Dakshina',
  authors: [{ name: 'Kanjak Seva Parivar' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#120C07',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
