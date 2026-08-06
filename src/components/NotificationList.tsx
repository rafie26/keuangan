"use client";

import { useState } from "react";
import Icon from "./Icon";

interface Notification {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const initial: Notification[] = [
  {
    id: 1,
    icon: "receipt_long",
    title: "Transaksi tercatat",
    body: "Gaji telah dicatat ke pendapatan Anda.",
    time: "Baru saja",
    unread: true,
  },
  {
    id: 2,
    icon: "savings",
    title: "Tujuan tabungan",
    body: "Dana Darurat telah mencapai 75% dari target.",
    time: "2 jam lalu",
    unread: true,
  },
  {
    id: 3,
    icon: "account_balance_wallet",
    title: "Anggaran mendekati batas",
    body: "Belanjaan sudah terpakai 85% dari batas bulan ini.",
    time: "Kemarin",
    unread: true,
  },
  {
    id: 4,
    icon: "check_circle",
    title: "Selamat datang",
    body: "Akun Anda berhasil terhubung. Mulai catat keuangan Anda.",
    time: "3 hari lalu",
    unread: false,
  },
];

export default function NotificationList() {
  const [items, setItems] = useState(initial);

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-unit-md flex items-center justify-between">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Notifikasi
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={() =>
              setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
            }
            className="text-label-sm font-label-sm text-primary hover:underline"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      <ul className="space-y-1">
        {items.map((n) => (
          <li
            key={n.id}
            className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
              n.unread ? "bg-primary-container/10" : ""
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                n.unread
                  ? "bg-primary-container/20 text-primary"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              <Icon icon={n.icon} className="text-base" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-body-sm font-body-sm ${
                    n.unread
                      ? "font-semibold text-on-surface"
                      : "text-on-surface"
                  }`}
                >
                  {n.title}
                </p>
                {n.unread && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                {n.body}
              </p>
              <p className="mt-0.5 text-label-sm font-label-sm text-on-surface-variant/70">
                {n.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
