"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/routing";
import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type SupportedLanguage = "en" | "es";

const languages = {
  en: {
    name: "English",
    flag: "🇺🇸",
    label: "Switch to English",
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    label: "Cambiar a Español",
  },
} as const satisfies Record<
  SupportedLanguage,
  {
    name: string;
    flag: string;
    label: string;
  }
>;

export function LanguageToggle() {
  const t = useTranslations("LanguageToggle");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as SupportedLanguage;

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    if (pathname.startsWith("/product/")) {
      const id = pathname.split("/").pop() || "";
      router.replace(
        { pathname: "/product/[id]", params: { id } },
        { locale: newLanguage },
      );
    } else {
      router.replace(pathname as Exclude<typeof pathname, "/product/[id]">, {
        locale: newLanguage,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("toggle_language")}>
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {(
          Object.entries(languages) as Array<
            [SupportedLanguage, (typeof languages)[SupportedLanguage]]
          >
        ).map(([code, { name, flag, label }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="flex items-center justify-between cursor-pointer hover:bg-accent/50 focus:bg-accent"
            aria-label={label}
            aria-current={currentLocale === code ? "true" : undefined}
          >
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">
                {flag}
              </span>
              <span>{name}</span>
            </div>
            {currentLocale === code && (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
