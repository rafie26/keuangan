const bars = [
  { label: "Jan", height: "h-1/3", color: "bg-primary", value: "Rp 31Jt" },
  { label: "Feb", height: "h-2/3", color: "bg-secondary", value: "Rp 77Jt" },
  { label: "Mar", height: "h-1/2", color: "bg-primary", value: "Rp 46Jt" },
  { label: "Apr", height: "h-3/4", color: "bg-secondary", value: "Rp 93Jt" },
  { label: "Mei", height: "h-1/4", color: "bg-primary", value: "Rp 23Jt" },
  { label: "Jun", height: "h-5/6", color: "bg-secondary", value: "Rp 108Jt" },
  { label: "Jul", height: "h-2/5", color: "bg-primary", value: "Rp 38Jt" },
];

export default function CashflowChart() {
  return (
    <div className="flex h-[400px] flex-col rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Arus Kas
        </h3>
        <select className="rounded-md border border-outline-variant bg-surface-container px-2 py-1 text-body-sm text-on-surface-variant">
          <option>Tahun Ini</option>
          <option>Tahun Lalu</option>
        </select>
      </div>
      <div className="relative flex flex-1 items-end justify-between border-b border-l border-outline-variant/30 px-4 pb-2 pt-8">
        {bars.map((bar) => (
          <div
            key={bar.label}
            className={`group relative w-8 rounded-t-sm ${bar.color} ${bar.height}`}
          >
            <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-inverse-surface px-2 py-1 text-xs text-inverse-on-surface group-hover:block">
              {bar.value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between px-4 text-label-sm text-on-surface-variant">
        {bars.map((bar) => (
          <span key={bar.label}>{bar.label}</span>
        ))}
      </div>
    </div>
  );
}
