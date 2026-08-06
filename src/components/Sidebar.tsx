import Icon from "./Icon";

const navItems = [
  { icon: "dashboard", label: "Dasbor", active: true },
  { icon: "receipt_long", label: "Transaksi" },
  { icon: "savings", label: "Tujuan Tabungan" },
  { icon: "account_balance_wallet", label: "Anggaran" },
];

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-surface px-unit-md py-unit-lg shadow-[4px_0_12px_rgba(30,58,138,0.08)] md:flex">
      <div className="mb-unit-xl px-unit-sm">
        <h1 className="text-headline-md font-headline-md font-bold text-primary">
          WealthFlow
        </h1>
        <p className="text-label-sm font-label-sm text-on-surface-variant">
          Penasihat Premium
        </p>
      </div>
      <ul className="flex-1 space-y-2">
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-label-md font-label-md transition-colors duration-200 ${
                item.active
                  ? "border-r-4 border-primary bg-primary-container/10 font-bold text-primary opacity-90"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <Icon icon={item.icon} />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-outline-variant/30 pt-unit-md">
        <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container">
          <Icon icon="add" />
          <span className="text-label-md font-label-md">Tambah Transaksi</span>
        </button>
        <ul className="space-y-1">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-primary"
            >
              <Icon icon="settings" />
              <span className="text-label-sm font-label-sm">Pengaturan</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-primary"
            >
              <Icon icon="help" />
              <span className="text-label-sm font-label-sm">Dukungan</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
