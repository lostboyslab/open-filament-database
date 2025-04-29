import { z } from 'zod';

export const brandSchema = z.object({
    name: z.string().min(1, "Brand name is required"),
    // logo: z.string().url(),
    website: z.string().url(),
    origin: z.string(),
    logo: z.union([
        z.string().url(),
        z.instanceof(File, { message: 'Please upload a file.' })
          .refine((f) => f.size < 10_000_000, 'Max 10 MB upload size.')
    ]).optional(),
    oldBrandName: z.string().optional()
});