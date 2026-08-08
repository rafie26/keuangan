import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import HeroBalance from "@/components/landing/HeroBalance";
import { createClient } from "@/lib/supabase/server";

const bars = [
  { label: "Jan", value: "31", delay: "0ms" },
  { label: "Feb", value: "77", delay: "80ms" },
  { label: "Mar", value: "54", delay: "160ms" },
  { label: "Apr", value: "92", delay: "240ms" },
  { label: "Mei", value: "68", delay: "320ms" },
  { label: "Jun", value: "100", delay: "400ms" },
  { label: "Jul", value: "84", delay: "480ms" },
  { label: "Agu", value: "58", delay: "560ms" },
];

const features = [
  {
    icon: "dashboard",
    title: "Dasbor ringkas",
    desc: "Saldo, pemasukan, dan pengeluaran bulanan dalam satu tampilan yang mudah dibaca.",
  },
  {
    icon: "receipt_long",
    title: "Transaksi terjaga rapi",
    desc: "Catat setiap pemasukan dan pengeluaran tanpa ribet, langsung terstruktur.",
  },
  {
    icon: "savings",
    title: "Tujuan tabungan",
    desc: "Tetapkan target dan pantau progres menuju tujuan keuangan Anda.",
  },
  {
    icon: "account_balance_wallet",
    title: "Anggaran bulanan",
    desc: "Kendalikan pengeluaran sesuai batas yang Anda tetapkan sendiri.",
  },
];

