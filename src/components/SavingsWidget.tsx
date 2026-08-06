import Link from "next/link";
import { formatRupiah } from "@/lib/transactions";
import { progressPercent, type SavingsGoal } from "@/lib/savings";

export default function SavingsWidget({ goals }: { goals: SavingsGoal[] }) {
  const goal = goals[0];

  if (!goal) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-primary-container p-unit-lg text-center text-on-primary-container card-shadow">
        <p className="text-label-sm font-label-sm opacity-80">Tujuan Tabungan</p>
        <p className="text-body-sm font-body-sm opacity-90">
          Belum ada tujuan tabungan.
        </p>
        <Link
          href="/tabungan"
          className="rounded-lg bg-surface px-4 py-2 text-label-md font-label-md text-primary transition-colors hover:bg-surface-container-low"
        >
          Buat Tujuan
        </Link>
      </div>
    );
  }

  const percent = progressPercent(goal);

  return (
    <Link
      href="/tabungan"
      className="block rounded-xl bg-primary-container p-unit-lg text-on-primary-container card-shadow transition-transform hover:-translate-y-0.5"
    >
      <h3 className="mb-1 text-headline-sm font-headline-sm">{goal.name}</h3>
      <p className="mb-6 text-label-sm font-label-sm opacity-80">
        Tujuan Utama
      </p>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-headline-md font-headline-md font-tabular">
          {formatRupiah(Number(goal.saved_amount))}
        </span>
        <span className="text-label-sm font-label-sm opacity-80">
          / {formatRupiah(Number(goal.target_amount))}
        </span>
      </div>
      <div className="mb-2 h-2 w-full rounded-full bg-on-primary-container/20">
        <div
          className="h-2 rounded-full bg-primary-fixed"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-right text-label-sm font-label-sm opacity-80">
        {percent}% Tercapai
      </p>
    </Link>
  );
}
