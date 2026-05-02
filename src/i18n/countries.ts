"use client"

import { useLocale } from "./provider"
import type { Locale } from "./types"

// Flags are locale-independent
export const countryFlags: Record<string, string> = {
  // UEFA (16)
  AUT: "🇦🇹",
  BEL: "🇧🇪",
  BIH: "🇧🇦",
  CRO: "🇭🇷",
  CZE: "🇨🇿",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  FRA: "🇫🇷",
  GER: "🇩🇪",
  NED: "🇳🇱",
  NOR: "🇳🇴",
  POR: "🇵🇹",
  SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  ESP: "🇪🇸",
  SWE: "🇸🇪",
  SUI: "🇨🇭",
  TUR: "🇹🇷",
  // CONMEBOL (6)
  ARG: "🇦🇷",
  BRA: "🇧🇷",
  COL: "🇨🇴",
  ECU: "🇪🇨",
  PAR: "🇵🇾",
  URU: "🇺🇾",
  // CONCACAF (6)
  CAN: "🇨🇦",
  CUW: "🇨🇼",
  HAI: "🇭🇹",
  MEX: "🇲🇽",
  PAN: "🇵🇦",
  USA: "🇺🇸",
  // AFC (8)
  AUS: "🇦🇺",
  IRN: "🇮🇷",
  JPN: "🇯🇵",
  JOR: "🇯🇴",
  QAT: "🇶🇦",
  KSA: "🇸🇦",
  KOR: "🇰🇷",
  UZB: "🇺🇿",
  // CAF (10)
  ALG: "🇩🇿",
  CPV: "🇨🇻",
  COD: "🇨🇩",
  EGY: "🇪🇬",
  GHA: "🇬🇭",
  CIV: "🇨🇮",
  MAR: "🇲🇦",
  SEN: "🇸🇳",
  RSA: "🇿🇦",
  TUN: "🇹🇳",
  // OFC + intercontinental playoff (2)
  NZL: "🇳🇿",
  IRQ: "🇮🇶",
}

const countryNames: Record<Locale, Record<string, string>> = {
  en: {
    // UEFA
    AUT: "Austria",
    BEL: "Belgium",
    BIH: "Bosnia & Herzegovina",
    CRO: "Croatia",
    CZE: "Czech Republic",
    ENG: "England",
    FRA: "France",
    GER: "Germany",
    NED: "Netherlands",
    NOR: "Norway",
    POR: "Portugal",
    SCO: "Scotland",
    ESP: "Spain",
    SWE: "Sweden",
    SUI: "Switzerland",
    TUR: "Turkey",
    // CONMEBOL
    ARG: "Argentina",
    BRA: "Brazil",
    COL: "Colombia",
    ECU: "Ecuador",
    PAR: "Paraguay",
    URU: "Uruguay",
    // CONCACAF
    CAN: "Canada",
    CUW: "Curaçao",
    HAI: "Haiti",
    MEX: "Mexico",
    PAN: "Panama",
    USA: "United States",
    // AFC
    AUS: "Australia",
    IRN: "Iran",
    JPN: "Japan",
    JOR: "Jordan",
    QAT: "Qatar",
    KSA: "Saudi Arabia",
    KOR: "South Korea",
    UZB: "Uzbekistan",
    // CAF
    ALG: "Algeria",
    CPV: "Cape Verde",
    COD: "DR Congo",
    EGY: "Egypt",
    GHA: "Ghana",
    CIV: "Ivory Coast",
    MAR: "Morocco",
    SEN: "Senegal",
    RSA: "South Africa",
    TUN: "Tunisia",
    // OFC + playoff
    NZL: "New Zealand",
    IRQ: "Iraq",
    // Sponsors
    CC: "Coca-Cola",
  },
  es: {
    // UEFA
    AUT: "Austria",
    BEL: "Bélgica",
    BIH: "Bosnia y Herzegovina",
    CRO: "Croacia",
    CZE: "República Checa",
    ENG: "Inglaterra",
    FRA: "Francia",
    GER: "Alemania",
    NED: "Países Bajos",
    NOR: "Noruega",
    POR: "Portugal",
    SCO: "Escocia",
    ESP: "España",
    SWE: "Suecia",
    SUI: "Suiza",
    TUR: "Turquía",
    // CONMEBOL
    ARG: "Argentina",
    BRA: "Brasil",
    COL: "Colombia",
    ECU: "Ecuador",
    PAR: "Paraguay",
    URU: "Uruguay",
    // CONCACAF
    CAN: "Canadá",
    CUW: "Curazao",
    HAI: "Haití",
    MEX: "México",
    PAN: "Panamá",
    USA: "Estados Unidos",
    // AFC
    AUS: "Australia",
    IRN: "Irán",
    JPN: "Japón",
    JOR: "Jordania",
    QAT: "Catar",
    KSA: "Arabia Saudita",
    KOR: "Corea del Sur",
    UZB: "Uzbekistán",
    // CAF
    ALG: "Argelia",
    CPV: "Cabo Verde",
    COD: "RD Congo",
    EGY: "Egipto",
    GHA: "Ghana",
    CIV: "Costa de Marfil",
    MAR: "Marruecos",
    SEN: "Senegal",
    RSA: "Sudáfrica",
    TUN: "Túnez",
    // OFC + playoff
    NZL: "Nueva Zelanda",
    IRQ: "Irak",
    // Sponsors
    CC: "Coca-Cola",
  },
}

// Maps FIFA 3-letter codes → ISO 3166-1 alpha-2 codes used by flag-icons
// England and Scotland use flag-icons subdivision codes (gb-eng / gb-sct)
const fifaToIso: Record<string, string> = {
  // UEFA
  AUT: "at", BEL: "be", BIH: "ba", CRO: "hr", CZE: "cz",
  ENG: "gb-eng", FRA: "fr", GER: "de", NED: "nl", NOR: "no",
  POR: "pt", SCO: "gb-sct", ESP: "es", SWE: "se", SUI: "ch", TUR: "tr",
  // CONMEBOL
  ARG: "ar", BRA: "br", COL: "co", ECU: "ec", PAR: "py", URU: "uy",
  // CONCACAF
  CAN: "ca", CUW: "cw", HAI: "ht", MEX: "mx", PAN: "pa", USA: "us",
  // AFC
  AUS: "au", IRN: "ir", JPN: "jp", JOR: "jo", QAT: "qa",
  KSA: "sa", KOR: "kr", UZB: "uz",
  // CAF
  ALG: "dz", CPV: "cv", COD: "cd", EGY: "eg", GHA: "gh",
  CIV: "ci", MAR: "ma", SEN: "sn", RSA: "za", TUN: "tn",
  // OFC + playoff
  NZL: "nz", IRQ: "iq",
}

export function isSectionCountry(code: string): boolean {
  return code.toUpperCase() in fifaToIso
}

export interface CountryInfo {
  name: string
  flag: string
  isoCode: string  // ISO alpha-2 code for flag-icons (e.g. "co", "gb-eng")
  label: string    // "Colombia 🇨🇴"
  pill: string     // "🇨🇴 COL"
}

export function useCountry() {
  const { locale } = useLocale()

  return (code: string): CountryInfo => {
    const upper = code.toUpperCase()
    const flag = countryFlags[upper] ?? ""
    const name = countryNames[locale][upper] ?? code
    const isoCode = fifaToIso[upper] ?? upper.toLowerCase()
    return {
      name,
      flag,
      isoCode,
      label: flag ? `${name} ${flag}` : name,
      pill: flag ? `${flag} ${upper}` : upper,
    }
  }
}
