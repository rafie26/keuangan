"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { timezoneOptions } from "@/lib/timezone";

export default function TimezoneForm({
  current,
}: {
  current: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    setSaved(false);
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { timezone: next },
    });
    setPending(false);
    if (error) return;
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-body-sm font-body-sm font-medium text-on-surface">
          Zona Waktu
        </p>
        <p className="text-label-sm font-label-sm text-on-surface-variant">
          {saved ? (
            <span className="text-secondary">Zona waktu diperbarui.</span>
          ) : (
            "Digunakan untuk menghitung batas pengeluaran harian"
          )}
        </p>
      </div>
      <select
        value={value}
        onChange={handleChange}
        disabled={pending}
        className="max-w-[16rem] rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
      >
        {timezoneOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
