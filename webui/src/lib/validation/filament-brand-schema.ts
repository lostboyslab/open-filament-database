import { z } from 'zod';

export const brandSchema = z.object({
    name: z.string().min(1, "Brand name is required"),
    // logo: z.string().url(),
    website: z.string().url(),
    origin: z.string(),
    logo: z
    .instanceof(File, { message: 'Please upload a file.'})
    .refine((f) => f.size < 100_000, 'Max 100 kB upload size.'),
    oldBrandName: z.string().optional()
});
