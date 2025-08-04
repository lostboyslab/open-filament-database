import { z } from 'zod';

export const filamentSchema = z.object({
  name: z.string(),
  diameter_tolerance: z.number().optional(),
  density: z.number(),
  max_dry_temperature: z.number().int().optional(),
  discontinued: z.boolean().default(false),
  data_sheet_url: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => {
        return url.startsWith('http://') || url.startsWith('https://');
    }, 'URL must use HTTP or HTTPS protocol')
    .optional(),
  safety_sheet_url: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => {
        return url.startsWith('http://') || url.startsWith('https://');
    }, 'URL must use HTTP or HTTPS protocol')
    .optional(),
});
