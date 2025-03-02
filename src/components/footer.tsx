"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 backdrop-blur-xs border-t">
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
              © {currentYear} Breathe Coherence. {t("rights")}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={{
                pathname: "/store",
                query: { category: "Sacred Geometry" },
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.sacred_geometry")}
            </Link>
            <Link
              href={{
                pathname: "/store",
                query: { category: "Flower Essence" },
              }}
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
