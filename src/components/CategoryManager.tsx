"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";
import { categoryIconOptions } from "@/lib/transactions";

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
}

export default function CategoryManager({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("more_horiz");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(c: CategoryOption) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditIcon(c.icon);
    setError(null);
  }

  async function saveEdit() {
    if (!editingId) return;
    if (!editName.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }
    const oldName = categories.find((c) => c.id === editingId)?.name;
    const newName = editName.trim();

    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("categories")
      .update({ name: newName, icon: editIcon })
      .eq("id", editingId);
    if (err) {
      setError(err.message);
      setPending(false);
      return;
    }

    if (oldName && oldName !== newName) {
      await supabase
        .from("transactions")
        .update({ category: newName })
        .eq("category", oldName);
      await supabase
        .from("budgets")
        .update({ category: newName })
        .eq("category", oldName);
    }

    setPending(false);
    setEditingId(null);
    router.refresh();
  }

  async function deleteCategory(c: CategoryOption) {
    if (!window.confirm(`Hapus kategori "${c.name}"?`)) return;
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("categories")
      .delete()
      .eq("id", c.id);
    setPending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
        Kelola Kategori
      </h3>

      {error && (
        <p className="mb-3 text-label-sm font-label-sm text-error">{error}</p>
      )}

      {categories.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Icon icon="category" className="text-3xl text-outline" />
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Belum ada kategori. Tambahkan lewat form di atas.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map((c) =>
            editingId === c.id ? (
              <li
                key={c.id}
                className="rounded-lg border border-primary/40 bg-surface-container-low p-3"
              >
                <div className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={pending}
                    placeholder="Nama kategori"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  />
                  <button
                    onClick={saveEdit}
                    disabled={pending}
                    className="shrink-0 rounded-lg bg-primary px-3 py-2 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
                    aria-label="Simpan perubahan kategori"
                  >
                    {pending ? "..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    disabled={pending}
                    className="shrink-0 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-60"
                    aria-label="Batalkan perubahan"
                  >
                    Batal
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categoryIconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditIcon(icon)}
                      disabled={pending}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-60 ${
                        editIcon === icon
                          ? "border-primary bg-primary-container/15 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                      }`}
                    >
                      <Icon icon={icon} className="text-base" />
                    </button>
                  ))}
                </div>
              </li>
            ) : (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/15 text-primary">
                  <Icon icon={c.icon} className="text-base" />
                </span>
                <span className="min-w-0 flex-1 truncate text-body-sm font-body-sm text-on-surface">
                  {c.name}
                </span>
                <button
                  onClick={() => startEdit(c)}
                  disabled={pending}
                  className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:opacity-60"
                  aria-label={`Ubah kategori ${c.name}`}
                >
                  <Icon icon="edit" className="text-sm" />
                </button>
                <button
                  onClick={() => deleteCategory(c)}
                  disabled={pending}
                  className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error disabled:opacity-60"
                  aria-label={`Hapus kategori ${c.name}`}
                >
                  <Icon icon="delete" className="text-sm" />
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
