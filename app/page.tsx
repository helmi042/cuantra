import Link from "next/link";

const highlights = [
  "Dashboard ringkas harian & bulanan",
  "Catat pemasukan, pengeluaran, dan transfer",
  "Kategori fleksibel dengan ikon",
  "Laporan bulanan & breakdown kategori"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-16 md:px-10">
      <header className="flex flex-col gap-3 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">CUANTRA</p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Personal finance tracker yang simpel, aman, dan mobile-friendly.
        </h1>
        <p className="text-lg text-slate-600">
          Bangun disiplin finansial dengan dashboard rapi, transaksi cepat, dan laporan
          yang jelas. Semua data dipisah per pengguna.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <Link
            href="/auth/login"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Mulai sekarang
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:text-indigo-700"
          >
            Buat akun baru
          </Link>
        </div>
      </header>

      <section className="grid gap-4 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-100 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Ringkasan awal</p>
            <h2 className="text-2xl font-bold text-slate-900">Fitur inti CUANTRA</h2>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
            Fokus keamanan & validasi
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-slate-100 bg-white/60 px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
