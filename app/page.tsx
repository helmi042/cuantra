import Link from "next/link";
import { CashflowChart } from "@/app/CashflowChart";
import { BudgetList } from "@/app/BudgetList";
import { prisma } from "@/lib/prisma";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

const highlights = [
  "Dashboard ringkas harian dan bulanan",
  "Catat pemasukan, pengeluaran, dan transfer",
  "Kategori fleksibel dengan ikon",
  "Laporan bulanan dan breakdown kategori"
];

export default async function Page() {
  // TODO: ganti ke user dari session NextAuth setelah auth siap.
  const demoUser = await prisma.user.findFirst({
    where: { email: "demo@cuantra.test" },
    select: { id: true }
  });
  const userId = demoUser?.id;

  if (!userId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16 md:px-10">
        <header className="flex flex-col gap-3 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Cuantra</p>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Personal finance tracker yang simpel, aman, dan mobile-friendly.
          </h1>
          <p className="text-lg text-slate-600">
            Demo user belum ditemukan. Jalankan seed (npx prisma db seed) untuk mengisi data contoh.
          </p>
        </header>
      </main>
    );
  }

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const rangeStart = startOfMonth(subMonths(now, 11));

  // Ambil transaksi 12 bulan ke belakang untuk cashflow chart.
  const tx = await prisma.transaction.findMany({
    where: { userId, date: { gte: rangeStart, lte: monthEnd } },
    select: { amount: true, type: true, date: true }
  });

  const monthly = new Map<string, { income: number; expense: number }>();
  for (let i = 0; i < 12; i++) {
    const d = subMonths(monthEnd, i);
    const key = format(d, "MMM yy");
    monthly.set(key, { income: 0, expense: 0 });
  }
  tx.forEach((t) => {
    const key = format(t.date, "MMM yy");
    const entry = monthly.get(key);
    if (entry) {
      if (t.type === "INCOME") entry.income += t.amount;
      else entry.expense += t.amount;
    }
  });
  const cashflowData = Array.from(monthly.entries())
    .reverse()
    .map(([label, v]) => ({ label, ...v }));

  // Ambil spending kategori bulan ini dan gabungkan dengan budget.
  const spend = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: "EXPENSE",
      categoryId: { not: null },
      date: { gte: monthStart, lte: monthEnd }
    },
    _sum: { amount: true }
  });
  const budgets = await prisma.budget.findMany({
    where: { userId, year: now.getFullYear(), month: now.getMonth() + 1 },
    include: { category: true }
  });
  const budgetItems = budgets.map((b) => {
    const spent = spend.find((s) => s.categoryId === b.categoryId)?._sum.amount ?? 0;
    return { category: b.category.name, spent, budget: b.amount };
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16 md:px-10">
      <header className="flex flex-col gap-3 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Cuantra</p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Personal finance tracker yang simpel, aman, dan mobile-friendly.
        </h1>
        <p className="text-lg text-slate-600">
          Bangun disiplin finansial dengan dashboard rapi, transaksi cepat, dan laporan yang jelas. Semua data dipisah
          per pengguna.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <Link
            href="/auth/login"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500"
          >
            Mulai sekarang
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
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
            Fokus keamanan dan validasi
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-slate-100 bg-white/60 px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                ●
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cashflow 12 Bulan</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Income vs Expense</span>
          </div>
          <CashflowChart data={cashflowData} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900/90 p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Budget Bulan Ini</h3>
            {budgetItems.length === 0 ? (
              <p className="text-sm text-white/70">Belum ada budget. Tambahkan untuk memantau pengeluaran.</p>
            ) : (
              <BudgetList items={budgetItems} />
            )}
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Catatan</h3>
            <p className="text-sm text-slate-700">
              Data diambil real-time dari Prisma. Setelah integrasi auth, ganti userId statis di halaman ini dengan user
              dari session NextAuth untuk memisahkan data tiap pengguna.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
