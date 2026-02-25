import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Breathe Coherence',
    default: 'Breathe Coherence - Sacred Geometry and Flower Essences Shop',
  },
  description:
    'Discover our collection of sacred geometry objects and healing flower essences.',
  icons: {
    icon: [
      {
        url: '/images/BC-logo-transp-120.png',
        sizes: '120x120',
        type: 'image/png',
      },
      {
        url: '/images/BC-logo-transp-120.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/images/BC-logo-transp-120.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/images/BC-logo-transp-120.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
