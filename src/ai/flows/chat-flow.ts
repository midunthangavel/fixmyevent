
'use server';
/**
 * @fileOverview A conversational AI agent for the chat page.
 * 
 * - chat: A function that responds to user messages, with the ability to use tools.
 */

import { ChatInput, ChatInputSchema, ChatOutput, ChatOutputSchema } from './chat.types';

// This function now works with the AI service through API routes
export async function chat(input: ChatInput): Promise<ChatOutput> {
  // For now, return a mock response
  // In production, this would call the AI service through the API
  return `I received your message: "${input.message}". This is a mock response for development. In production, this would use the AI service.`;
}
