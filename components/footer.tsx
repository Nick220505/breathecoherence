"use client";

import { useTranslation } from "@/components/language-provider";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                width={120}
                height={120}
                className="dark:invert w-[60px] h-[60px]"
                priority
              />
            </Link>
            <span className="text-sm text-muted-foreground">
              © {currentYear} Breathe Coherence. {t("footer.rights")}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/store?category=Sacred Geometry"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.sacred_geometry")}
            </Link>
            <Link
              href="/store?category=Flower Essence"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.flower_essences")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
