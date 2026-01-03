import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Masuk | CUANTRA"
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">CUANTRA</p>
        <h1 className="text-3xl font-bold text-slate-900">Masuk ke akun</h1>
        <p className="text-sm text-slate-600">Gunakan email dan kata sandi yang sudah terdaftar.</p>
      </header>

      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <LoginForm />
        <p className="pt-2 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Daftar
          </Link>
        </p>
      </section>
    </main>
  );
}
