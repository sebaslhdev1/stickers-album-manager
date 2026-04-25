import { Trophy } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">Sticker Album</span>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-linear-to-b from-slate-100 via-white to-white">
        {children}
      </main>
    </div>
  );
}
