import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.kardkeeper.app",
  appName: "KardKeeper",
  webDir: "public",
  server: {
    url: "https://kard-keeper.vercel.app",
    cleartext: false,
  },
}

export default config
