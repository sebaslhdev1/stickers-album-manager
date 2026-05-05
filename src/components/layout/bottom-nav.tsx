"use client";

import { useSyncExternalStore, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogOut, User } from "lucide-react";
import { useT } from "@/i18n/use-t";
import { useLocale } from "@/i18n/provider";
import { logout } from "@/services/auth";
import { getUserName } from "@/lib/token";
import { ROUTES } from "@/constants";
import type { Locale } from "@/i18n/types";

const TRANSITION_MS = 300;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const { locale, setLocale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const userName = useSyncExternalStore(() => () => {}, () => getUserName(), () => null);

  const isHome = pathname === "/";
  const profileOpen = mounted;

  function openProfile() {
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  function closeProfile() {
    setVisible(false);
    setTimeout(() => setMounted(false), TRANSITION_MS);
  }

  async function handleLogout() {
    closeProfile();
    await logout();
    router.push(ROUTES.LOGIN);
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center border-t"
        style={{ backgroundColor: "var(--brand-dark)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={() => router.push(ROUTES.HOME)}
          className="flex flex-1 flex-col items-center gap-1 py-2"
        >
          <BookOpen
            className="h-5 w-5"
            style={{ color: isHome ? "var(--brand-orange)" : "rgba(255,255,255,0.4)" }}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: isHome ? "var(--brand-orange)" : "rgba(255,255,255,0.4)" }}
          >
            {t.home.title}
          </span>
        </button>

        <button
          onClick={openProfile}
          className="flex flex-1 flex-col items-center gap-1 py-2"
        >
          <User
            className="h-5 w-5"
            style={{ color: profileOpen ? "var(--brand-orange)" : "rgba(255,255,255,0.4)" }}
          />
          <span
            className="text-[10px] font-medium"
            style={{ color: profileOpen ? "var(--brand-orange)" : "rgba(255,255,255,0.4)" }}
          >
            {t.navbar.profile}
          </span>
        </button>
      </nav>

      {mounted && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
            onClick={closeProfile}
          />

          {/* Sheet */}
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl bg-white transition-transform duration-300 ease-out"
            style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-black/10" />
            </div>

            {/* User info */}
            {userName && (
              <div className="border-b px-6 pb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <p className="text-xs text-black/40">{t.navbar.greeting},</p>
                <p className="text-base font-semibold" style={{ color: "var(--brand-dark)" }}>
                  {userName}
                </p>
              </div>
            )}

            {/* Language */}
            <div className="border-b px-6 py-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-black/40">
                {t.navbar.language}
              </p>
              <div className="flex gap-2">
                {(["en", "es"] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: locale === l ? "var(--brand-orange)" : "rgba(0,0,0,0.05)",
                      color: locale === l ? "#fff" : "var(--brand-dark)",
                    }}
                  >
                    {l === "en" ? "English" : "Español"}
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-6 py-4 text-sm text-red-500"
            >
              <LogOut className="h-4 w-4" />
              {t.navbar.logOut}
            </button>
          </div>
        </>
      )}
    </>
  );
}
