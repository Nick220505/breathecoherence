import Image from 'next/image';

import { Link } from '@/i18n/routing';

export function Logo() {
  return (
    <div className="relative">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/BC-logo-180x60.png"
          alt="Breathe Coherence"
          width={120}
          height={40}
          className="transition-transform duration-300 dark:invert"
          priority
        />
      </Link>
    </div>
  );
}
