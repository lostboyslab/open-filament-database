<script lang="ts">
  let { form, errors, message, enhance, formType, brandName, materialName, filamentName } =
    $props();
</script>

<div
  class="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-gray-900 dark:text-gray-100">
  <form method="POST" use:enhance action="?/updateVariant" class="space-y-5">
    <h3 class="text-xl font-bold mb-4">{formType === 'edit' ? 'Edit' : 'Create'} Color Variant</h3>

    <div>
      <label for="color_name" class="block font-medium mb-1">
        Color name<span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Enter the official color name as specified by the manufacturer
      </p>
      <input
        id="color_name"
        type="text"
        name="color_name"
        required
        placeholder="e.g. Galaxy Black"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.color_name} />
      {#if $errors.color_name}
        <span class="text-red-600 text-xs">{$errors.color_name}</span>
      {/if}
    </div>

    <div class="mb-4">
      <label for="color_hex" class="block font-medium mb-1">
        Color hex<span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Choose the color or enter the hex code that best represents this filament color
      </p>
      <div class="flex items-center gap-3">
        <input
          id="color_hex"
          type="color"
          name="color_hex"
          aria-required="true"
          class="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
          bind:value={$form.color_hex}
          style="padding:0;" />
        <input
          type="text"
          class="w-28 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1"
          bind:value={$form.color_hex}
          maxlength="7"
          placeholder="#RRGGBB" />
      </div>
      {#if $errors.color_hex}
        <span class="text-red-600 text-xs">{$errors.color_hex}</span>
      {/if}
    </div>

    <fieldset>
      <legend class="block font-medium mb-1">Traits</legend>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Select all special properties that apply to this filament variant
      </p>
      <div class="traits flex flex-wrap gap-4 mb-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="translucent"
            name="translucent"
            bind:checked={$form.translucent}
            class="accent-blue-600 w-4 h-4" />
          <span>Translucent</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="glow"
            name="glow"
            bind:checked={$form.glow}
            class="accent-blue-600 w-4 h-4" />
          <span>Glow</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="matte"
            name="matte"
            bind:checked={$form.matte}
            class="accent-blue-600 w-4 h-4" />
          <span>Matte</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="recycled"
            name="recycled"
            bind:checked={$form.recycled}
            class="accent-blue-600 w-4 h-4" />
          <span>Recycled</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="recyclable"
            name="recyclable"
            bind:checked={$form.recyclable}
            class="accent-blue-600 w-4 h-4" />
          <span>Recyclable</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="biodegradable"
            name="biodegradable"
            bind:checked={$form.biodegradable}
            class="accent-blue-600 w-4 h-4" />
          <span>Biodegradable</span>
        </label>
      </div>
    </fieldset>

    <input type="hidden" name="brandName" value={brandName} />
    <input type="hidden" name="materialName" value={materialName} />
    <input type="hidden" name="filamentName" value={filamentName} />

    <button
      type="submit"
      class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors">
      {formType === 'edit' ? 'Save Changes' : 'Create Variant'}
    </button>
  </form>
</div>
