import { formatRupiah } from "@/lib/transactions";

export interface CashflowPoint {
  label: string;
  income: number;
  expense: number;
}

export default function CashflowChart({ data }: { data: CashflowPoint[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);

  return (
    <div className="flex h-[400px] flex-col rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Arus Kas
        </h3>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            Pemasukan
          </span>
          <span className="flex items-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
            <span className="h-2.5 w-2.5 rounded-full bg-error" />
            Pengeluaran
          </span>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="flex flex-1 items-end justify-between gap-2 border-b border-l border-outline-variant/30 px-4 pb-2 pt-8">
            {data.map((d) => {
              const incomeH = Math.round((d.income / max) * 100);
              const expenseH = Math.round((d.expense / max) * 100);
              return (
                <div
                  key={d.label}
                  className="flex h-full flex-1 items-end justify-center gap-1.5"
                >
                  <div
                    className="relative flex h-full w-3 items-end"
                    title={`Pemasukan: ${formatRupiah(d.income)}`}
                  >
                    <div
                      className="w-full rounded-t-sm bg-secondary transition-all"
                      style={{ height: `${incomeH}%` }}
                    />
                  </div>
                  <div
                    className="relative flex h-full w-3 items-end"
                    title={`Pengeluaran: ${formatRupiah(d.expense)}`}
                  >
                    <div
                      className="w-full rounded-t-sm bg-error transition-all"
                      style={{ height: `${expenseH}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between px-4 text-label-sm text-on-surface-variant">
            {data.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Belum ada data transaksi.
          </p>
        </div>
      )}
    </div>
  );
}
