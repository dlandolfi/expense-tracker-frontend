"use client";

import { useState } from "react";
import { format } from "date-fns";

import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
import { ExpenseCategory, Expense } from "@/types";

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

type Props = {
  expense?: Expense;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function AddExpenseForm({ expense, open, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [description, setDescription] = useState(expense?.description ?? "");
  const [amount, setAmount] = useState(expense?.amount ?? "");
  const [category, setCategory] = useState<ExpenseCategory>(
    expense?.category ?? "GROCERIES",
  );
  const [paidById, setPaidById] = useState<number | null>(
    expense?.paidById ?? null,
  );

  const { data: users } = useUsers();
  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
  const isPending = isCreating || isUpdating;

  const isEditing = !!expense;
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  function handleSubmit() {
    if (!amount || !paidById) return;

    if (isEditing) {
      updateExpense(
        {
          id: expense.id,
          description,
          amount: Number(amount),
          category,
          paidById,
        },
        {
          onSuccess: () => setIsOpen(false),
        },
      );
    } else {
      createExpense(
        {
          description,
          amount: Number(amount),
          category,
          paidById,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            setDescription("");
            setAmount("");
            setCategory("GROCERIES");
            setPaidById(null);
          },
        },
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>Add Expense</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the expense details."
              : "Fill in the details to add a new shared expense."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as ExpenseCategory)}
            >
              <SelectTrigger className="h-12 text-base flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-base py-3">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={paidById?.toString() ?? ""}
              onValueChange={(val) => setPaidById(Number(val))}
            >
              <SelectTrigger className="h-12 text-base flex-1">
                <SelectValue placeholder="Paid by" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id.toString()}
                    className="text-base py-3"
                  >
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 text-base"
          />
          <div className="space-y-1">
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 text-base"
              enterKeyHint="next"
            />
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-12 text-base"
          >
            {isPending
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Expense"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
