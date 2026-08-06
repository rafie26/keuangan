import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { formatRupiah } from "@/lib/transactions";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const transactions = data ?? [];
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

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
            avatarUrl: user.user_metadata?.avatar_url ?? undefined,
          }}
        />
        <main className="flex-1 overflow-y-auto px-margin-mobile pb-unit-xl pt-24 md:px-margin-desktop">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-unit-lg">
              <h1 className="text-headline-lg font-headline-lg text-on-surface">
                Transaksi
              </h1>
            </div>

            <div className="mb-unit-lg grid grid-cols-1 gap-gutter md:grid-cols-2">
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Total Pemasukan
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-secondary">
                  {formatRupiah(totalIncome)}
                </h2>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Total Pengeluaran
                </p>
                <h2 className="text-headline-lg font-headline-lg font-tabular text-on-surface">
                  {formatRupiah(totalExpense)}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TransactionList transactions={transactions} />
              </div>
              <div>
                <TransactionForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
