import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Breathe Coherence',
    default: 'Breathe Coherence - Sacred Geometry and Flower Essences Shop',
  },
  description:
    'Discover our collection of sacred geometry objects and healing flower essences.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
