import Link from "next/link";
import Icon from "./Icon";
import { formatRupiah, type Transaction } from "@/lib/transactions";

export default function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const items = transactions.slice(0, 5);

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Terbaru
        </h3>
        <Link
          href="/transaksi"
          className="text-label-sm font-label-sm text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-unit-lg text-center">
          <Icon icon="receipt_long" className="text-3xl text-outline" />
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Belum ada transaksi.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between border-b border-outline-variant/30 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center rounded-full p-2 ${
                    t.type === "income"
                      ? "bg-secondary-container/30 text-secondary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <Icon icon={t.icon} />
                </div>
                <div>
                  <p className="text-body-sm font-body-sm font-medium text-on-surface">
                    {t.name}
                  </p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    {t.category}
                  </p>
                </div>
              </div>
              <span
                className={`text-number-md font-number-md font-tabular ${
                  t.type === "income" ? "text-secondary" : "text-on-surface"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {formatRupiah(Number(t.amount))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
