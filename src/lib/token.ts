const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;  // 7 days
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${ACCESS_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  document.cookie = `${REFRESH_TOKEN_KEY}=${token}; path=/; max-age=${REFRESH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
