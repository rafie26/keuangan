"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

export interface ProfileUser {
  email?: string | null;
  name?: string;
  avatarUrl?: string;
}

export default function ProfileMenu({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = user.name ?? user.email ?? "Pengguna";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-0.5 transition-all hover:bg-surface-container focus:ring-2 focus:ring-primary/20"
        aria-label="Profil"
      >
        {user.avatarUrl ? (
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src={user.avatarUrl}
            alt="Foto profil"
            width={32}
            height={32}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon icon="person" className="text-base" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-container-lowest p-2 card-shadow">
          <div className="border-b border-outline-variant/30 px-3 py-2">
            <p className="truncate text-body-sm font-body-sm font-semibold text-on-surface">
              {displayName}
            </p>
            {user.email && (
              <p className="truncate text-label-sm font-label-sm text-on-surface-variant">
                {user.email}
              </p>
            )}
          </div>
          <a
            href="/profil"
            onClick={() => setOpen(false)}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <Icon icon="person" className="text-sm" />
            Profil
          </a>
          <a
            href="/pengaturan"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            <Icon icon="settings" className="text-sm" />
            Pengaturan
          </a>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-outline-variant/30 px-3 py-2 pt-3 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error"
          >
            <Icon icon="logout" className="text-sm" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
