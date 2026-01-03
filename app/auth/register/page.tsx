import Link from "next/link";

import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Daftar | CUANTRA"
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">CUANTRA</p>
        <h1 className="text-3xl font-bold text-slate-900">Buat akun baru</h1>
        <p className="text-sm text-slate-600">Pantau keuangan pribadi dengan dashboard CUANTRA.</p>
      </header>

      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <RegisterForm />
        <p className="pt-2 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Masuk
          </Link>
        </p>
      </section>
    </main>
  );
}
