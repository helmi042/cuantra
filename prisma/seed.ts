import bcrypt from "bcrypt";
import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

function dateInMonth(offset: number, day: number, hour = 9) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(day);
  d.setMonth(d.getMonth() - offset);
  return d;
}

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

  // Transaksi 6 bulan terakhir untuk mengisi chart.
  const transactions = [
    // Bulan 0 (sekarang)
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeSalary.id,
      amount: 12000000,
      note: "Gaji bulan ini",
      date: dateInMonth(0, 1)
    },
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeOther.id,
      amount: 1500000,
      note: "Bonus performa",
      date: dateInMonth(0, 10, 15)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 250000,
      note: "Makan keluarga",
      date: dateInMonth(0, 5, 12)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: bank.id,
      categoryId: expenseBills.id,
      amount: 700000,
      note: "Tagihan listrik",
      date: dateInMonth(0, 3, 8)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseTransport.id,
      amount: 120000,
      note: "BBM",
      date: dateInMonth(0, 8, 18)
    },
    // Bulan 1
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeSalary.id,
      amount: 11800000,
      note: "Gaji bulan -1",
      date: dateInMonth(1, 1)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 180000,
      note: "Makan siang",
      date: dateInMonth(1, 4, 12)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: bank.id,
      categoryId: expenseBills.id,
      amount: 690000,
      note: "Tagihan listrik",
      date: dateInMonth(1, 3, 8)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseTransport.id,
      amount: 90000,
      note: "Ojol",
      date: dateInMonth(1, 6, 7)
    },
    // Bulan 2
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeSalary.id,
      amount: 11800000,
      note: "Gaji bulan -2",
      date: dateInMonth(2, 1)
    },
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeOther.id,
      amount: 500000,
      note: "Bonus kecil",
      date: dateInMonth(2, 12, 14)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 220000,
      note: "Groceries",
      date: dateInMonth(2, 5, 17)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: bank.id,
      categoryId: expenseBills.id,
      amount: 710000,
      note: "Tagihan listrik",
      date: dateInMonth(2, 2, 9)
    },
    // Bulan 3
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeSalary.id,
      amount: 11500000,
      note: "Gaji bulan -3",
      date: dateInMonth(3, 1)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 190000,
      note: "Makan luar",
      date: dateInMonth(3, 6, 13)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: bank.id,
      categoryId: expenseBills.id,
      amount: 680000,
      note: "Tagihan listrik",
      date: dateInMonth(3, 3, 8)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseTransport.id,
      amount: 100000,
      note: "Transport kantor",
      date: dateInMonth(3, 9, 7)
    },
    // Bulan 4
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeSalary.id,
      amount: 11500000,
      note: "Gaji bulan -4",
      date: dateInMonth(4, 1)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 210000,
      note: "Belanja bahan",
      date: dateInMonth(4, 7, 18)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: bank.id,
      categoryId: expenseBills.id,
      amount: 700000,
      note: "Tagihan listrik",
      date: dateInMonth(4, 3, 8)
    },
    // Bulan 5
    {
      type: TransactionType.INCOME,
      accountId: bank.id,
      categoryId: incomeSalary.id,
      amount: 11400000,
      note: "Gaji bulan -5",
      date: dateInMonth(5, 1)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseFood.id,
      amount: 200000,
      note: "Makan luar",
      date: dateInMonth(5, 4, 12)
    },
    {
      type: TransactionType.EXPENSE,
      accountId: cash.id,
      categoryId: expenseTransport.id,
      amount: 95000,
      note: "BBM",
      date: dateInMonth(5, 10, 18)
    }
  ];

  // Budget bulan ini untuk mengisi kartu budget.
  const currentDate = new Date();
  await prisma.budget.createMany({
    data: [
      {
        userId: user.id,
        categoryId: expenseFood.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        amount: 2000000
      },
      {
        userId: user.id,
        categoryId: expenseBills.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        amount: 1200000
      },
      {
        userId: user.id,
        categoryId: expenseTransport.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        amount: 800000
      }
    ],
    skipDuplicates: true
  });

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
