"use client"

import { createContext, useContext, useState } from "react"
import type { Locale } from "./types"

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
})

function detectLocale(): Locale {
  const saved = localStorage.getItem("locale")
  if (saved === "en" || saved === "es") return saved
  return navigator.language.startsWith("es") ? "es" : "en"
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en"
    return detectLocale()
  })

  function setLocale(l: Locale) {
    localStorage.setItem("locale", l)
    setLocaleState(l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
