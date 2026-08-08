import Icon from "./Icon";
import { formatRupiah } from "@/lib/transactions";

export default function DailySpendingBanner({
  todaySpent,
  dailyLimit,
}: {
  todaySpent: number;
  dailyLimit: number;
}) {
  if (dailyLimit <= 0 || todaySpent <= dailyLimit) return null;

  const over = todaySpent - dailyLimit;

  return (
    <div
      role="alert"
      className="mb-unit-lg flex items-start gap-3 rounded-xl border border-error/30 bg-error-container/20 p-unit-lg card-shadow"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-error">
        <Icon icon="warning" />
      </div>
      <div className="min-w-0">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Hari ini kamu melebihi total harian yang diperlukan
        </h3>
        <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
          Pengeluaran hari ini{" "}
          <span className="font-semibold text-error">
            {formatRupiah(todaySpent)}
          </span>{" "}
          sudah melebihi batas harian{" "}
          <span className="font-semibold text-on-surface">
            {formatRupiah(dailyLimit)}
          </span>{" "}
          (lebih{" "}
          <span className="font-semibold text-error">
            {formatRupiah(over)}
          </span>
          ). Pertimbangkan menahan pengeluaran non-esensial agar anggaran
          bulanan tetap aman.
        </p>
      </div>
    </div>
  );
}
