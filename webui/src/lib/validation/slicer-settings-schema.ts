import { z } from 'zod';

// For "generic" field
const genericSlicerSchema = z.object({
    first_layer_bed_temp: z.number().optional(),
    first_layer_nozzle_temp: z.number().optional(),
    bed_temp: z.number().optional(),
    nozzle_temp: z.number().optional()
});

// For "specific slicer settings"
const specificSlicerSettingsSchema = z.object({
    profile_path: z.string(),
    overrides: z.object({}).optional()
});

export const slicerSettingsSchema = z.object({
    generic: genericSlicerSchema.optional(),
    prusaslicer: specificSlicerSettingsSchema.optional(),
    bambustudio: specificSlicerSettingsSchema.optional(),
    orcaslicer: specificSlicerSettingsSchema.optional(),
    cura: specificSlicerSettingsSchema.optional()
});

// import * as yup from 'yup';

// // For "generic" field
// const genericSlicerSchema = yup.object({
//     first_layer_bed_temp: yup.number().notRequired(),
//     first_layer_nozzle_temp: yup.number().notRequired(),
//     bed_temp: yup.number().notRequired(),
//     nozzle_temp: yup.number().notRequired()
// });

// // For "specific slicer settings"
// const specificSlicerSettingsSchema = yup.object({
//     profile_path: yup.string().required('profile_path is required'),
//     overrides: yup.object().notRequired()
// });

// export const slicerSettingsSchema = yup.object({
//     generic: genericSlicerSchema.notRequired(),
//     prusaslicer: specificSlicerSettingsSchema.notRequired(),
//     bambustudio: specificSlicerSettingsSchema.notRequired(),
//     orcaslicer: specificSlicerSettingsSchema.notRequired(),
//     cura: specificSlicerSettingsSchema.notRequired()
// });
