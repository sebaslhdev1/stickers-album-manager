export type Locale = "en" | "es"

export interface Translation {
  auth: {
    signIn: string
    signUp: string
    email: string
    emailPlaceholder: string
    name: string
    namePlaceholder: string
    sendCode: string
    sendingCode: string
    createAccount: string
    creatingAccount: string
    verify: string
    verifying: string
    otpHint: string
    checkEmail: string
    codeSentTo: string
    back: string
    didntReceive: string
    resend: string
    accountCreated: string
    accountReadyDesc: string
    goToSignIn: string
    subtitle: string
    signInError: string
    signUpError: string
    verifyError: string
  }
  home: {
    myCollection: string
    title: string
    albumSingular: string
    albumsPlural: string
    subtitle: string
    noAlbums: string
    noAlbumsHint: string
    loadError: string
  }
  album: {
    backToAlbums: string
    albumLabel: string
    total: string
    gotten: string
    missing: string
    repeated: string
    all: string
    filters: string
    searchPlaceholder: string
    searchNoMatch: string
    details: string
    complete: string
    albumComplete: string
    discard: string
    save: string
    saving: string
    openAlbum: string
    totalStickers: string
    collected: string
    progress: string
    statsLoadError: string
  }
  stickers: {
    stickerDetails: string
    missing: string
    repeated: string
    noMissing: string
    noRepeated: string
    copy: string
    copied: string
  }
  navbar: {
    appTitle: string
    appSubtitle: string
    logOut: string
  }
  errors: {
    sessionExpiredTitle: string
    sessionExpiredDesc: string
    sessionExpiredButton: string
    serviceFailedTitle: string
    serviceFailedDesc: string
    serviceFailedButton: string
    serviceWaking: string
  }
}
