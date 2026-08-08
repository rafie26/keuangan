import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BalanceCards from "@/components/BalanceCards";
import CashflowChart from "@/components/CashflowChart";
import DailySpendingBanner from "@/components/DailySpendingBanner";
import QuickActions from "@/components/QuickActions";
import RecentTransactions from "@/components/RecentTransactions";
import SavingsWidget from "@/components/SavingsWidget";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { getAvatarUrl } from "@/lib/user";
import {
  DEFAULT_TIMEZONE,
  remainingDaysTz,
  startOfDayInTz,
} from "@/lib/timezone";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: txData }, { data: goalsData }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("savings_goals")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const transactions = txData ?? [];
  const goals = goalsData ?? [];

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  let totalIncome = 0;
  let totalExpense = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  const chart = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(thisYear, thisMonth - (11 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d),
      income: 0,
      expense: 0,
    };
  });
  const chartByKey = new Map(chart.map((c) => [c.key, c]));

  for (const t of transactions) {
    const amount = Number(t.amount);
    const d = new Date(t.created_at);
    const isThisMonth =
      d.getFullYear() === thisYear && d.getMonth() === thisMonth;

    if (t.type === "income") {
      totalIncome += amount;
      if (isThisMonth) monthlyIncome += amount;
    } else {
      totalExpense += amount;
      if (isThisMonth) monthlyExpense += amount;
    }

    const cell = chartByKey.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (cell) {
      if (t.type === "income") cell.income += amount;
      else cell.expense += amount;
    }
  }

  const totalBalance = totalIncome - totalExpense;

  const timeZone =
    (typeof user.user_metadata?.timezone === "string" &&
      user.user_metadata.timezone) ||
    DEFAULT_TIMEZONE;

  const remainingDays = remainingDaysTz(now, timeZone);
  const startOfToday = startOfDayInTz(now, timeZone);

  let todaySpent = 0;
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    if (new Date(t.created_at) >= startOfToday) todaySpent += Number(t.amount);
  }

  const dailyLimit = remainingDays > 0 ? totalBalance / remainingDays : 0;

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
                Dasbor
              </h1>
            </div>
            <DailySpendingBanner
              todaySpent={todaySpent}
              remainingBalance={totalBalance}
              remainingDays={remainingDays}
              dailyLimit={dailyLimit}
              timezone={timeZone}
            />
            <BalanceCards
              totalBalance={totalBalance}
              monthlyIncome={monthlyIncome}
              monthlyExpense={monthlyExpense}
            />
            <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
              <div className="space-y-gutter lg:col-span-2">
                <CashflowChart
                  data={chart.map(({ label, income, expense }) => ({
                    label,
                    income,
                    expense,
                  }))}
                />
                <QuickActions />
              </div>
              <div className="space-y-gutter">
                <RecentTransactions transactions={transactions} />
                <SavingsWidget goals={goals} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
