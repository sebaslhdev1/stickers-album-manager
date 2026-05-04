"use client";

import { useState } from "react";
import { Globe, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";
import { useT } from "@/i18n/use-t";
import type { Locale } from "@/i18n/types";
import { logout } from "@/services/auth";
import { getUserName } from "@/lib/token";
import { ROUTES } from "@/constants";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
}

export function Navbar() {
  const router = useRouter();
  const t = useT();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userName] = useState(() => getUserName());

  async function handleLogout() {
    await logout();
    router.push(ROUTES.LOGIN);
  }

  return (
    <header
      className="sticky top-0 z-10 shadow-md"
      style={{ backgroundColor: 'var(--brand-dark)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="group flex items-center gap-3">
          <Image
            src={process.env.NEXT_PUBLIC_LOGO_URL!}
            alt="KardKeeper logo"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-white">{t.navbar.appTitle}</span>
            <span className="text-[10px] tracking-wide" style={{ color: 'var(--brand-muted)' }}>
              {t.navbar.appSubtitle}
            </span>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-1 -mr-2">
          {/* Greeting */}
          {userName && (
            <span className="hidden sm:block text-sm text-white/70 pr-1">
              {t.navbar.greeting}, <span className="font-semibold text-white">{userName}</span>
            </span>
          )}
          {/* Language switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 rounded-full text-white hover:bg-white/10 px-2.5"
              onClick={() => { setLangOpen((o) => !o); setOpen(false); }}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{LOCALE_LABELS[locale]}</span>
            </Button>

            {langOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
                <div
                  className="absolute right-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-xl bg-white shadow-lg"
                  style={{ border: '1px solid color-mix(in srgb, var(--brand-dark) 10%, transparent)' }}
                >
                  {(["en", "es"] as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocale(l); setLangOpen(false); }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-black/5"
                      style={{ color: 'var(--brand-dark)', fontWeight: locale === l ? 700 : 400 }}
                    >
                      <span>{l === "en" ? "English" : "Español"}</span>
                      {locale === l && (
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-orange)' }} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10"
              onClick={() => { setOpen((o) => !o); setLangOpen(false); }}
            >
              <User className="h-5 w-5" />
            </Button>

            {open && (
              <>
                <div className="fixed inset-0" onClick={() => setOpen(false)} />
                <div
                  className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl bg-white shadow-lg"
                  style={{ border: '1px solid color-mix(in srgb, var(--brand-dark) 10%, transparent)' }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-black/5"
                    style={{ color: 'var(--brand-dark)' }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t.navbar.logOut}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
