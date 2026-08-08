import Icon from "./Icon";
import { formatRupiah } from "@/lib/transactions";

export default function DailySpendingBanner({
  todaySpent,
  remainingBalance,
  remainingDays,
  dailyLimit,
  timezone,
}: {
  todaySpent: number;
  remainingBalance: number;
  remainingDays: number;
  dailyLimit: number;
  timezone: string;
}) {
  const exceeded = dailyLimit > 0 && todaySpent > dailyLimit;
  const outOfFunds = remainingBalance <= 0;
  const label = timezone.split("/").pop() ?? timezone;

  return (
    <div
      role="alert"
      className={`mb-unit-lg flex items-start gap-3 rounded-xl border p-unit-lg card-shadow ${
        exceeded || outOfFunds
          ? "border-error/30 bg-error-container/20"
          : "border-secondary/30 bg-secondary-container/10"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          exceeded || outOfFunds
            ? "bg-error-container text-error"
            : "bg-secondary-container text-secondary"
        }`}
      >
        <Icon icon={exceeded || outOfFunds ? "warning" : "savings"} />
      </div>

      <div className="min-w-0">
        {exceeded ? (
          <h3 className="text-headline-sm font-headline-sm text-on-surface">
            Hari ini kamu melebihi total harian yang diperlukan
          </h3>
        ) : (
          <h3 className="text-headline-sm font-headline-sm text-on-surface">
            Batas pengeluaran harian
          </h3>
        )}

        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-body-sm font-body-sm text-on-surface-variant">
          <span>
            Sisa modal bulan ini:{" "}
            <span
              className={`font-semibold ${
                outOfFunds ? "text-error" : "text-on-surface"
              }`}
            >
              {formatRupiah(Math.max(0, remainingBalance))}
            </span>
          </span>
          <span>
            Sisa hari:{" "}
            <span className="font-semibold text-on-surface">
              {remainingDays} hari
            </span>
          </span>
          <span>
            Maksimal per hari:{" "}
            <span
              className={`font-semibold ${
                exceeded ? "text-error" : "text-secondary"
              }`}
            >
              {formatRupiah(Math.max(0, dailyLimit))}
            </span>
          </span>
          <span>
            Terpakai hari ini:{" "}
            <span
              className={`font-semibold ${
                exceeded ? "text-error" : "text-on-surface"
              }`}
            >
              {formatRupiah(todaySpent)}
            </span>
          </span>
        </div>

        {exceeded && (
          <p className="mt-2 text-body-sm font-body-sm text-error">
            Hari ini kamu sudah melebihi batas sebesar{" "}
            <span className="font-semibold">
              {formatRupiah(todaySpent - dailyLimit)}
            </span>
            . Pertimbangkan menahan pengeluaran non-esensial agar modal cukup
            sampai akhir bulan ({label}).
          </p>
        )}
        {outOfFunds && !exceeded && (
          <p className="mt-2 text-body-sm font-body-sm text-error">
            Saldo kamu sudah habis. Sisa pengeluaran bulan ini perlu ditutup
            pemasukan tambahan atau dikurangi hingga nol.
          </p>
        )}
        {!exceeded && !outOfFunds && (
          <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant">
            Batas ini dihitung dari sisa modal dibagi sisa hari bulan berjalan
            ({label}). Belanjakan maksimal{" "}
            <span className="font-semibold text-secondary">
              {formatRupiah(Math.max(0, dailyLimit))}
            </span>{" "}
            per hari agar saldo cukup sampai akhir bulan.
          </p>
        )}
      </div>
    </div>
  );
}
