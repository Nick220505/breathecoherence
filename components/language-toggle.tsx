"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { useTranslation } from "./language-provider";

type SupportedLanguage = "en" | "es";

const languages: Record<SupportedLanguage, { name: string; flag: string }> = {
  en: {
    name: "English",
    flag: "🇺🇸",
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
  },
};

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {(
          Object.entries(languages) as [
            SupportedLanguage,
            { name: string; flag: string },
          ][]
        ).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as SupportedLanguage)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{flag}</span>
              <span>{name}</span>
            </div>
            {language === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
