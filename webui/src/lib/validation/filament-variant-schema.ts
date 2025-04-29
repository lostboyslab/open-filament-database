import { z } from 'zod';

const traitsSchema = z.object({
    translucent: z.boolean().optional(),
    glow: z.boolean().optional(),
    matte: z.boolean().optional(),
    recycled: z.boolean().optional(),
    recyclable: z.boolean().optional(),
    biodegradable: z.boolean().optional()
});

export const filamentVariantSchema = z.object({
    color_name: z.string(),
    // color_hex can be a string or string[]
    color_hex: z.union([
        z.string().regex(/^#?[a-fA-F0-9]{6}$/, 'Must be a valid hex code (#RRGGBB)'),
        z.array(z.string().regex(/^#?[a-fA-F0-9]{6}$/, 'Must be a valid hex code (#RRGGBB)'))
    ]),
    traits: traitsSchema.optional()
});

// import * as yup from 'yup';

// const traitsSchema = yup.object({
//     translucent: yup.boolean().notRequired(),
//     glow: yup.boolean().notRequired(),
//     matte: yup.boolean().notRequired(),
//     recycled: yup.boolean().notRequired(),
//     recyclable: yup.boolean().notRequired(),
//     biodegradable: yup.boolean().notRequired()
// });

// export const filamentVariantSchema = yup.object({
//     color_name: yup.string().required('Color name is required'),
//     // color_hex can be a string or string[]
//     color_hex: yup
//         .mixed()
//         .required('Color hex is required')
//         .test(
//             'color-hex-check',
//             'Must be a valid hex code (#RRGGBB)',
//             value => {
//                 if (Array.isArray(value)) {
//                     return value.every(v => /^#?[a-fA-F0-9]{6}$/.test(v));
//                 }
//                 return typeof value === 'string' && /^#?[a-fA-F0-9]{6}$/.test(value);
//             }
//         ),
//     traits: traitsSchema.notRequired()
// });
