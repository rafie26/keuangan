"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/Icon";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        setPending(false);
        return;
      }
      setMessage(
        "Akun berhasil dibuat. Periksa email Anda untuk konfirmasi sebelum masuk."
      );
      setMode("login");
      setPending(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
    if (error) {
      setError(error.message);
    }
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-margin-mobile py-unit-xl">
      <div className="w-full max-w-md">
        <div className="mb-unit-lg text-center">
          <h1 className="text-headline-lg font-headline-lg font-bold text-primary">
            Keuangan
          </h1>
          <p className="text-label-sm font-label-sm text-on-surface-variant">
            {mode === "login"
              ? "Masuk untuk mengakses dasbor keuangan Anda"
              : "Buat akun baru untuk mulai mengelola keuangan"}
          </p>
        </div>

        <div className="rounded-xl bg-surface-container-lowest p-unit-lg card-shadow">
          {error && (
            <div className="mb-unit-md rounded-lg bg-error-container px-4 py-3 text-label-sm font-label-sm text-on-error-container">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-unit-md rounded-lg bg-secondary-container/30 px-4 py-3 text-label-sm font-label-sm text-on-secondary-container">
              {message}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-unit-md">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-label-sm font-label-sm text-on-surface-variant"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
            >
              {pending && <Icon icon="hourglass_top" className="text-sm" />}
              {mode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>

          <div className="my-unit-md flex items-center gap-3">
            <span className="h-px flex-1 bg-outline-variant/60" />
            <span className="text-label-sm font-label-sm text-on-surface-variant">
              atau
            </span>
            <span className="h-px flex-1 bg-outline-variant/60" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="mt-unit-lg text-center text-label-sm font-label-sm text-on-surface-variant">
            {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
                setMessage(null);
              }}
              className="font-label-md text-primary hover:underline"
            >
              {mode === "login" ? "Daftar di sini" : "Masuk"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
