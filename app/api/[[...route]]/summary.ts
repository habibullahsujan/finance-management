import { db } from "@/database/drizzle";
import { accounts, categories, transactions } from "@/database/schema";
import { calculatePercentageChange, fillMissingDate } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized!" }, 401);
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    async function fetchFinancialData(userId:string, startDate:Date, endDate:Date) {
      return await db
        .select({
          income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
          expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            ...(accountId ? [eq(transactions.accountId, accountId)] : []),
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        );
    }

    const [currentPeriod] = await fetchFinancialData(auth.userId, startDate, endDate) || [{}];
    const [lastPeriod] = await fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd) || [{}];

    const incomeChange = calculatePercentageChange(currentPeriod.income || 0, lastPeriod.income || 0);
    const expensesChange = calculatePercentageChange(currentPeriod.expenses || 0, lastPeriod.expenses || 0);
    const remainingChange = calculatePercentageChange(currentPeriod.remaining || 0, lastPeriod.remaining || 0);

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          ...(accountId ? [eq(transactions.accountId, accountId)] : []),
          eq(accounts.userId, auth.userId),
          lte(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

    const topCategory = category.slice(0, 3);
    const otherCategory = category.slice(3);
    const otherSum = otherCategory.reduce((sum, current) => sum + current.value, 0);
    const finalCategory = [...topCategory];
    if (otherCategory.length > 0) {
      finalCategory.push({
        name: "Other",
        value: otherSum,
      });
    }

    const activeDays = await db
      .select({
        date: transactions.date,
        income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
        expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount} ) ELSE 0 END)`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          ...(accountId ? [eq(transactions.accountId, accountId)] : []),
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const days = fillMissingDate(activeDays, startDate, endDate);

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining || 0,
        remainingChange,
        incomeAmount: currentPeriod.income || 0,
        incomeChange,
        expensesAmount: currentPeriod.expenses || 0,
        expensesChange,
        categories: finalCategory,
        days,
      },
    });
  }
);

export default app;
