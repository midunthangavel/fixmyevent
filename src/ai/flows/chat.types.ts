
import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';

export const ChatInputSchema = z.object({
    message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export interface Conversation {
    id: string;
    participants: {
        [key: string]: {
            name: string;
            avatar: string;
            isAi?: boolean;
        }
    };
    messages: Message[];
    lastMessage?: {
        text: string;
        timestamp: Timestamp;
    }
}
