import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { removeUndefined, updateColorSize, updateColorVariant } from '$lib/server/helpers';
import { setFlash } from 'sveltekit-flash-message/server';
import { filamentSizeSchema } from '$lib/validation/filament-size-schema';
import { filamentVariantSchema } from '$lib/validation/filament-variant-schema';

import { refreshDatabase } from '$lib/dataCacher';

export const load: PageServerLoad = async ({ params, parent }) => {
  const { brand, material, filament, instance } = params;
  const { filamentData } = await parent();

  const normalizedBrand = brand.trim().toLowerCase().replace(/\s+/g, '');
  const normalizedMaterial = material.trim().toLowerCase().replace(/\s+/g, '');
  const normalizedFilament = filament.trim().toLowerCase().replace(/\s+/g, '');
  const normalizedInstance = instance.trim().toLowerCase().replace(/\s+/g, '');

  const brandKey = Object.keys(filamentData.brands).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedBrand,
  );
  if (!brandKey) throw error(404, 'Brand not found');
  const brandData = filamentData.brands[brandKey];

  const materialKey = Object.keys(brandData.materials).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedMaterial,
  );
  if (!materialKey) throw error(404, 'Material not found');
  const materialData = brandData.materials[materialKey];

  const filamentKey = Object.keys(materialData.filaments).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedFilament,
  );
  if (!filamentKey) throw error(404, 'Filament not found');
  const filamentDataObj = materialData.filaments[filamentKey];

  const colorKey = Object.keys(filamentDataObj.colors).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedInstance,
  );
  if (!colorKey) throw error(404, 'Color not found');
  const colorData = filamentDataObj.colors[colorKey];

  // Prepare forms - combine variant and first size data for editing
  const combinedData = {
    ...colorData.variant,
    color_name: colorData.name,
    // If there are sizes, take the first one for editing
    ...(colorData.sizes.length > 0 ? colorData.sizes[0] : {}),
    // Add path data for form processing
    brandName: brandData.brand,
    materialName: materialData.name,
    filamentName: filamentDataObj.name,
  };

  const variantForm = await superValidate(colorData.variant, zod(filamentVariantSchema));
  const sizeForm = await superValidate(colorData.sizes[0], zod(filamentSizeSchema));

  return {
    brandData,
    materialData,
    filamentData: filamentDataObj,
    colorData,
    variantForm,
    sizeForm,
  };
};

export const actions = {
  updateVariant: async ({ request, params, cookies }) => {
    const form = await superValidate(request, zod(filamentVariantSchema));
    const { brand, material, filament, instance } = params;
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await updateColorVariant(brand, material, filament, instance, form.data);
      await refreshDatabase();
    } catch (error) {
      console.error('Failed to update color variant:', error);
      setFlash(
        { type: 'error', message: 'Failed to update color variant. Please try again.' },
        cookies,
      );
      return fail(500, { form });
    }

    setFlash({ type: 'success', message: 'Color variant updated successfully!' }, cookies);
    redirect(303, `/${brand}/${material}/${filament}/${form.data.color_name}`);
  },

  updateSize: async ({ request, params, cookies }) => {
    const form = await superValidate(request, zod(filamentSizeSchema));
    const { brand, material, filament, instance } = params;

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await updateColorSize(brand, material, filament, instance, form.data);
      await refreshDatabase();
    } catch (error) {
      console.error('Failed to update size:', error);
      setFlash({ type: 'error', message: 'Failed to update size. Please try again.' }, cookies);
      return fail(500, { form });
    }

    setFlash({ type: 'success', message: 'Size updated successfully!' }, cookies);
    return { form, success: true };
  },
};
