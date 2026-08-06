import Icon from "./Icon";

const transactions = [
  {
    name: "Whole Foods",
    category: "Belanjaan",
    icon: "shopping_cart",
    amount: "-Rp 1.867.750",
    income: false,
  },
  {
    name: "Sewa",
    category: "Perumahan",
    icon: "home",
    amount: "-Rp 23.250.000",
    income: false,
  },
  {
    name: "Gaji",
    category: "Pendapatan",
    icon: "work",
    amount: "+Rp 63.937.500",
    income: true,
  },
  {
    name: "Tagihan Listrik",
    category: "Utilitas",
    icon: "bolt",
    amount: "-Rp 1.320.600",
    income: false,
  },
];

export default function RecentTransactions() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Terbaru
        </h3>
        <a
          href="#"
          className="text-label-sm font-label-sm text-primary hover:underline"
        >
          Lihat Semua
        </a>
      </div>
      <ul className="space-y-4">
        {transactions.map((t) => (
          <li
            key={t.name}
            className="flex items-center justify-between border-b border-outline-variant/30 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center rounded-full p-2 ${
                  t.income
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
                t.income ? "text-secondary" : "text-on-surface"
              }`}
            >
              {t.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
