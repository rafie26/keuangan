import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import Icon from "@/components/Icon";
import { getAvatarUrl } from "@/lib/user";

const faqs = [
  {
    q: "Bagaimana cara menambah transaksi?",
    a: "Buka menu Transaksi di sidebar, pilih jenis Keluar atau Masuk, lengkapi nama, kategori, dan jumlah, lalu klik Simpan Transaksi.",
  },
  {
    q: "Bisa menambah kategori baru untuk transaksi?",
    a: "Bisa. Pada form transaksi, klik 'Kategori Baru', beri nama dan pilih ikon, lalu simpan. Kategori akan langsung tersedia di daftar.",
  },
  {
    q: "Bagaimana mengatur anggaran bulanan?",
    a: "Buka menu Anggaran, pilih kategori dan tentukan batas bulanannya. Pemasukan pengeluaran kategori tersebut akan dihitung otomatis dari transaksi Anda.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Ya. Data Anda disimpan terpisah per akun dan hanya dapat diakses setelah login dengan akun Anda sendiri.",
  },
  {
    q: "Bagaimana cara keluar dari akun?",
    a: "Klik foto profil di pojok kanan atas, lalu pilih Keluar.",
  },
];

export default async function SupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
                Dukungan
              </h1>
              <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
                Temukan jawaban untuk pertanyaan yang paling sering diajukan.
              </p>
            </div>

            <div className="mb-unit-lg rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
              <h3 className="mb-unit-md text-headline-sm font-headline-sm text-on-surface">
                Pertanyaan Umum
              </h3>
              <div className="divide-y divide-outline-variant/30">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group py-4 first:pt-0 last:pb-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                      <span className="text-body-sm font-body-sm font-semibold text-on-surface">
                        {faq.q}
                      </span>
                      <Icon
                        icon="expand_more"
                        className="text-on-surface-variant transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-primary p-unit-lg text-on-primary card-shadow">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-on-primary/15">
                  <Icon icon="support_agent" className="text-xl" />
                </span>
                <div>
                  <h3 className="text-headline-sm font-headline-sm">
                    Butuh bantuan lebih lanjut?
                  </h3>
                  <p className="mt-1 text-body-sm font-body-sm opacity-90">
                    Hubungi tim kami melalui email di bawah ini. Kami akan
                    membalas dalam 1x24 jam kerja.
                  </p>
                  <a
                    href="mailto:dukungan@keuangan.app"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface px-4 py-2 text-label-md font-label-md text-primary transition-colors hover:bg-surface-container-low"
                  >
                    <Icon icon="mail" className="text-sm" />
                    dukungan@keuangan.app
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
