"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import { formatRupiah } from "@/lib/transactions";

export interface Budget {
  id: string;
  category: string;
  icon: string;
  limit_amount: number;
  spent: number;
}

export default function BudgetList({ budgets }: { budgets: Budget[] }) {
  const router = useRouter();

  async function deleteBudget(id: string) {
    if (!window.confirm("Hapus anggaran kategori ini?")) return;
    const supabase = createClient();
    await supabase.from("budgets").delete().eq("id", id);
    router.refresh();
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest p-unit-xl card-shadow">
        <Icon icon="account_balance_wallet" className="text-3xl text-outline" />
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Belum ada anggaran. Tetapkan batas pengeluaran lewat form di samping.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
      {budgets.map((budget) => {
        const limit = Number(budget.limit_amount);
        const spent = budget.spent;
        const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
        const over = spent > limit;
        return (
          <div
            key={budget.id}
            className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/15 text-primary">
                  <Icon icon={budget.icon} className="text-xl" />
                </span>
                <div>
                  <p className="text-body-sm font-body-sm font-semibold text-on-surface">
                    {budget.category}
                  </p>
                  <p
                    className={`text-label-sm font-label-sm ${
                      over ? "text-error" : "text-on-surface-variant"
                    }`}
                  >
                    {over
                      ? `Melebihi batas ${formatRupiah(spent - limit)}`
                      : `Sisa ${formatRupiah(limit - spent)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteBudget(budget.id)}
                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error"
                aria-label="Hapus anggaran"
              >
                <Icon icon="delete" className="text-sm" />
              </button>
            </div>

            <div className="mt-unit-md flex items-end justify-between">
              <span
                className={`text-headline-md font-headline-md font-tabular ${
                  over ? "text-error" : "text-on-surface"
                }`}
              >
                {formatRupiah(spent)}
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                / {formatRupiah(limit)}
              </span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-surface-container">
              <div
                className={`h-2 rounded-full ${over ? "bg-error" : "bg-primary"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p
              className={`mt-2 text-right text-label-sm font-label-sm ${
                over ? "text-error" : "text-on-surface-variant"
              }`}
            >
              {percent}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
