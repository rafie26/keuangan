import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import Icon from "@/components/Icon";
import AccountForm from "@/components/AccountForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    email ??
    "Pengguna";
  const avatarUrl = user.user_metadata?.avatar_url ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background antialiased">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden md:ml-64">
        <TopNav
          user={{
            email,
            name,
            avatarUrl: avatarUrl ?? undefined,
          }}
        />
        <main className="flex-1 overflow-y-auto px-margin-mobile pb-unit-xl pt-24 md:px-margin-desktop">
          <div className="mx-auto max-w-3xl">
            <div className="mb-unit-lg">
              <h1 className="text-headline-lg font-headline-lg text-on-surface">
                Pengaturan
              </h1>
            </div>

            <div className="space-y-gutter">
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
                  Akun
                </h3>
                <div className="mb-unit-md flex items-center gap-4">
                  {avatarUrl ? (
                    <Image
                      className="h-16 w-16 rounded-full object-cover"
                      src={avatarUrl}
                      alt="Foto profil"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon icon="person" className="text-2xl" />
                    </span>
                  )}
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    Terhubung dengan akun Google Anda. Data tersimpan aman per
                    akun.
                  </p>
                </div>
                <AccountForm email={email} initialName={name} />
              </div>

              <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
                <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
                  Preferensi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body-sm font-body-sm font-medium text-on-surface">
                        Bahasa
                      </p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">
                        Bahasa antarmuka aplikasi
                      </p>
                    </div>
                    <select className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>Bahasa Indonesia</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4">
                    <div>
                      <p className="text-body-sm font-body-sm font-medium text-on-surface">
                        Notifikasi
                      </p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">
                        Kirim pemberitahuan aktivitas penting
                      </p>
                    </div>
                    <select className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm font-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>Aktif</option>
                      <option>Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
