import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Coffee Spotter',
  description: 'Find the best coffee at the best prices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name="google-adsense-account" content="ca-pub-9438181953083320"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        {/* Google AdSense script; loads only if keys are present */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            id='adsense-script'
            async
            strategy='afterInteractive'
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin='anonymous'
          />
        )}
  {/* Ad unit is rendered in MapView's GlassContainer */}
      </body>
    </html>
  );
}
