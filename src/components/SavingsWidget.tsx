export default function SavingsWidget() {
  return (
    <div className="rounded-xl bg-primary-container p-unit-lg text-on-primary-container card-shadow">
      <h3 className="mb-1 text-headline-sm font-headline-sm">Dana Darurat</h3>
      <p className="mb-6 text-label-sm font-label-sm opacity-80">
        Tujuan Utama
      </p>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-headline-md font-headline-md font-tabular">
          Rp 232.500.000
        </span>
        <span className="text-label-sm font-label-sm opacity-80">
          / Rp 310.000.000
        </span>
      </div>
      <div className="mb-2 h-2 w-full rounded-full bg-on-primary-container/20">
        <div
          className="h-2 rounded-full bg-primary-fixed"
          style={{ width: "75%" }}
        />
      </div>
      <p className="text-right text-label-sm font-label-sm opacity-80">
        75% Tercapai
      </p>
    </div>
  );
}
