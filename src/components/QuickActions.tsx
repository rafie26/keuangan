import Link from "next/link";
import Icon from "./Icon";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-gutter">
      <Link
        href="/transaksi"
        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-primary p-4 text-on-primary transition-colors card-shadow hover:bg-primary-container"
      >
        <Icon icon="add_circle" />
        <span className="text-label-md font-label-md">Tambah Transaksi</span>
      </Link>
      <Link
        href="/tabungan"
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-primary bg-surface-container-lowest p-4 text-primary transition-colors card-shadow hover:bg-surface-container-low"
      >
        <Icon icon="flag" />
        <span className="text-label-md font-label-md">Atur Tujuan</span>
      </Link>
    </div>
  );
}
