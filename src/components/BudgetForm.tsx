"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import type { CategoryOption } from "./TransactionForm";

export default function BudgetForm({
  categories,
  budgets,
}: {
  categories: CategoryOption[];
  budgets: { id: string; category: string; icon: string }[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState(categories[0]?.name ?? "");
  const [limit, setLimit] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const value = Number(limit.replace(/[^0-9]/g, ""));
    if (!category || !value || value <= 0) {
      setError("Pilih kategori dan isi batas anggaran.");
      setPending(false);
      return;
    }

    if (budgets.some((b) => b.category === category)) {
      setError("Anggaran untuk kategori ini sudah ada.");
      setPending(false);
      return;
    }

    const selected = categories.find((c) => c.name === category);
    const supabase = createClient();
    const { error } = await supabase.from("budgets").insert({
      category,
      icon: selected?.icon ?? "more_horiz",
      limit_amount: value,
    });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    setLimit("");
    router.refresh();
    setPending(false);
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
        Tambah Anggaran
      </h3>

      <form onSubmit={handleSubmit} className="space-y-unit-md">
        <div>
          <label
            htmlFor="kategori-anggaran"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Kategori
          </label>
          <select
            id="kategori-anggaran"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="batas"
            className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
          >
            Batas Bulanan (Rp)
          </label>
          <input
            id="batas"
            type="text"
            inputMode="numeric"
            required
            value={limit}
            onChange={(e) => setLimit(e.target.value.replace(/[^0-9]/g, ""))}
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
          Simpan Anggaran
        </button>
      </form>
    </div>
  );
}
