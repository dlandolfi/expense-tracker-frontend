"use client";

import { useState } from "react";

import AddExpenseForm from "@/components/AddExpenseForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBalance } from "@/hooks/useBalance";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/types";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [year, setYear] = useState(currentYear);
  const [monthNum, setMonthNum] = useState(currentMonth);

  const month = `${year}-${String(monthNum).padStart(2, "0")}`;

  const { data: expenses, isLoading: expensesLoading } = useExpenses(month);
  const { data: balance, isLoading: balanceLoading } = useBalance(month);
  const { mutate: deleteExpense } = useDeleteExpense();

  if (expensesLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-lg mx-auto p-4 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center py-4 mb-6 gap-2">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <AddExpenseForm />
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 mb-6">
        <Select
          value={monthNum.toString()}
          onValueChange={(val) => setMonthNum(Number(val))}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {new Date(2000, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={year.toString()}
          onValueChange={(val) => setYear(Number(val))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Monthly Summary
        </h2>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Spent</span>
          <span>${balance?.grandTotal?.toFixed(2) ?? "0.00"}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Fair Share Each</span>
          <span>${balance?.fairShare?.toFixed(2) ?? "0.00"}</span>
        </div>
        {balance?.balance?.map((entry) => (
          <div
            key={entry.userId}
            className={`flex justify-between text-sm font-medium ${
              entry.status === "owed" ? "text-[#98971a]" : "text-[#cc241d]"
            }`}
          >
            <span>
              User {entry.userId} {entry.status}
            </span>
            <span>${entry.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Expense List */}
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Expenses
      </h2>
      {expenses?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No expenses this month
        </p>
      )}
      <ul className="space-y-3">
        {expenses?.map((expense: Expense) => (
          <li
            key={expense.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{expense.description}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  ${Number(expense.amount).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteExpense(expense.id)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{expense.category}</span>
              <span>Paid by {expense.paidBy.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
