import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import SavingsGoalList from "@/components/SavingsGoalList";
import SavingsGoalForm from "@/components/SavingsGoalForm";
import { formatRupiah } from "@/lib/transactions";
import { getAvatarUrl } from "@/lib/user";

export default async function SavingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("savings_goals")
    .select("*")
    .order("created_at", { ascending: false });

  const goals = data ?? [];
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount), 0);
  const overallPercent =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background antialiased">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden md:ml-64">
        <TopNav
          user={{
            email: user.email,
            name:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              undefined,
            avatarUrl: getAvatarUrl(user.user_metadata),
          }}
        />
        <main className="flex-1 overflow-y-auto px-margin-mobile pb-unit-xl pt-24 md:px-margin-desktop">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-unit-lg">
              <h1 className="text-headline-lg font-headline-lg text-on-surface">
                Tujuan Tabungan
              </h1>
            </div>

            <div className="mb-unit-lg grid grid-cols-1 gap-gutter md:grid-cols-3">
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Total Target
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-on-surface">
                  {formatRupiah(totalTarget)}
                </h2>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Total Tabungan
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-secondary">
                  {formatRupiah(totalSaved)}
                </h2>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Progres Keseluruhan
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-primary">
                  {overallPercent}%
                </h2>
                <div className="mt-3 h-2 w-full rounded-full bg-surface-container">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SavingsGoalList goals={goals} />
              </div>
              <div>
                <SavingsGoalForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
