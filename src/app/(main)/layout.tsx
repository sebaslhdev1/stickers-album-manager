import { Navbar } from "@/components/layout/navbar";
import { SessionExpiredModal } from "@/components/layout/session-expired-modal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-linear-to-b from-slate-100 via-white to-white">
        {children}
      </main>
      <SessionExpiredModal />
    </div>
  );
}
