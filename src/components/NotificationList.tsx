"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

export interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Kemarin";
  if (days < 7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(then);
}

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [items, setItems] = useState(notifications);
  const [pending, setPending] = useState(false);

  const unreadCount = items.filter((n) => !n.is_read).length;

  async function markAllRead() {
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
    setPending(false);
    if (error) return;
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  async function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-unit-xl text-center card-shadow">
        <Icon icon="notifications_off" className="text-3xl text-outline" />
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Belum ada notifikasi.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
      <div className="mb-unit-md flex items-center justify-between">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">
          Notifikasi
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={pending}
            className="text-label-sm font-label-sm text-primary hover:underline disabled:opacity-60"
          >
            {pending ? "..." : "Tandai semua dibaca"}
          </button>
        )}
      </div>

      <ul className="space-y-1">
        {items.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => !n.is_read && markRead(n.id)}
              className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                n.is_read ? "" : "bg-primary-container/10"
              }`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  n.is_read
                    ? "bg-surface-container text-on-surface-variant"
                    : "bg-primary-container/20 text-primary"
                }`}
              >
                <Icon icon={n.icon} className="text-base" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`text-body-sm font-body-sm ${
                      n.is_read ? "text-on-surface" : "font-semibold text-on-surface"
                    }`}
                  >
                    {n.title}
                  </span>
                  {!n.is_read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </span>
                <span className="block text-body-sm font-body-sm text-on-surface-variant">
                  {n.body}
                </span>
                <span className="mt-0.5 block text-label-sm font-label-sm text-on-surface-variant/70">
                  {formatRelativeTime(n.created_at)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
