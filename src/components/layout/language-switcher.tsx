"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";
import type { Locale } from "@/i18n/types";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1.5 rounded-full text-white hover:bg-white/10 px-2.5"
        onClick={() => setOpen((o) => !o)}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold">{LOCALE_LABELS[locale]}</span>
      </Button>

      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-xl bg-white shadow-lg"
            style={{ border: "1px solid color-mix(in srgb, var(--brand-dark) 10%, transparent)" }}
          >
            {(["en", "es"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false); }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-black/5"
                style={{ color: "var(--brand-dark)", fontWeight: locale === l ? 700 : 400 }}
              >
                <span>{l === "en" ? "English" : "Español"}</span>
                {locale === l && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--brand-orange)" }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
