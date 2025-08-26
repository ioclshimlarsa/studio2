'use server';

/**
 * @fileOverview Generates personalized email notifications to schools when a new camp is created in their district.
 *
 * - generateCampNotification - A function that handles the generation of camp notifications.
 * - CampNotificationInput - The input type for the generateCampNotification function.
 * - CampNotificationOutput - The return type for the generateCampNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampNotificationInputSchema = z.object({
  schoolName: z.string().describe('The name of the school.'),
  schoolDistrict: z.string().describe('The district the school is located in.'),
  campName: z.string().describe('The name of the camp.'),
  campDistrict: z.string().describe('The district the camp is located in.'),
  campDescription: z.string().describe('A description of the camp.'),
  eligibilityCriteria: z.string().describe('The eligibility criteria for the camp.'),
  contactEmail: z.string().describe('The contact email for the camp.'),
});
export type CampNotificationInput = z.infer<typeof CampNotificationInputSchema>;

const CampNotificationOutputSchema = z.object({
  notificationEmail: z.string().describe('The generated email notification content.'),
});
export type CampNotificationOutput = z.infer<typeof CampNotificationOutputSchema>;

export async function generateCampNotification(input: CampNotificationInput): Promise<CampNotificationOutput> {
  return campNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campNotificationPrompt',
  input: {schema: CampNotificationInputSchema},
  output: {schema: CampNotificationOutputSchema},
  prompt: `You are an expert email generator for school districts.

You will generate an email to a school informing them of a camp in their district.

Make the email personalized to the school, and professional.

School Name: {{{schoolName}}}
School District: {{{schoolDistrict}}}
Camp Name: {{{campName}}}
Camp District: {{{campDistrict}}}
Camp Description: {{{campDescription}}}
Eligibility Criteria: {{{eligibilityCriteria}}}
Contact Email: {{{contactEmail}}}

Email:`,
});

const campNotificationFlow = ai.defineFlow(
  {
    name: 'campNotificationFlow',
    inputSchema: CampNotificationInputSchema,
    outputSchema: CampNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      notificationEmail: output!.notificationEmail,
    };
  }
);
