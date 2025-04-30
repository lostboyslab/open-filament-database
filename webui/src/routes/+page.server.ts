import { createBrand } from "$lib/server/helpers";
import { brandSchema } from "$lib/validation/filament-brand-schema";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {

  const form = await superValidate(zod(brandSchema));
  return { form };
};

export const actions = {
  brand: async ({ request }) => {
    console.log('REQUEST : ', request);
    const form = await superValidate(request, zod(brandSchema));
    console.log('SUBMIT FORM : ', form);

    if (!form.valid) {
      // Return { form } and things will just work.
      return fail(400, { form });
    }

    createBrand(form.data)
    return redirect(303, form.data.name);

}
}