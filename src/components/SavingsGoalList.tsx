"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import { formatRupiah } from "@/lib/transactions";
import { progressPercent, type SavingsGoal } from "@/lib/savings";

export default function SavingsGoalList({
  goals,
}: {
  goals: SavingsGoal[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<string | null>(null);

  async function addFund(goal: SavingsGoal) {
    const value = Number(amounts[goal.id]?.replace(/[^0-9]/g, "")) || 0;
    if (value <= 0) return;

    setPending(goal.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("savings_goals")
      .update({ saved_amount: Number(goal.saved_amount) + value })
      .eq("id", goal.id);

    setPending(null);
    if (error) return;

    setAdding(null);
    setAmounts((prev) => ({ ...prev, [goal.id]: "" }));
    router.refresh();
  }

  async function deleteGoal(id: string) {
    if (!window.confirm("Hapus tujuan tabungan ini?")) return;
    const supabase = createClient();
    await supabase.from("savings_goals").delete().eq("id", id);
    router.refresh();
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest p-unit-xl card-shadow">
        <Icon icon="savings" className="text-3xl text-outline" />
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Belum ada tujuan tabungan. Tambahkan lewat form di samping.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-gutter">
      {goals.map((goal) => {
        const percent = progressPercent(goal);
        const isAdding = adding === goal.id;
        const isPending = pending === goal.id;
        return (
          <div
            key={goal.id}
            className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/15 text-primary">
                  <Icon icon={goal.icon} className="text-xl" />
                </span>
                <div>
                  <p className="text-body-sm font-body-sm font-semibold text-on-surface">
                    {goal.name}
                  </p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    {percent}% tercapai
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error"
                aria-label="Hapus tujuan"
              >
                <Icon icon="delete" className="text-sm" />
              </button>
            </div>

            <div className="mt-unit-md flex items-end justify-between">
              <span className="text-headline-md font-headline-md font-tabular text-on-surface">
                {formatRupiah(Number(goal.saved_amount))}
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                / {formatRupiah(Number(goal.target_amount))}
              </span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-surface-container">
              <div
                className={`h-2 rounded-full ${percent >= 100 ? "bg-secondary" : "bg-primary"}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-unit-md">
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={amounts[goal.id] ?? ""}
                    onChange={(e) =>
                      setAmounts((prev) => ({
                        ...prev,
                        [goal.id]: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                    placeholder="Jumlah (Rp)"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => addFund(goal)}
                    disabled={isPending}
                    className="shrink-0 rounded-lg bg-primary px-4 py-2 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
                  >
                    {isPending ? "..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => setAdding(null)}
                    className="shrink-0 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(goal.id)}
                  className="flex items-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-label-md font-label-md text-primary transition-colors hover:bg-primary-container/10"
                >
                  <Icon icon="add" className="text-sm" />
                  Tambah Dana
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
