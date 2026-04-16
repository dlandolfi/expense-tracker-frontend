"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useBalance } from "@/hooks/useBalance";
import { useDeleteExpense } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import AddExpenseForm from "@/components/AddExpenseForm";
import { Expense } from "@/types";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function Home() {
  const [month, setMonth] = useState(getCurrentMonth());
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
      <div className="flex justify-between items-center py-4 mb-6">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <AddExpenseForm />
      </div>

      {/* Month Selector */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full bg-muted text-foreground border border-border rounded-lg p-2 mb-6"
      />

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
              entry.status === "owed" ? "text-green-400" : "text-red-400"
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
