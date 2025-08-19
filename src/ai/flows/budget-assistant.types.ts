
import { z } from 'zod';

export const expenseCategories = ['Venue', 'Catering', 'Decorations', 'Entertainment', 'Transport', 'Photography', 'Attire', 'Other'] as const;

const ExpenseSchema = z.object({
  name: z.string().describe('A concise name for the expense item (e.g., "Venue Rental", "DJ Services").'),
  category: z.enum(expenseCategories).describe('The category that best fits the expense item.'),
  amount: z.number().describe('The cost of the expense item as a number.'),
});

export const AddExpensesToBudgetInputSchema = z.object({
  prompt: z.string().describe('The user\'s natural language request to add expenses.'),
});
export type AddExpensesToBudgetInput = z.infer<typeof AddExpensesToBudgetInputSchema>;

export const AddExpensesToBudgetOutputSchema = z.object({
  expenses: z.array(ExpenseSchema).describe('An array of structured expense items extracted from the prompt.'),
});
export type AddExpensesToBudgetOutput = z.infer<typeof AddExpensesToBudgetOutputSchema>;
