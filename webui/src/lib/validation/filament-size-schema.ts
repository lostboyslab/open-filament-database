import { z } from 'zod';

const purchaseLinkSchema = z.object({
    store_id: z.string().optional(),
    url: z.string().url(),
    affiliate: z.boolean(),
    ships_from: z.union([z.string(), z.array(z.string())]).optional(),
    ships_to: z.union([z.string(), z.array(z.string())]).optional()
});

export const filamentSizeSchema = z.object({
    filament_weight: z.number(),
    empty_spool_weight: z.number().optional(),
    diameter: z.number(),
    spool_refill: z.boolean().default(false),
    sku: z.string().optional(),
    ean: z.string().optional(),
    purchase_links: z.array(purchaseLinkSchema).optional()
});


// import * as yup from 'yup';

// const purchaseLinkSchema = yup.object({
//     store_id: yup.string().notRequired(), // optional
//     url: yup
//         .string()
//         .url('Must be a valid URL')
//         .required('URL is required'),
//     affiliate: yup.boolean().required('affiliate is required'),
//     ships_from: yup
//         .mixed()
//         .test(
//             'is-string-or-string-array',
//             'ships_from must be a string or array of strings',
//             value => {
//                 if (!value) return true; // if not present, skip
//                 if (Array.isArray(value)) {
//                     return value.every(v => typeof v === 'string');
//                 }
//                 return typeof value === 'string';
//             }
//         )
//         .notRequired(),
//     ships_to: yup
//         .mixed()
//         .test(
//             'is-string-or-string-array',
//             'ships_to must be a string or array of strings',
//             value => {
//                 if (!value) return true;
//                 if (Array.isArray(value)) {
//                     return value.every(v => typeof v === 'string');
//                 }
//                 return typeof value === 'string';
//             }
//         )
//         .notRequired()
// });

// export const filamentSizeSchema = yup.object({
//     filament_weight: yup.number().required('Filament weight is required'),
//     empty_spool_weight: yup.number().notRequired(),
//     diameter: yup.number().required('Diameter is required'),
//     spool_refill: yup.boolean().default(false),
//     sku: yup.string().notRequired(),
//     ean: yup.string().notRequired(),
//     purchase_links: yup.array().of(purchaseLinkSchema).notRequired()
// });
