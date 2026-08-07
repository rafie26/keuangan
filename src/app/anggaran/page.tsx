import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BudgetList from "@/components/BudgetList";
import BudgetForm from "@/components/BudgetForm";
import { formatRupiah } from "@/lib/transactions";
import { getAvatarUrl } from "@/lib/user";

export default async function BudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: budgetsData } = await supabase
    .from("budgets")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: txData } = await supabase
    .from("transactions")
    .select("type, category, amount")
    .eq("type", "expense")
    .limit(1000);

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, icon")
    .order("name", { ascending: true });

  const budgets = budgetsData ?? [];
  const transactions = txData ?? [];
  const categories = categoriesData ?? [];

  const spentByCategory = new Map<string, number>();
  for (const t of transactions) {
    spentByCategory.set(
      t.category,
      (spentByCategory.get(t.category) ?? 0) + Number(t.amount)
    );
  }

  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: spentByCategory.get(b.category) ?? 0,
  }));

  const totalLimit = budgets.reduce((s, b) => s + Number(b.limit_amount), 0);
  const totalSpent = budgets.reduce(
    (s, b) => s + (spentByCategory.get(b.category) ?? 0),
    0
  );

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
                Anggaran
              </h1>
            </div>

            <div className="mb-unit-lg grid grid-cols-1 gap-gutter md:grid-cols-3">
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Total Anggaran
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-on-surface">
                  {formatRupiah(totalLimit)}
                </h2>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Total Terpakai
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-error">
                  {formatRupiah(totalSpent)}
                </h2>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Sisa
                </p>
                <h2
                  className={`text-headline-lg font-headline-lg font-tabular ${
                    totalLimit - totalSpent < 0 ? "text-error" : "text-secondary"
                  }`}
                >
                  {formatRupiah(Math.max(0, totalLimit - totalSpent))}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BudgetList budgets={budgetsWithSpent} />
              </div>
              <div>
                <BudgetForm categories={categories} budgets={budgets} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