const steps = [
  {
    number: "01",
    title: "Daftar akun",
    desc: "Buat akun hanya dengan email dan kata sandi, atau langsung lewat Google.",
  },
  {
    number: "02",
    title: "Catat keuangan Anda",
    desc: "Masukkan saldo dan transaksi rutin Anda, semudah mengisi daftar belanja.",
  },
  {
    number: "03",
    title: "Pantau dan putuskan",
    desc: "Lihat tren, progres target, dan ambil langkah berikutnya dengan tenang.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <main className="flex flex-1 flex-col bg-background text-on-background antialiased">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-margin-mobile md:px-6">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Icon icon="account_balance" className="text-base" />
            </span>
            <span className="text-headline-sm font-headline-sm font-bold text-primary">
              Keuangan
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-lg px-3 py-2 text-label-md font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              Masuk
            </a>
            <a
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
            >
              Mulai Gratis
            </a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 flex select-none justify-end opacity-[0.05]">
          <p className="mr-6 font-tabular text-[13rem] leading-none text-primary md:text-[18rem]">
            1.9
          </p>
        </div>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-gutter px-margin-mobile md:grid-cols-2 md:px-6">
          <div className="animate-fade-up">
            <p className="mb-4 text-label-md font-label-md uppercase tracking-widest text-secondary">
              Penasihat keuangan pribadi Anda
            </p>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-on-surface md:text-5xl">
              Keuangan Anda,
              <br />
              jelas dalam{" "}
              <span className="text-primary">satu layar</span>.
            </h1>
            <p className="mt-5 max-w-md text-pretty text-body-lg font-body-lg text-on-surface-variant">
              Pantau saldo, pemasukan, dan pengeluaran setiap bulan. Satu
              dasbor ringkas untuk mengambil keputusan yang lebih tenang.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                Buka Dasbor
                <Icon icon="arrow_forward" className="text-base" />
              </a>
              <a
                href="#fitur"
                className="rounded-lg border border-outline-variant px-6 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          <div className="animate-fade-up relative mx-auto w-full max-w-md" style={{ animationDelay: "150ms" }}>
            <div className="rounded-2xl bg-surface-container-lowest p-unit-lg card-shadow">
              <p className="mb-1 text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">
                Total Saldo
              </p>
              <h2 className="text-3xl font-bold font-tabular tracking-tight text-on-surface md:text-4xl">
                Rp <HeroBalance value={1929750000} />
              </h2>
              <div className="mt-2 flex items-center gap-1 text-label-sm font-label-sm text-secondary">
                <Icon icon="trending_up" className="text-sm" />
                +2.4% bulan ini
              </div>
              <div className="mt-unit-lg flex h-36 items-end gap-2 border-b border-outline-variant/30">
                {bars.map((bar) => (
                  <div
                    key={bar.label}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <div
                      className={`animate-grow-bar w-full rounded-t-md ${
                        bar.value === "100"
                          ? "bg-primary"
                          : "bg-primary-container"
                      }`}
                      style={{ height: `${bar.value}%`, animationDelay: bar.delay }}
                    />
                    <span className="mt-2 text-[10px] text-on-surface-variant">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-float-slow absolute -right-4 -top-6 rounded-xl bg-secondary px-4 py-2 text-on-secondary card-shadow">
              <p className="text-[10px] font-medium uppercase tracking-wider">
                Tujuan tabungan
              </p>
              <p className="text-sm font-bold font-tabular">78% tercapai</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant/30 bg-surface-container-low/60">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-gutter px-margin-mobile py-unit-lg md:grid-cols-3 md:px-6">
          <div className="text-center md:text-left">
            <p className="text-number-xl font-number-xl font-tabular text-primary">
              Rp 1,9 M+
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              keuangan tercatat oleh pengguna
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-number-xl font-number-xl font-tabular text-primary">
              2.400+
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              pengguna aktif mengelola dana
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-number-xl font-number-xl font-tabular text-primary">
              98%
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              tujuan tabungan berhasil tercapai
            </p>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto w-full max-w-6xl px-margin-mobile py-unit-xl md:px-6 md:py-[96px]">
        <div className="mb-unit-lg max-w-2xl">
          <p className="mb-2 text-label-md font-label-md uppercase tracking-widest text-secondary">
            Fitur
          </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              Semua yang Anda butuhkan untuk menata keuangan
            </h2>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex h-full flex-col rounded-xl bg-surface-container-lowest p-unit-lg card-shadow transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="mb-unit-md inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/15 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <Icon icon={feature.icon} className="text-xl" />
              </span>
              <h3 className="mb-2 text-headline-sm font-headline-sm text-on-surface">
                {feature.title}
              </h3>
              <p className="mt-auto text-pretty text-body-sm font-body-sm text-on-surface-variant">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low/60 py-unit-xl md:py-[96px]">
        <div className="mx-auto w-full max-w-6xl px-margin-mobile md:px-6">
          <div className="mb-unit-lg max-w-2xl">
            <p className="mb-2 text-label-md font-label-md uppercase tracking-widest text-secondary">
              Cara mulai
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              Tiga langkah menuju keuangan yang rapi
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border-t-2 border-primary/20 pt-unit-md"
              >
                <p className="text-number-xl font-number-xl font-tabular text-primary/50">
                  {step.number}
                </p>
                <h3 className="mt-2 text-headline-sm font-headline-sm text-on-surface">
                  {step.title}
                </h3>
                <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-margin-mobile py-unit-xl md:px-6 md:py-[96px]">
        <div className="rounded-2xl bg-primary p-unit-lg md:p-unit-xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-on-primary md:text-4xl">
              Siap mengendalikan keuangan Anda?
            </h2>
            <p className="mt-3 text-body-lg font-body-lg text-on-primary/80">
              Gratis untuk dimulai. Tanpa kartu kredit, tanpa kerumitan.
            </p>
            <a
              href="/login"
              className="mt-unit-lg inline-flex items-center gap-2 rounded-lg bg-surface px-6 py-3 text-label-md font-label-md text-primary transition-colors hover:bg-surface-container-low"
            >
              Buka Dasbor
              <Icon icon="arrow_forward" className="text-base" />
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-outline-variant/30 bg-surface-container-low/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-margin-mobile py-unit-lg md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-on-primary">
            <Icon icon="account_balance" className="text-sm" />
          </span>
          <span className="text-label-md font-label-md font-bold text-primary">
            Keuangan
          </span>
        </div>
        <p className="text-label-sm font-label-sm text-on-surface-variant">
          Penasihat Premium &middot; &copy; 2026 Keuangan
        </p>
      </div>
    </footer>
    </>
  );
}
