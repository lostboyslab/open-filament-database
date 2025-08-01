<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { pseudoEdit } from '$lib/pseudoEditor';
  import { invalidateAll } from '$app/navigation';
  import { booleanProxy, fieldProxy } from 'sveltekit-superforms';

  let {
    form,
    errors,
    message,
    enhance,
    formType,
    brandName,
    materialName,
    filamentName,
    colorName,
  } = $props();

  // Proxies are needed for nested properties to work correctly with sveltekit-superforms
  const translucent = booleanProxy(form, 'traits.translucent');
  const glow = booleanProxy(form, 'traits.glow');
  const matte = booleanProxy(form, 'traits.matte');
  const recycled = booleanProxy(form, 'traits.recycled');
  const recyclable = booleanProxy(form, 'traits.recyclable');
  const biodegradable = booleanProxy(form, 'traits.biodegradable');

  const enhancedSubmit = (formData: FormData) => {
    let traitData = $form.traits;
    // 🤷‍♀️ for some reason $form.traits all has the value of false, setting them to true as if they exist they should be
    Object.keys(traitData).forEach((key: any) => {
      traitData[key] == true
    });
    // Also... serialize data before transmitting to backend
    formData.set("serializedTraits", JSON.stringify(traitData));

    return async ({ result, update }) => {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (result.type === 'success' && !isLocal) {
        // For web version, apply pseudo edit after server returns
        // Data is already in the correct nested format
        const variantData = {
          color_name: $form.color_name,
          color_hex: $form.color_hex,
          discontinued: $form.discontinued || undefined,
          traits: $form.traits || {},
        };

        try {
          pseudoEdit(
            'color_variant',
            brandName,
            variantData,
            materialName,
            filamentName,
            colorName,
          );
          await invalidateAll();
        } catch (error) {
          console.error('Pseudo edit failed:', error);
        }
      }

      await update();
    };
  };
</script>

<div
  class="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-gray-900 dark:text-gray-100">
  <form 
    method="POST"
    use:enhance={({formData}) => {enhancedSubmit(formData)}}
    action="?/updateVariant" 
    class="space-y-5" >
    <h3 class="text-xl font-bold mb-4">{formType === 'edit' ? 'Edit' : 'Create'} Color Variant</h3>

    <div>
      <label for="color_name" class="block font-medium mb-1">
        Color Name<span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        The display name of this color variant
      </p>
      <input
        id="color_name"
        type="text"
        name="color_name"
        required
        placeholder="Matte Black"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.color_name} />
      {#if $errors.color_name}
        <span class="text-red-600 text-xs">{$errors.color_name}</span>
      {/if}
    </div>

    <div>
      <label for="color_hex" class="block font-medium mb-1"
        >Color hex<span class="text-red-500">*</span></label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Choose the color or enter the hex code that best represents this filament color
      </p>
      <div class="flex items-center justify-between gap-3 justify-between">
        <input
          id="color_hex"
          type="color"
          name="color_hex"
          aria-required="true"
          aria-describedby="color-hex-help"
          class="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
          aria-invalid={$errors.color_hex ? 'true' : undefined}
          bind:value={$form.color_hex}
          style="padding:0;" />
        <input
          type="text"
          class="w-80 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1"
          bind:value={$form.color_hex}
          maxlength="7"
          placeholder="#RRGGBB" />
      </div>
      {#if $errors.color_hex}
        <span class="text-red-600 text-xs">{$errors.color_hex}</span>
      {/if}
    </div>

    <div>
      <div>
        <div class="flex flex-row items-center">
          <input
          id="discontinued"
          type="checkbox"
          name="discontinued"
          class="accent-blue-600 w-4 h-4 mr-2"
          bind:checked={$form.discontinued} />

          <label for="discontinued" class="inline-block font-medium">
            Discontinued
          </label>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Select if this colour variant is discontinued 
          </p>
      </div>
      {#if $errors.discontinued}
        <span class="text-red-600 text-xs">{$errors.discontinued}</span>
      {/if}
    </div>

    <fieldset>
      <legend class="block font-medium mb-2">Material Traits</legend>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Select all special properties that apply to this filament variant
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <input
            id="translucent"
            type="checkbox"
            name="traits.translucent"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$translucent} />
          <label for="translucent" class="font-medium text-sm">Translucent</label>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="glow"
            type="checkbox"
            name="traits.glow"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$glow} />
          <label for="glow" class="font-medium text-sm">Glow in dark</label>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="matte"
            type="checkbox"
            name="traits.matte"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$matte} />
          <label for="matte" class="font-medium text-sm">Matte finish</label>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="recycled"
            type="checkbox"
            name="traits.recycled"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$recycled} />
          <label for="recycled" class="font-medium text-sm">Recycled</label>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="recyclable"
            type="checkbox"
            name="traits.recyclable"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$recyclable} />
          <label for="recyclable" class="font-medium text-sm">Recyclable</label>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="biodegradable"
            type="checkbox"
            name="traits.biodegradable"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$biodegradable} />
          <label for="biodegradable" class="font-medium text-sm">Biodegradable</label>
        </div>
      </div>
    </fieldset>

    <button
      type="submit"
      class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors">
      {formType === 'edit' ? 'Save Changes' : 'Create Variant'}
    </button>
  </form>
</div>
