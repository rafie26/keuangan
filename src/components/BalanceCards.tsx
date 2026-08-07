import Icon from "./Icon";
import { formatRupiah } from "@/lib/transactions";

export default function BalanceCards({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
}: {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}) {
  return (
    <div className="mb-unit-lg grid grid-cols-1 gap-gutter md:grid-cols-3">
      <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
        <p className="mb-2 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
          Total Saldo
        </p>
        <h2
          className={`text-balance text-3xl font-bold leading-9 font-tabular md:text-number-xl md:leading-[48px] ${
            totalBalance < 0 ? "text-error" : "text-on-surface"
          }`}
        >
          {formatRupiah(totalBalance)}
        </h2>
        <p className="mt-3 text-label-sm font-label-sm text-on-surface-variant">
          Pemasukan dikurangi pengeluaran
        </p>
      </div>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 md:col-span-2">
        <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
              Pemasukan Bulanan
            </p>
            <Icon
              icon="arrow_downward"
              className="shrink-0 rounded-full bg-secondary-container/30 p-1 text-sm text-secondary"
            />
          </div>
          <h3 className="text-balance text-2xl font-bold leading-8 font-tabular text-on-surface md:text-headline-lg md:leading-10">
            {formatRupiah(monthlyIncome)}
          </h3>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
              Pengeluaran Bulanan
            </p>
            <Icon
              icon="arrow_upward"
              className="shrink-0 rounded-full bg-error-container/30 p-1 text-sm text-error"
            />
          </div>
          <h3 className="text-balance text-2xl font-bold leading-8 font-tabular text-on-surface md:text-headline-lg md:leading-10">
            {formatRupiah(monthlyExpense)}
          </h3>
        </div>
      </div>
    </div>
  );
}
