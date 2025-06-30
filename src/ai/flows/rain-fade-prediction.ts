'use server';

/**
 * @fileOverview Determines if rain or snow will affect a specific connection, providing warnings and suggesting adjustments.
 *
 * - rainFadePrediction - A function that handles the rain fade prediction process.
 * - RainFadePredictionInput - The input type for the rainFadePrediction function.
 * - RainFadePredictionOutput - The return type for the rainFadePrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RainFadePredictionInputSchema = z.object({
  frequencyGHz: z.number().describe('The frequency of the signal in GHz.'),
  elevationAngleDegrees: z.number().describe('The elevation angle of the satellite in degrees.'),
  rainRateMmHr: z.number().describe('The rain rate in mm/hr.'),
  polarizationTiltAngleDegrees: z
    .number()
    .describe('The polarization tilt angle in degrees (0 for horizontal, 45 for circular, 90 for vertical).'),
  siteLatitudeDegrees: z.number().describe('The latitude of the ground station in degrees.'),
  siteLongitudeDegrees: z.number().describe('The longitude of the ground station in degrees.'),
});
export type RainFadePredictionInput = z.infer<typeof RainFadePredictionInputSchema>;

const RainFadePredictionOutputSchema = z.object({
  willRainAffectConnection: z
    .boolean()
    .describe('Whether or not rain/snow will affect the connection.'),
  suggestedAdjustments: z.string().describe('Suggested adjustments to mitigate rain fade.'),
});
export type RainFadePredictionOutput = z.infer<typeof RainFadePredictionOutputSchema>;

export async function rainFadePrediction(input: RainFadePredictionInput): Promise<RainFadePredictionOutput> {
  return rainFadePredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rainFadePredictionPrompt',
  input: {schema: RainFadePredictionInputSchema},
  output: {schema: RainFadePredictionOutputSchema},
  prompt: `You are an expert in satellite communication, specializing in predicting the impact of rain fade on satellite links.

  Given the following parameters of a satellite link, determine if rain or snow will affect the connection.
  If so, suggest adjustments to mitigate the rain fade.

  Frequency: {{{frequencyGHz}}} GHz
  Elevation Angle: {{{elevationAngleDegrees}}} degrees
  Rain Rate: {{{rainRateMmHr}}} mm/hr
  Polarization Tilt Angle: {{{polarizationTiltAngleDegrees}}} degrees
  Site Latitude: {{{siteLatitudeDegrees}}} degrees
  Site Longitude: {{{siteLongitudeDegrees}}} degrees

  Consider factors such as frequency, elevation angle, rain rate, and polarization to provide an accurate prediction and helpful advice.

  Format your response as a JSON object conforming to the following schema:
  ${JSON.stringify(RainFadePredictionOutputSchema.describe(''))}
  `,
});

const rainFadePredictionFlow = ai.defineFlow(
  {
    name: 'rainFadePredictionFlow',
    inputSchema: RainFadePredictionInputSchema,
    outputSchema: RainFadePredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
