import { z } from 'zod';

export const urlInputSchema = z.object({
    url: z.string().url({ message: 'Invalid URL format' }),
    validity: z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val, 10) : 30))
        .refine(val => !isNaN(val) && val > 0 && val <= 1440, {
            message: 'Validity must be a number between 1 and 1440 minutes',
        }),
    shortcode: z
        .string()
        .regex(/^[a-zA-Z0-9_-]{4,12}$/, {
            message: 'Shortcode must be 4–12 alphanumeric characters (optional)',
        })
        .optional()
});
