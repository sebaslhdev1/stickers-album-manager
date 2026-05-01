import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <div className='mx-auto w-full max-w-sm'>
      {/* Branding */}
      <div className='mb-8 flex flex-col items-center gap-3'>
        <Skeleton className='h-16 w-16 rounded-2xl' />
        <Skeleton className='h-6 w-32 rounded-full' />
        <Skeleton className='h-4 w-48 rounded-full' />
      </div>

      {/* Card */}
      <div className='rounded-2xl bg-white/95 p-6 shadow-2xl shadow-black/40'>
        {/* Tabs */}
        <Skeleton className='mb-6 h-11 w-full rounded-lg' />

        {/* Fields */}
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-12 rounded' />
            <Skeleton className='h-10 w-full rounded-lg' />
          </div>
          <Skeleton className='h-11 w-full rounded-lg' />
        </div>
      </div>
    </div>
  )
}
