import { api } from "@/lib/api"
import { getToken, removeRefreshToken, removeToken, removeUserName, setRefreshToken, setToken, setUserName } from "@/lib/token"

export async function signUp(name: string, email: string): Promise<void> {
  await api.post("/signup_user", { name, email })
}

export async function signIn(email: string): Promise<void> {
  await api.post("/sign_in_user", { email })
}

export async function logout(): Promise<void> {
  try {
    await api.post("/logout", { refresh_token: getToken() })
  } catch {
    // server-side logout failed — tokens are still cleared locally below
  } finally {
    removeToken()
    removeRefreshToken()
    removeUserName()
  }
}

export async function verifyOtp(email: string, token: string): Promise<void> {
  const res = await api.post<{ access_token: string; refresh_token: string; name: string }>("/verify", {
    email,
    token,
  })
  setToken(res.data.access_token)
  setRefreshToken(res.data.refresh_token)
  setUserName(res.data.name)
}
