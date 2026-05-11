"use client"

import { ROUTES } from "@/constants"
import { useLocale } from "@/i18n/provider"
import type { Locale } from "@/i18n/types"
import { useT } from "@/i18n/use-t"
import { getUserCode, getUserName } from "@/lib/token"
import { logout } from "@/services/auth"
import {
  ArrowLeftRight,
  BookOpen,
  Check,
  Copy,
  LogOut,
  User,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

const TRANSITION_MS = 300

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useT()
  const { locale, setLocale } = useLocale()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const userName = useSyncExternalStore(
    () => () => {},
    () => getUserName(),
    () => null,
  )
  const userCode = useSyncExternalStore(
    () => () => {},
    () => getUserCode(),
    () => null,
  )

  function handleCopyCode() {
    if (!userCode) return
    navigator.clipboard.writeText(userCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      if (currentY < 10) {
        setNavHidden(false)
      } else if (currentY > lastScrollY.current) {
        setNavHidden(true)
      } else {
        setNavHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHome = pathname === "/"
  const isAlbum = /^\/album\/[^/]+/.test(pathname)
  const profileOpen = mounted

  function openExchange() {
    window.dispatchEvent(new CustomEvent("open:exchange"))
  }

  function openProfile() {
    setMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }

  function closeProfile() {
    setVisible(false)
    setTimeout(() => setMounted(false), TRANSITION_MS)
  }

  async function handleLogout() {
    closeProfile()
    await logout()
    router.push(ROUTES.LOGIN)
  }

  return (
    <>
      <nav
        className='md:hidden fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center border-t transition-transform duration-300 ease-in-out'
        style={{
          backgroundColor: "var(--brand-dark)",
          borderColor: "rgba(255,255,255,0.08)",
          transform:
            navHidden && !profileOpen ? "translateY(100%)" : "translateY(0)",
        }}
      >
        <button
          onClick={() => router.push(ROUTES.HOME)}
          className='flex flex-1 flex-col items-center gap-1 py-2'
        >
          <BookOpen
            className='h-5 w-5'
            style={{
              color: isHome ? "var(--brand-orange)" : "rgba(255,255,255,0.4)",
            }}
          />
          <span
            className='text-[10px] font-medium'
            style={{
              color: isHome ? "var(--brand-orange)" : "rgba(255,255,255,0.4)",
            }}
          >
            {t.home.title}
          </span>
        </button>

        {isAlbum && (
          <button
            onClick={openExchange}
            className='flex flex-1 flex-col items-center gap-1 py-2'
          >
            <ArrowLeftRight
              className='h-5 w-5'
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <span
              className='text-[10px] font-medium'
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {t.exchange.title}
            </span>
          </button>
        )}

        <button
          onClick={openProfile}
          className='flex flex-1 flex-col items-center gap-1 py-2'
        >
          <User
            className='h-5 w-5'
            style={{
              color: profileOpen
                ? "var(--brand-orange)"
                : "rgba(255,255,255,0.4)",
            }}
          />
          <span
            className='text-[10px] font-medium'
            style={{
              color: profileOpen
                ? "var(--brand-orange)"
                : "rgba(255,255,255,0.4)",
            }}
          >
            {t.navbar.profile}
          </span>
        </button>
      </nav>

      {mounted && (
        <>
          {/* Backdrop */}
          <div
            className='md:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300'
            style={{ opacity: visible ? 1 : 0 }}
            onClick={closeProfile}
          />

          {/* Sheet */}
          <div
            className='md:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl bg-white transition-transform duration-300 ease-out'
            style={{
              transform: visible ? "translateY(0)" : "translateY(100%)",
            }}
          >
            {/* Handle */}
            <div className='flex justify-center pb-2 pt-3'>
              <div className='h-1 w-10 rounded-full bg-black/10' />
            </div>

            {/* User info */}
            {userName && (
              <div
                className='border-b px-6 pb-4'
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <p className='text-xs text-black/40'>{t.navbar.greeting},</p>
                <div className='flex items-center gap-2'>
                  <p
                    className='text-base font-semibold'
                    style={{ color: "var(--brand-dark)" }}
                  >
                    {userName}
                  </p>
                  {userCode && (
                    <button
                      onClick={handleCopyCode}
                      className='mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-widest transition-colors'
                      style={{
                        backgroundColor: codeCopied
                          ? "#dcfce7"
                          : "rgba(0,0,0,0.06)",
                        color: codeCopied ? "#16a34a" : "rgba(0,0,0,0.4)",
                      }}
                    >
                      {codeCopied ? (
                        <Check className='h-3 w-3' />
                      ) : (
                        <Copy className='h-3 w-3' />
                      )}
                      {codeCopied ? t.stickers.copied : userCode}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Language */}
            <div
              className='border-b px-6 py-4'
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <p className='mb-3 text-xs font-medium uppercase tracking-wider text-black/40'>
                {t.navbar.language}
              </p>
              <div className='flex gap-2'>
                {(["en", "es"] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className='flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors'
                    style={{
                      backgroundColor:
                        locale === l
                          ? "var(--brand-orange)"
                          : "rgba(0,0,0,0.05)",
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
              className='flex w-full items-center gap-3 px-6 py-4 text-sm text-red-500'
            >
              <LogOut className='h-4 w-4' />
              {t.navbar.logOut}
            </button>
          </div>
        </>
      )}
    </>
  )
}
