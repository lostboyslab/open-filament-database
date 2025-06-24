import { z } from 'zod';

// For "generic" field
export const genericSlicerSchema = z.object({
  first_layer_bed_temp: z.number().optional(),
  first_layer_nozzle_temp: z.number().optional(),
  bed_temp: z.number().optional(),
  nozzle_temp: z.number().optional(),
});

// For "specific slicer settings"
export const prusaSlicerSettingsSchema = z.object({
  prusa_profile_path: z.string().optional(),
  prusa_overrides: z
    .object({
      first_layer_bed_temp: z.number().optional(),
      first_layer_nozzle_temp: z.number().optional(),
      bed_temp: z.number().optional(),
      nozzle_temp: z.number().optional(),
    })
    .optional(),
});

export const bambusStudioSlicerSettingsSchema = z.object({
  bambus_profile_path: z.string().optional(),
  bambus_overrides: z
    .object({
      first_layer_bed_temp: z.number().optional(),
      first_layer_nozzle_temp: z.number().optional(),
      bed_temp: z.number().optional(),
      nozzle_temp: z.number().optional(),
    })
    .optional(),
});
export const orcaSlicerSettingsSchema = z.object({
  orca_profile_path: z.string().optional(),
  orca_overrides: z
    .object({
      first_layer_bed_temp: z.number().optional(),
      first_layer_nozzle_temp: z.number().optional(),
      bed_temp: z.number().optional(),
      nozzle_temp: z.number().optional(),
    })
    .optional(),
});
export const curaSlicerSettingsSchema = z.object({
  cura_profile_path: z.string().optional(),
  cura_overrides: z
    .object({
      first_layer_bed_temp: z.number().optional(),
      first_layer_nozzle_temp: z.number().optional(),
      bed_temp: z.number().optional(),
      nozzle_temp: z.number().optional(),
    })
    .optional(),
});

export const filamentMaterialSchema = z
  .object({
    name: z.string(),
  })
  .merge(genericSlicerSchema)
  .merge(prusaSlicerSettingsSchema)
  .merge(bambusStudioSlicerSettingsSchema)
  .merge(orcaSlicerSettingsSchema)
  .merge(curaSlicerSettingsSchema);
