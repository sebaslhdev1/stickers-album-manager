export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center p-4 pt-8'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl' />
        <div className='absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-3xl' />
        <div className='absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl' />
      </div>
      <div className='relative z-10 w-full'>{children}</div>
    </div>
  )
}
