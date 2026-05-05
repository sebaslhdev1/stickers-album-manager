import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { ServiceFailedModal } from "@/components/layout/service-failed-modal";
import { ServiceWakingBanner } from "@/components/layout/service-waking-banner";
import { SessionExpiredModal } from "@/components/layout/session-expired-modal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-linear-to-b from-slate-100 via-white to-white pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <ServiceFailedModal />
      <ServiceWakingBanner />
      <SessionExpiredModal />
    </div>
  );
}
