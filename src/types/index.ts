export type ExpenseCategory =
  | "GROCERIES"
  | "HOUSEHOLD"
  | "UTILITIES"
  | "SUBSCRIPTIONS"
  | "DINING"
  | "COFFEE"
  | "TRANSPORT"
  | "ENTERTAINMENT"
  | "OTHER";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Expense = {
  id: number;
  description: string;
  amount: string;
  category: ExpenseCategory;
  paidById: number;
  paidBy: User;
  date: string;
};

export type BalanceEntry = {
  userId: number;
  paid: number;
  balance: number;
  status: "owed" | "owes";
  amount: number;
};

export type BalanceResponse = {
  grandTotal: number;
  fairShare: number;
  balance: BalanceEntry[];
};
