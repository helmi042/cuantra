import bcrypt from "bcrypt";
import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@cuantra.test" },
    update: { name: "Demo User", passwordHash },
    create: {
      name: "Demo User",
      email: "demo@cuantra.test",
      passwordHash
    }
  });

  const cash = await prisma.account.upsert({
    where: { userId_name: { userId: user.id, name: "Cash" } },
    update: {},
    create: {
      name: "Cash",
      type: "CASH",
      userId: user.id
    }
  });

  const bank = await prisma.account.upsert({
    where: { userId_name: { userId: user.id, name: "BCA" } },
    update: {},
    create: {
      name: "BCA",
      type: "BANK",
      userId: user.id
    }
  });

  const incomeSalary = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: "Gaji", type: "INCOME" } },
    update: {},
    create: {
      name: "Gaji",
      type: "INCOME",
      icon: "💼",
      userId: user.id
    }
  });

  const incomeOther = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: "Bonus", type: "INCOME" } },
    update: {},
    create: {
      name: "Bonus",
      type: "INCOME",
      icon: "🎉",
      userId: user.id
    }
  });

  const expenseFood = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: "Makan", type: "EXPENSE" } },
    update: {},
    create: {
      name: "Makan",
      type: "EXPENSE",
      icon: "🍜",
      userId: user.id
    }
  });

  const expenseBills = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: "Tagihan", type: "EXPENSE" } },
    update: {},
    create: {
      name: "Tagihan",
      type: "EXPENSE",
      icon: "💡",
      userId: user.id
    }
  });

  const expenseTransport = await prisma.category.upsert({
    where: { userId_name_type: { userId: user.id, name: "Transport", type: "EXPENSE" } },
    update: {},
    create: {
      name: "Transport",
      type: "EXPENSE",
      icon: "🚌",
      userId: user.id
    }
  });

  const transactions = [
    {
      type: TransactionType.INCOME,
      accountId: cash.id,
      categoryId: incomeSalary.id,
      amount: 12000000,
      note: "Gaji bulanan",
      date: new Date("2024-11-01T09:00:00+07:00")
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 150000,
      note: "Makan siang",
      date: new Date("2024-11-02T12:30:00+07:00")
    },
    {
      type: TransactionType.EXPENSE,
      accountId: bank.id,
      categoryId: expenseBills.id,
      amount: 650000,
      note: "Tagihan listrik",
      date: new Date("2024-11-03T08:00:00+07:00")
    },
    {
      type: TransactionType.TRANSFER,
      fromAccountId: cash.id,
      toAccountId: bank.id,
      amount: 2000000,
      note: "Pindah ke tabungan",
      date: new Date("2024-11-04T10:00:00+07:00")
    },
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeOther.id,
      amount: 750000,
      note: "Bonus proyek",
      date: new Date("2024-11-05T15:00:00+07:00")
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseTransport.id,
      amount: 80000,
      note: "Ojol bandara",
      date: new Date("2024-11-06T07:30:00+07:00")
    }
  ];

  const balanceTracker = new Map<string, number>([
    [cash.id, 0],
    [bank.id, 0]
  ]);

  for (const tx of transactions) {
    if (tx.type === TransactionType.INCOME && tx.accountId) {
      balanceTracker.set(tx.accountId, (balanceTracker.get(tx.accountId) ?? 0) + tx.amount);
    }
    if (tx.type === TransactionType.EXPENSE && tx.accountId) {
      balanceTracker.set(tx.accountId, (balanceTracker.get(tx.accountId) ?? 0) - tx.amount);
    }
    if (tx.type === TransactionType.TRANSFER) {
      if (tx.fromAccountId) {
        balanceTracker.set(tx.fromAccountId, (balanceTracker.get(tx.fromAccountId) ?? 0) - tx.amount);
      }
      if (tx.toAccountId) {
        balanceTracker.set(tx.toAccountId, (balanceTracker.get(tx.toAccountId) ?? 0) + tx.amount);
      }
    }
  }

  await prisma.transaction.createMany({
    data: transactions.map((tx) => ({
      ...tx,
      userId: user.id,
      accountId: tx.accountId ?? null,
      categoryId: tx.categoryId ?? null,
      fromAccountId: tx.fromAccountId ?? null,
      toAccountId: tx.toAccountId ?? null
    }))
  });

  await Promise.all(
    [...balanceTracker.entries()].map(([id, balance]) =>
      prisma.account.update({
        where: { id },
        data: { balance }
      })
    )
  );

  console.log("Seed selesai. Email: demo@cuantra.test | Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
