# KardKeeper — Sticker Album Manager

A web app to manage any sticker album collection. Track which stickers you have, which are missing, and which are repeated — organized by section.

## Features

- **Album & sticker tracking** — mark stickers as collected, see missing and repeated counts per section
- **Sections** — organized by category with flags (via `flag-icons`) and localized names when applicable
- **Real-time counters** — section progress updates instantly on every add/remove, before saving
- **Collapsible sections** — open/close individual sections or collapse/expand all at once
- **Section search** — filter sections by name with debounced input
- **Sticker details panel** — view missing and repeated stickers with a one-click copy list
- **Authentication** — email OTP login with access + refresh token handling and auto token refresh on expiry
- **Internationalization** — English and Spanish, auto-detected from the browser, switchable from the navbar
- **Confetti** — fires when you complete the album 🎉

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [Axios](https://axios-http.com/) with request/response interceptors
- [flag-icons](https://flagicons.lipis.dev/) for SVG country flags
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Environment variables

Create a `.env.local` file at the project root:

```bash
API_URL=https://your-backend-url.com
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

```bash
npm run build   # production build
npm run start   # start production server
npm run lint    # run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/       # OTP login flow
│   └── (main)/
│       ├── page.tsx        # album list
│       └── album/[id]/     # album detail & sticker grid
├── components/
│   ├── albums/             # album card & stats panel
│   ├── layout/             # navbar, modals, banners
│   ├── stickers/           # sticker card, section, detail panel
│   └── ui/                 # shadcn base components
├── hooks/
│   └── use-debounce.ts
├── i18n/
│   ├── countries.ts        # section metadata — flags, names, FIFA→ISO mapping
│   ├── locales/            # en.ts / es.ts translation files
│   ├── provider.tsx        # locale context (useSyncExternalStore)
│   ├── types.ts            # Translation interface
│   └── use-t.ts            # useT() hook
├── lib/
│   ├── api.ts              # Axios instance with auth & retry interceptors
│   └── token.ts            # access + refresh token storage (localStorage + cookie)
└── services/
    ├── albums.ts
    ├── auth.ts             # signIn, signUp, verifyOtp, logout
    └── stickers.ts
```

## Authentication Flow

1. User enters their email → receives a 6-digit OTP
2. OTP is verified → server returns `access_token` + `refresh_token`
3. Both tokens are stored in `localStorage` and cookies
4. Every API request includes `Authorization: Bearer <access_token>`
5. On 401 → the interceptor automatically calls `/refresh` and retries the original request
6. If refresh fails → session is cleared and the user is redirected to login
