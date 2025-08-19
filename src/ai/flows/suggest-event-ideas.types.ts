
import { z } from 'zod';

export const SuggestEventIdeasInputSchema = z.object({
  eventType: z.string().describe('The type of event being planned (e.g., Birthday Party, Corporate Gala).'),
  guestCount: z.number().describe('The estimated number of guests.'),
  budget: z.number().describe('The total budget for the event.'),
  additionalInfo: z.string().optional().describe('Any additional information from the user, like hobbies, desired atmosphere, or favorite colors.'),
});
export type SuggestEventIdeasInput = z.infer<typeof SuggestEventIdeasInputSchema>;

export const SuggestEventIdeasOutputSchema = z.object({
  theme: z.string().describe('A creative theme for the event.'),
  decoration: z.string().describe('Suggestions for decorations that match the theme.'),
  activity: z.string().describe('Suggestions for activities or entertainment for the guests.'),
});
export type SuggestEventIdeasOutput = z.infer<typeof SuggestEventIdeasOutputSchema>;


export const FormSchema = z.object({
  eventType: z.string().min(2, {
    message: 'Function type must be at least 2 characters.',
  }),
  guestCount: z.coerce.number().int().positive({
    message: 'Please enter a valid number of guests.',
  }),
  budget: z.coerce.number().positive({
    message: 'Please enter a valid budget.',
  }),
  additionalInfo: z.string().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;
