"use client";

import { useState } from "react";
import Icon from "./Icon";
import {
  formatDate,
  formatRupiah,
  type Transaction,
  type TransactionType,
} from "@/lib/transactions";

type Filter = "all" | TransactionType;

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const tabs: { value: Filter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "income", label: "Masuk" },
    { value: "expense", label: "Keluar" },
  ];

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-unit-md flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Riwayat Transaksi
        </h3>
        <div className="flex gap-1 rounded-lg bg-surface-container p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`rounded-md px-3 py-1.5 text-label-sm font-label-sm transition-colors ${
                filter === tab.value
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-unit-xl text-center">
          <Icon
            icon="receipt_long"
            className="text-3xl text-outline"
          />
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Belum ada transaksi. Tambahkan lewat form di samping.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between border-b border-outline-variant/30 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center rounded-full p-2 ${
                    t.type === "income"
                      ? "bg-secondary-container/30 text-secondary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <Icon icon={t.icon} />
                </div>
                <div>
                  <p className="text-body-sm font-body-sm font-medium text-on-surface">
                    {t.name}
                  </p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    {t.category} &middot; {formatDate(t.created_at)}
                  </p>
                </div>
              </div>
              <span
                className={`text-number-md font-number-md font-tabular ${
                  t.type === "income"
                    ? "text-secondary"
                    : "text-on-surface"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {formatRupiah(Number(t.amount))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
