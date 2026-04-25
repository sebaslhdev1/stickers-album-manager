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
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 shadow-sm shadow-black/5 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="group flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-md shadow-primary/30 transition-shadow group-hover:shadow-lg group-hover:shadow-primary/40">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">Sticker Album</span>
            <span className="text-[10px] tracking-wide text-muted-foreground/70">
              Collection Manager
            </span>
          </div>
        </Link>

        {/* User menu */}
        <div className="relative -mr-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setOpen((o) => !o)}
          >
            <User className="h-5 w-5" />
          </Button>

          {open && (
            <>
              {/* Backdrop to close on outside click */}
              <div className="fixed inset-0" onClick={() => setOpen(false)} />

              {/* Dropdown */}
              <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-black/5 bg-white shadow-lg shadow-black/10">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/5"
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
