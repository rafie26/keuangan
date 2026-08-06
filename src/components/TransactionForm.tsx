"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import { categories, type TransactionType } from "@/lib/transactions";

export default function TransactionForm() {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>("expense");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const value = Number(amount.replace(/[^0-9]/g, ""));
    if (!name.trim() || !value || value <= 0) {
      setError("Nama dan jumlah transaksi wajib diisi.");
      setPending(false);
      return;
    }

    const selected = categories.find((c) => c.name === category);
    const supabase = createClient();
    const { error } = await supabase.from("transactions").insert({
      type,
      name: name.trim(),
      category,
      icon: selected?.icon ?? "more_horiz",
      amount: value,
    });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    setName("");
    setAmount("");
    router.refresh();
    setPending(false);
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
        Tambah Transaksi
      </h3>

      <form onSubmit={handleSubmit} className="space-y-unit-md">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-container p-1">
          {(
            [
              { value: "expense", label: "Keluar", icon: "arrow_upward" },
              { value: "income", label: "Masuk", icon: "arrow_downward" },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`flex items-center justify-center gap-2 rounded-md py-2 text-label-md font-label-md transition-colors ${
                type === t.value
                  ? t.value === "income"
                    ? "bg-secondary text-on-secondary"
                    : "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon icon={t.icon} className="text-sm" />
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="nama"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Nama
          </label>
          <input
            id="nama"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Gaji, Makan siang"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="kategori"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Kategori
          </label>
          <select
            id="kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="jumlah"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Jumlah (Rp)
          </label>
          <input
            id="jumlah"
            type="text"
            inputMode="numeric"
            required
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value.replace(/[^0-9]/g, ""))
            }
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
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
}
