"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useT } from "@/i18n/use-t"
import { signIn, signUp, verifyOtp } from "@/services/auth"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

type View = "auth" | "verify" | "signup-success"

export default function LoginPage() {
  const router = useRouter()
  const t = useT()
  const [view, setView] = useState<View>("auth")
  const [pendingEmail, setPendingEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const email = new FormData(e.currentTarget).get("email") as string
    setIsLoading(true)
    try {
      await signIn(email)
      setPendingEmail(email)
      setView("verify")
    } catch {
      setError(t.auth.signInError)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const data = new FormData(e.currentTarget)
    const name = data.get("name") as string
    const email = data.get("email") as string
    setIsLoading(true)
    try {
      await signUp(name, email)
      setView("signup-success")
    } catch {
      setError(t.auth.signUpError)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerify() {
    setError("")
    setIsLoading(true)
    try {
      await verifyOtp(pendingEmail, otp)
      router.push("/")
    } catch {
      setError(t.auth.verifyError)
    } finally {
      setIsLoading(false)
    }
  }

  function handleBack() {
    setView("auth")
    setOtp("")
    setError("")
  }

  return (
    <div className='mx-auto w-full max-w-sm'>
      {/* Branding */}
      <div className='mb-8 text-center'>
        <Image
          src={process.env.NEXT_PUBLIC_LOGO_URL!}
          alt='KardKeeper logo'
          width={125}
          height={125}
          className='mx-auto mb-4 rounded-2xl shadow-lg'
        />
        <h1 className='text-2xl font-bold tracking-tight text-white'>
          {t.navbar.appTitle}
        </h1>
        <p className='mt-1 text-sm' style={{ color: "var(--brand-muted)" }}>
          {t.auth.subtitle}
        </p>
      </div>

      {view === "signup-success" ? (
        <Card className='border-0 bg-white/95 shadow-2xl shadow-black/40 backdrop-blur-sm'>
          <CardHeader className='items-center text-center'>
            <div
              className='mb-2 flex h-14 w-14 items-center justify-center rounded-full'
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--brand-green) 15%, transparent)",
              }}
            >
              <CheckCircle2
                className='h-7 w-7'
                style={{ color: "var(--brand-green)" }}
              />
            </div>
            <CardTitle className='text-lg'>{t.auth.accountCreated}</CardTitle>
            <CardDescription>{t.auth.accountReadyDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className='w-full py-5'
              style={{ backgroundColor: "var(--brand-orange)", color: "#fff" }}
              onClick={() => {
                setView("auth")
                setError("")
              }}
            >
              {t.auth.goToSignIn}
            </Button>
          </CardContent>
        </Card>
      ) : view === "auth" ? (
        <Card className='border-0 bg-white/95 shadow-2xl shadow-black/40 backdrop-blur-sm'>
          <CardContent className='pt-2'>
            <Tabs defaultValue='signin' className='w-full'>
              <TabsList className='mb-6 w-full'>
                <TabsTrigger value='signin' className='flex-1 py-4'>
                  {t.auth.signIn}
                </TabsTrigger>
                <TabsTrigger value='signup' className='flex-1 py-4'>
                  {t.auth.signUp}
                </TabsTrigger>
              </TabsList>

              {/* Sign In */}
              <TabsContent value='signin' className='space-y-4'>
                <form onSubmit={handleSignIn} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='signin-email'>{t.auth.email}</Label>
                    <Input
                      id='signin-email'
                      name='email'
                      type='email'
                      placeholder={t.auth.emailPlaceholder}
                      required
                      autoComplete='email'
                      autoFocus
                    />
                  </div>
                  {error && <p className='text-sm text-destructive'>{error}</p>}
                  <Button
                    type='submit'
                    className='w-full py-5'
                    style={{
                      backgroundColor: "var(--brand-orange)",
                      color: "#fff",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? t.auth.sendingCode : t.auth.sendCode}
                  </Button>
                </form>
                <p className='text-center text-xs text-muted-foreground'>
                  {t.auth.otpHint}
                </p>
              </TabsContent>

              {/* Sign Up */}
              <TabsContent value='signup' className='space-y-4'>
                <form onSubmit={handleSignUp} className='space-y-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='name'>{t.auth.name}</Label>
                    <Input
                      id='name'
                      name='name'
                      type='text'
                      placeholder={t.auth.namePlaceholder}
                      required
                      autoComplete='name'
                      autoFocus
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='signup-email'>{t.auth.email}</Label>
                    <Input
                      id='signup-email'
                      name='email'
                      type='email'
                      placeholder={t.auth.emailPlaceholder}
                      required
                      autoComplete='email'
                    />
                  </div>
                  {error && <p className='text-sm text-destructive'>{error}</p>}
                  <Button
                    type='submit'
                    className='w-full py-5'
                    style={{
                      backgroundColor: "var(--brand-orange)",
                      color: "#fff",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        /* Verify OTP */
        <Card className='border-0 bg-white/95 shadow-2xl shadow-black/40 backdrop-blur-sm'>
          <CardHeader>
            <button
              onClick={handleBack}
              className='mb-2 -ml-1 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              <ArrowLeft className='h-4 w-4' />
              {t.auth.back}
            </button>
            <CardTitle className='text-lg'>{t.auth.checkEmail}</CardTitle>
            <CardDescription>
              {t.auth.codeSentTo}{" "}
              <span className='font-medium text-foreground'>
                {pendingEmail}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleVerify()
              }}
              className='space-y-6'
            >
              <div className='flex justify-center'>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerify}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className='h-12 w-10 text-base' />
                    <InputOTPSlot index={1} className='h-12 w-10 text-base' />
                    <InputOTPSlot index={2} className='h-12 w-10 text-base' />
                    <InputOTPSlot index={3} className='h-12 w-10 text-base' />
                    <InputOTPSlot index={4} className='h-12 w-10 text-base' />
                    <InputOTPSlot index={5} className='h-12 w-10 text-base' />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className='text-center text-sm text-destructive'>{error}</p>
              )}

              <Button
                type='submit'
                className='w-full'
                style={{
                  backgroundColor: "var(--brand-orange)",
                  color: "#fff",
                }}
                disabled={otp.length < 6 || isLoading}
              >
                {isLoading ? t.auth.verifying : t.auth.verify}
              </Button>
            </form>

            <p className='text-center text-xs text-muted-foreground'>
              {t.auth.didntReceive}{" "}
              <button
                type='button'
                onClick={handleBack}
                className='underline underline-offset-2 transition-colors hover:text-foreground'
              >
                {t.auth.resend}
              </button>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
