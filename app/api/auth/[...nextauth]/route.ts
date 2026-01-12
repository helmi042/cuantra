import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { Prisma } from "@lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { authOptions } from "@/lib/auth";
import { CategoryType } from "@prisma/client/wasm";
import { start } from "repl";
import { prisma } from "@/lib/prisma";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
export async function GET(req: Request) {
    const userId ="1"; 
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const rangeStart = startOfMonth(subMonths(now, 11));

      const txByMonth = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId, date: { gte: rangeStart, lte: monthEnd } },
    _sum: { amount: true },
    // Prisma tidak group by bulan langsung, bisa raw atau olah di JS.
  });    
   const txRaw = await prisma.transaction.findMany({
    where: { userId, date: { gte: rangeStart, lte: monthEnd } },
    select: { amount: true, type: true, date: true },
  });

  const categorySpend = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE", date: { gte: monthStart, lte: monthEnd } },
    _sum: { amount: true },
  });

  const budgets = await prisma.budget.findMany({
    where: { userId, year: now.getFullYear(), month: now.getMonth() + 1 },
    include: { category: true },
  });
  return NextResponse.json({txRaw, categorySpend, budgets});
}