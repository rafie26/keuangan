"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

export default function AccountForm({
  email,
  initialName,
}: {
  email: string;
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-unit-md">
      <div>
        <label
          htmlFor="nama-akun"
          className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
        >
          Nama
        </label>
        <input
          id="nama-akun"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label
          htmlFor="email-akun"
          className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
        >
          Email
        </label>
        <input
          id="email-akun"
          type="email"
          value={email}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface-variant"
        />
      </div>

      {error && (
        <p className="text-label-sm font-label-sm text-error">{error}</p>
      )}
      {saved && (
        <p className="text-label-sm font-label-sm text-secondary">
          Perubahan berhasil disimpan.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
      >
        {pending && <Icon icon="hourglass_top" className="text-sm" />}
        Simpan Perubahan
      </button>
    </form>
  );
}
