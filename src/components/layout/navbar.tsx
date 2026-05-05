"use client";

import { useState, useSyncExternalStore } from "react";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/use-t";
import { logout } from "@/services/auth";
import { getUserName } from "@/lib/token";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ROUTES } from "@/constants";

export function Navbar() {
  const router = useRouter();
  const t = useT();
  const [open, setOpen] = useState(false);
  const userName = useSyncExternalStore(() => () => {}, () => getUserName(), () => null);

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

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* User menu */}
          <div className="relative hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10"
              onClick={() => setOpen((o) => !o)}
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
                  {userName && (
                    <div className="sm:hidden border-b px-4 py-2.5" style={{ borderColor: 'color-mix(in srgb, var(--brand-dark) 8%, transparent)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>{userName}</p>
                    </div>
                  )}
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
