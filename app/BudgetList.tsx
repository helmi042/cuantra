"use client";
type BudgetItem = { category: string; spent: number; budget: number };

export function BudgetList({ items }: { items: BudgetItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((b) => {
        const pct = b.budget ? Math.min(100, Math.round((b.spent / b.budget) * 100)) : 0;
        const status = b.budget === 0 ? "No budget" : pct < 70 ? "Safe" : pct < 100 ? "Watch" : "Over";
        const color = status === "Over" ? "bg-red-500" : status === "Watch" ? "bg-amber-400" : "bg-emerald-500";
        return (
          <div key={b.category} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex justify-between text-sm font-semibold">
              <span>{b.category}</span>
              <span>{status}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-white/70">
              Rp{b.spent.toLocaleString()} / Rp{b.budget.toLocaleString()} ({pct}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}
