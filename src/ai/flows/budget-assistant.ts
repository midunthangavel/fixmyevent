
'use server';
/**
 * @fileOverview An AI agent for parsing budget expenses from natural language.
 * 
 * - addExpensesToBudget: A function that takes a text prompt and returns structured expense data.
 */

import { AddExpensesToBudgetInput, AddExpensesToBudgetInputSchema, AddExpensesToBudgetOutput, AddExpensesToBudgetOutputSchema, expenseCategories } from './budget-assistant.types';

// This function now works with the AI service through API routes
export async function addExpensesToBudget(input: AddExpensesToBudgetInput): Promise<AddExpensesToBudgetOutput> {
  // For now, return a mock response
  // In production, this would call the AI service through the API
  return {
    expenses: [
      {
        name: "Sample Expense",
        amount: 100,
        category: "Venue"
      }
    ]
  };
}
