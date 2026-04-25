import { api } from "@/lib/api"
import { setToken } from "@/lib/token"

export async function signUp(name: string, email: string): Promise<void> {
  await api.post("/signup_user", { name, email })
}

export async function signIn(email: string): Promise<void> {
  await api.post("/sign_in_user", { email })
}

export async function verifyOtp(email: string, token: string): Promise<void> {
  // TODO: adjust the response field name if the API returns something other than { token }
  const res = await api.post<{ access_token: string }>("/verify", {
    email,
    token,
  })
  console.log({ res })
  setToken(res.data.access_token)
}
