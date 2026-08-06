"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import { formatAmountInput } from "@/lib/transactions";
import { goalIcons } from "@/lib/savings";

export default function SavingsGoalForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("savings");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const targetValue = Number(target.replace(/[^0-9]/g, ""));
    const savedValue = Number(saved.replace(/[^0-9]/g, "")) || 0;
    if (!name.trim() || !targetValue || targetValue <= 0) {
      setError("Nama dan jumlah target wajib diisi.");
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("savings_goals").insert({
      name: name.trim(),
      icon,
      target_amount: targetValue,
      saved_amount: savedValue,
    });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    setName("");
    setTarget("");
    setSaved("");
    router.refresh();
    setPending(false);
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
        Tujuan Baru
      </h3>

      <form onSubmit={handleSubmit} className="space-y-unit-md">
        <div>
          <label
            htmlFor="nama-tujuan"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Nama Tujuan
          </label>
          <input
            id="nama-tujuan"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Dana Darurat, Liburan"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
            Ikon
          </p>
          <div className="flex flex-wrap gap-2">
            {goalIcons.map((g) => (
              <button
                key={g.icon}
                type="button"
                title={g.label}
                onClick={() => setIcon(g.icon)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                  icon === g.icon
                    ? "border-primary bg-primary-container/15 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                }`}
              >
                <Icon icon={g.icon} className="text-lg" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="target"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Target (Rp)
          </label>
          <input
            id="target"
            type="text"
            inputMode="numeric"
            required
            value={formatAmountInput(target)}
            onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="0"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="tabungan-awal"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Tabungan Awal (Rp)
          </label>
          <input
            id="tabungan-awal"
            type="text"
            inputMode="numeric"
            value={formatAmountInput(saved)}
            onChange={(e) => setSaved(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="0"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {error && (
          <p className="text-label-sm font-label-sm text-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
        >
          {pending && <Icon icon="hourglass_top" className="text-sm" />}
          <Icon icon="add" className="text-sm" />
          Simpan Tujuan
        </button>
      </form>
    </div>
  );
}
