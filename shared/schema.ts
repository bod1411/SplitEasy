import { z } from "zod";

export const friendSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Friend name is required"),
});

export const expenseSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  paidBy: z.string().min(1, "Payer is required"),
  createdAt: z.date().default(() => new Date()),
});

export const insertFriendSchema = friendSchema.omit({ id: true });
export const insertExpenseSchema = expenseSchema.omit({ id: true, createdAt: true });

export type Friend = z.infer<typeof friendSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type InsertFriend = z.infer<typeof insertFriendSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface Balance {
  name: string;
  balance: number;
}
