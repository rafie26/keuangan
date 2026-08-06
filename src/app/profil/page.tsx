import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import Icon from "@/components/Icon";
import { formatRupiah } from "@/lib/transactions";

export default async function ProfilePage() {
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
  const memberSince = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.created_at));

  const [{ count: txCount }, { count: goalCount }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("savings_goals")
      .select("*", { count: "exact", head: true }),
  ]);

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
                Profil
              </h1>
            </div>

            <div className="mb-unit-lg rounded-xl bg-surface-container-lowest p-unit-lg text-center card-shadow">
              {avatarUrl ? (
                <Image
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                  src={avatarUrl}
                  alt="Foto profil"
                  width={96}
                  height={96}
                />
              ) : (
                <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon icon="person" className="text-4xl" />
                </span>
              )}
              <h2 className="mt-4 text-headline-md font-headline-md text-on-surface">
                {name}
              </h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                {email}
              </p>
              <p className="mt-1 text-label-sm font-label-sm text-on-surface-variant">
                Bergabung sejak {memberSince}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg text-center card-shadow">
                <Icon
                  icon="receipt_long"
                  className="mx-auto mb-2 text-primary"
                />
                <p className="text-number-xl font-number-xl font-tabular text-on-surface">
                  {formatRupiah(txCount ?? 0)}
                </p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">
                  Transaksi tercatat
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg text-center card-shadow">
                <Icon icon="savings" className="mx-auto mb-2 text-primary" />
                <p className="text-number-xl font-number-xl font-tabular text-on-surface">
                  {goalCount ?? 0}
                </p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">
                  Tujuan tabungan
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-unit-lg text-center card-shadow">
                <Icon
                  icon="verified_user"
                  className="mx-auto mb-2 text-secondary"
                />
                <p className="text-number-xl font-number-xl font-tabular text-on-surface">
                  Aktif
                </p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">
                  Status akun
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
