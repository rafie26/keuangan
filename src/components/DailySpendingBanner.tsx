import Icon from "./Icon";
import { formatRupiah } from "@/lib/transactions";

export default function DailySpendingBanner({
  todaySpent,
  remainingBalance,
  remainingDays,
  dailyLimit,
}: {
  todaySpent: number;
  remainingBalance: number;
  remainingDays: number;
  dailyLimit: number;
}) {
  const exceeded = dailyLimit > 0 && todaySpent > dailyLimit;
  const outOfFunds = remainingBalance <= 0;

  return (
    <div
      role="alert"
      className={`mb-unit-lg flex items-center gap-3 rounded-xl border p-unit-md card-shadow ${
        exceeded || outOfFunds
          ? "border-error/30 bg-error-container/20"
          : "border-secondary/30 bg-secondary-container/10"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          exceeded || outOfFunds
            ? "bg-error-container text-error"
            : "bg-secondary-container text-secondary"
        }`}
      >
        <Icon icon={exceeded || outOfFunds ? "warning" : "savings"} />
      </div>
      <p className="text-body-sm font-body-sm text-on-surface">
        {exceeded ? (
          <>
            Hari ini melebihi batas{" "}
            <span className="font-semibold text-error">
              {formatRupiah(dailyLimit)}
            </span>
            /hari. Terpakai{" "}
            <span className="font-semibold text-error">
              {formatRupiah(todaySpent)}
            </span>
            .
          </>
        ) : outOfFunds ? (
          <>Saldo habis. Belanja maksimal Rp 0.</>
        ) : (
          <>
            Maksimal pengeluaran per hari{" "}
            <span className="font-semibold text-secondary">
              {formatRupiah(dailyLimit)}
            </span>{" "}
            ({formatRupiah(remainingBalance)} sisa / {remainingDays} hari).
          </>
        )}
      </p>
    </div>
  );
}
