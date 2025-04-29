import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { brandSchema } from '$lib/validation/filament-brand-schema';
import { createBrand, createMaterial, removeUndefined, updateBrand } from '$lib/server/helpers';
import { filamentMaterialSchema, genericSlicerSchema, slicerSettingsSchema, specificSlicerSettingsSchema } from '$lib/validation/filament-material-schema';



export const load: PageServerLoad = async ({ params, parent }) => {
  const { brand } = params;
  const { filamentData } = await parent();

  const normalizedBrand = brand.trim().toLowerCase().replace(/\s+/g, '');
  
  const brandKey = Object.keys(filamentData.brands).find(
    key => key.toLowerCase().replace(/\s+/g, '') === normalizedBrand
  );
  if (!brandKey) {
    throw error(404, 'Brand not found');
  }
  
  const brandData = filamentData.brands[brandKey];
  const materialKey = Object.keys(brandData.materials).find(
    key => key.toLowerCase().replace(/\s+/g, '') === normalizedBrand
  );
  const brandForm = await superValidate(brandData, zod(brandSchema));
  const materialForm = await superValidate(zod(filamentMaterialSchema));
  return {
    brandForm,
    materialForm,
    brandData
  };
};

export const actions = {
  brand: async ({ request }) => {
    const form = await superValidate(request, zod(brandSchema));

    if (!form.valid) {
      return fail(400, { form });
    }
    updateBrand(form.data)
    
    return redirect(303, `/${form.data.name}/`);

},
material: async ({ request, params}) => {

  const form = await superValidate(request, zod(filamentMaterialSchema));
  const { brand } = params;

  const filteredMaterial = removeUndefined(form.data);

  if (!form.valid) {
    fail(400, { form });
  }

  createMaterial(brand , filteredMaterial)

return redirect (303, `/${brand}`)
}
}