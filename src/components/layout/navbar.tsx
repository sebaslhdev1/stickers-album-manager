"use client";

import { useState } from "react";
import { LogOut, Trophy, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth";
import { ROUTES } from "@/constants";

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
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
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl shadow-md transition-shadow group-hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, var(--brand-orange) 0%, #c96a22 100%)`,
              boxShadow: `0 4px 12px color-mix(in srgb, var(--brand-orange) 40%, transparent)`,
            }}
          >
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-white">Sticker Album</span>
            <span className="text-[10px] tracking-wide" style={{ color: 'var(--brand-muted)' }}>
              Collection Manager
            </span>
          </div>
        </Link>

        {/* User menu */}
        <div className="relative -mr-2">
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
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-black/5"
                  style={{ color: 'var(--brand-dark)' }}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
