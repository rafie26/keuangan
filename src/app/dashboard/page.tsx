import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BalanceCards from "@/components/BalanceCards";
import CashflowChart from "@/components/CashflowChart";
import QuickActions from "@/components/QuickActions";
import RecentTransactions from "@/components/RecentTransactions";
import SavingsWidget from "@/components/SavingsWidget";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background antialiased">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden md:ml-64">
        <TopNav />
        <main className="flex-1 overflow-y-auto px-margin-mobile pb-unit-xl pt-24 md:px-margin-desktop">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-unit-lg flex items-center justify-between">
              <h1 className="text-headline-lg font-headline-lg text-on-surface">
                Dasbor
              </h1>
              <LogoutButton />
            </div>
            <BalanceCards />
            <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
              <div className="space-y-gutter lg:col-span-2">
                <CashflowChart />
                <QuickActions />
              </div>
              <div className="space-y-gutter">
                <RecentTransactions />
                <SavingsWidget />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
