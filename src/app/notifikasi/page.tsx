import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import NotificationList from "@/components/NotificationList";
import { getAvatarUrl } from "@/lib/user";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: notificationsData } = await supabase
    .from("notifications")
    .select("id, icon, title, body, is_read, created_at")
    .order("created_at", { ascending: false });

  const notifications = notificationsData ?? [];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background antialiased">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden md:ml-64">
        <TopNav
          user={{
            email: user.email,
            name:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              undefined,
            avatarUrl: getAvatarUrl(user.user_metadata),
          }}
        />
        <main className="flex-1 overflow-y-auto px-margin-mobile pb-unit-xl pt-24 md:px-margin-desktop">
          <div className="mx-auto max-w-3xl">
            <div className="mb-unit-lg">
              <h1 className="text-headline-lg font-headline-lg text-on-surface">
                Notifikasi
              </h1>
            </div>
            <NotificationList notifications={notifications} />
          </div>
        </main>
      </div>
    </div>
  );
}
