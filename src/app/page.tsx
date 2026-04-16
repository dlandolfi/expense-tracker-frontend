"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useDeleteExpense } from "@/hooks/useExpenses";
import { useBalance } from "@/hooks/useBalance";
import { Expense } from "@/types";
import AddExpenseForm from "@/components/AddExpenseForm";
import { Button } from "@/components/ui/button";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function Home() {
  const [month, setMonth] = useState(getCurrentMonth());

  const { data: expenses, isLoading: expensesLoading } = useExpenses(month);
  const { data: balance, isLoading: balanceLoading } = useBalance(month);
  const { mutate: deleteExpense } = useDeleteExpense();

  if (expensesLoading || balanceLoading) return <p>Loading...</p>;

  return (
    <main className="max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
        <AddExpenseForm />
      </div>

      {/* Month Selector */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded p-2 mb-6 w-full"
      />

      {/* Balance Summary */}
      <div className="bg-slate-100 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Balance</h2>
        <p>Total: ${balance?.grandTotal?.toFixed(2)}</p>
        <p>Each owes: ${balance?.fairShare?.toFixed(2)}</p>
      </div>

      {/* Expense List */}
      <h2 className="text-lg font-semibold mb-2">Expenses</h2>
      <ul className="space-y-2">
        {expenses?.map((expense: Expense) => (
          <li key={expense.id} className="bg-white border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span>{expense.description}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  ${Number(expense.amount).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExpense(expense.id)}
                >
                  x
                </Button>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {expense.category} · Paid by {expense.paidBy.name}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
