"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "./Icon";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
    >
      <Icon icon="logout" className="text-sm" />
      Keluar
    </button>
  );
}
