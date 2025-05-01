import { createBrand } from "$lib/server/helpers";
import { brandSchema } from "$lib/validation/filament-brand-schema";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const load = async () => {

  const form = await superValidate(zod(brandSchema));
  return { form };
};

export const actions = {
  brand: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(brandSchema));
    console.log('SUBMIT FORM : ', form);

    if (!form.valid) {
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      return fail(400, { form });
    }

    createBrand(form.data)
    redirect(form.data.name, { type: 'success', message: "Brand created" }, cookies);

}
}