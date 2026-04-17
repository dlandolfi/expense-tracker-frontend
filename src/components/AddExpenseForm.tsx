"use client";

import { useState } from "react";

import { useCreateExpense } from "@/hooks/useExpenses";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseCategory } from "@/types";

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

export default function AddExpenseForm() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("OTHER");
  const [paidById, setPaidById] = useState<number | null>(null);

  const { data: users } = useUsers();
  const { mutate: createExpense, isPending } = useCreateExpense();

  function handleSubmit() {
    if (!amount || !paidById) return;

    createExpense(
      {
        description,
        amount: Number(amount),
        category,
        paidById,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setDescription("");
          setAmount("");
          setCategory("OTHER");
          setPaidById(null);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new shared expense.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as ExpenseCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={paidById?.toString() ?? ""}
            onValueChange={(val) => setPaidById(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Paid by" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
