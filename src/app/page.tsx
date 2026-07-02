"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import AddExpenseForm from "@/components/AddExpenseForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoginForm from "@/components/Loginform";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useBalance } from "@/hooks/useBalance";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import { useUsers } from "@/hooks/useUsers";
import { Expense, ExpenseCategory } from "@/types";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES: ExpenseCategory[] = [
  "GROCERIES",
  "HOUSEHOLD",
  "UTILITIES",
  "SUBSCRIPTIONS",
  "DINING",
  "COFFEE",
  "TRANSPORT",
  "ENTERTAINMENT",
  "OTHER",
];

export default function Home() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [monthNum, setMonthNum] = useState(currentMonth);

  const month = `${year}-${String(monthNum).padStart(2, "0")}`;

  const { data: expenses, isLoading: expensesLoading } = useExpenses(month);
  const { data: balance, isLoading: balanceLoading } = useBalance(month);
  const { mutate: deleteExpense } = useDeleteExpense();
  const { data: users } = useUsers();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "ALL">(
    "ALL"
  );
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const { credentials } = useAuth();

  if (!credentials) return <LoginForm />;

  if (expensesLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const filteredExpenses = expenses?.filter(
    (expense: Expense) =>
      categoryFilter === "ALL" || expense.category === categoryFilter
  );

  return (
    <main className="max-w-lg mx-auto p-4 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center py-4 mb-6 px-4 -mx-4 bg-(--header-bg)">
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
              entry.status === "owed"
                ? "text-(--color-owed)"
                : "text-(--color-owes)"
            }`}
          >
            <span>
              {users?.find((u) => u.id === entry.userId)?.name ??
                `User ${entry.userId}`}{" "}
              {entry.status}
            </span>
            <span>${entry.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Expense List */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Expenses
        </h2>
        <Select
          value={categoryFilter}
          onValueChange={(val) =>
            setCategoryFilter(val as ExpenseCategory | "ALL")
          }
        >
          <SelectTrigger className="w-40 h-8 capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filteredExpenses?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {categoryFilter === "ALL"
            ? "No expenses this month"
            : "No expenses in this category"}
        </p>
      )}
      <ul className="space-y-3">
        {filteredExpenses?.map((expense: Expense) => (
          <li
            key={expense.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-base">
                {expense.description ?? ""}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">
                  ${Number(expense.amount).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary h-7 w-7"
                  onClick={() => setEditingExpense(expense)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete expense"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                  onClick={() => setDeletingExpense(expense)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>
                {new Date(expense.date).toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
                {" · "}
                <span className="capitalize">
                  {expense.category.toLowerCase()}
                </span>
              </span>
              <span>Paid by {expense.paidBy.name}</span>
            </div>
          </li>
        ))}
      </ul>
      {editingExpense && (
        <AddExpenseForm
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => {
            if (!open) setEditingExpense(null);
          }}
        />
      )}
      <AlertDialog
        open={!!deletingExpense}
        onOpenChange={(open) => {
          if (!open) setDeletingExpense(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingExpense
                ? `"${deletingExpense.description || deletingExpense.category}" for $${Number(
                    deletingExpense.amount
                  ).toFixed(2)} will be permanently deleted.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (deletingExpense) deleteExpense(deletingExpense.id);
                setDeletingExpense(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
