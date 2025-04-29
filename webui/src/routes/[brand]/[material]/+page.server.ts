import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { filamentMaterialSchema } from '$lib/validation/filament-material-schema';
import { zod } from 'sveltekit-superforms/adapters';
import { createMaterial, removeUndefined } from '$lib/server/helpers';

export const load: PageServerLoad = async ({ params, parent }) => {
  const { brand, material } = params;
  const { filamentData } = await parent();

  const normalizedBrand = brand.trim().toLowerCase().replace(/\s+/g, '');
  const normalizedMaterial = material.trim().toLowerCase().replace(/\s+/g, '');

  const brandKey = Object.keys(filamentData.brands).find(
    key => key.toLowerCase().replace(/\s+/g, '') === normalizedBrand
  );
  if (!brandKey) {
    error(404, 'Brand not found');
  }

  const brandData = filamentData.brands[brandKey];

  const currentMaterial = brandData.materials[material]
  const materialForm = await superValidate(currentMaterial, zod(filamentMaterialSchema));
  
  const materialKey = Object.keys(brandData.materials).find(
    key => key.toLowerCase().replace(/\s+/g, '') === normalizedMaterial
  );
  if (!materialKey) {
    error(404, 'Material not found');
  }

  const materialData = brandData.materials[materialKey];

  return {
    brandData,
    materialForm,
    materialData
  };
};

export const actions = {
  material: async ({ request, params }) => {
    const form = await superValidate(request, zod(filamentMaterialSchema));
    const { brand } = params;


    if (!form.valid) {
      fail(400, { form });
    }

    const filteredMaterial = removeUndefined(form.data);

    createMaterial(brand, filteredMaterial);

    return redirect(303, brand);

}
}