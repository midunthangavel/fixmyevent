
import { z } from 'zod';

export const GenerateMoodBoardInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the mood board image.'),
});
export type GenerateMoodBoardInput = z.infer<typeof GenerateMoodBoardInputSchema>;

export const GenerateMoodBoardOutputSchema = z.string().describe('The data URI of the generated image.');
export type GenerateMoodBoardOutput = z.infer<typeof GenerateMoodBoardOutputSchema>;
