<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { pseudoDelete, pseudoUndoDelete } from '$lib/pseudoDeleter';
  import { pseudoEdit } from '$lib/pseudoEditor';
  import { realDelete } from '$lib/realDeleter';
  import { booleanProxy, fieldProxy } from 'sveltekit-superforms';

  type formType = 'edit' | 'create';
  let { form, errors, message, formType, brandName, materialName, filamentName } =
    $props();

  async function handleDelete() {
    if (
      confirm(
        `Are you sure you want to delete the filament "${$form.name}"? This action cannot be undone.`,
      )
    ) {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (isLocal) {
        await realDelete('filament', $form.name, brandName, materialName);
      } else {
        pseudoDelete('filament', $form.name, brandName, materialName);
      }
    }
  }

  // Proxies are needed for nested properties to work correctly with sveltekit-superforms
  const translucent = booleanProxy(form, 'traits.translucent');
  const glow = booleanProxy(form, 'traits.glow');
  const matte = booleanProxy(form, 'traits.matte');
  const recycled = booleanProxy(form, 'traits.recycled');
  const recyclable = booleanProxy(form, 'traits.recyclable');
  const biodegradable = booleanProxy(form, 'traits.biodegradable');

  // Function to add a new purchase link
  function addPurchaseLink() {
    if (!$form.purchase_links) {
      $form.purchase_links = [];
    }
    $form.purchase_links = [
      ...$form.purchase_links,
      { store_id: '', url: '', affiliate: false, ships_from: '', ships_to: '' },
    ];
  }

  // Function to remove a purchase link
  function removePurchaseLink(index: number) {
    $form.purchase_links = $form.purchase_links.filter((_, i) => i !== index);
  }

  const enhancedSubmit = () => {
    return async ({ result, update }) => {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (result.type === 'success' && !isLocal) {
        const filamentData = {
          color_name: $form.color_name,
          color_hex: $form.color_hex,
          discontinued: $form.discontinued || undefined,
          traits: $form.traits || {},
          // Add other filament fields as needed

          filament_weight: Number($form.filament_weight),
          diameter: Number($form.diameter),
          empty_spool_weight: $form.empty_spool_weight
            ? Number($form.empty_spool_weight)
            : undefined,
          spool_core_diameter: $form.spool_core_diameter
            ? Number($form.spool_core_diameter)
            : undefined,
          ean: $form.ean || undefined,
          article_number: $form.article_number || undefined,
          size_specific_discontinued: $form.discontinued || undefined,
          purchase_links: $form.purchase_links || [],
        };

        pseudoEdit('filament', brandName, filamentData, materialName);
        await invalidateAll();
      }

      if (isLocal) {
        // Handle case!!
        // await realDelete('brand', $form.brand);
      } else {
        pseudoUndoDelete('filament', $form.name);
      }

      await update();
    };
  };
</script>

<div
  class="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-gray-900 dark:text-gray-100">
  <form
    method="POST"
    use:enhance={enhancedSubmit}
    action="?/instance"
    enctype="multipart/form-data"
    class="space-y-5">
    <div>
      <h3 class="text-xl font-bold mb-4">{formType === 'edit' ? 'Edit' : 'Create'} Color Variant</h3>

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
      <label for="color_hex" class="block font-medium mb-1"
        >Color hex<span class="text-red-500">*</span></label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Choose the color or enter the hex code that best represents this filament color
      </p>
      <div class="flex items-center gap-3 justify-between">
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

    <h3 class="text-xl font-bold mb-4">{formType === 'edit' ? 'Edit' : 'Add'} Size</h3>

    <div>
      <label for="filament_weight" class="block font-medium mb-1">
        Weight (g)<span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Net weight of the filament material (excluding spool)
      </p>
      <input
        id="filament_weight"
        type="number"
        name="filament_weight"
        step="0.1"
        required
        placeholder="1000"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.filament_weight} />
      {#if $errors.filament_weight}
        <span class="text-red-600 text-xs">{$errors.filament_weight}</span>
      {/if}
    </div>

    <div>
      <label for="diameter" class="block font-medium mb-1">
        Diameter (mm)<span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Filament diameter (typically 1.75mm or 3.0mm)
      </p>
      <input
        id="diameter"
        type="number"
        name="diameter"
        step="0.01"
        required
        placeholder="1.75"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.diameter} />
      {#if $errors.diameter}
        <span class="text-red-600 text-xs">{$errors.diameter}</span>
      {/if}
    </div>

    <div>
      <label for="empty_spool_weight" class="block font-medium mb-1">
        Empty spool weight (g)
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Weight of the empty spool without any filament
      </p>
      <input
        id="empty_spool_weight"
        type="number"
        name="empty_spool_weight"
        step="0.1"
        placeholder="250"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.empty_spool_weight} />
      {#if $errors.empty_spool_weight}
        <span class="text-red-600 text-xs">{$errors.empty_spool_weight}</span>
      {/if}
    </div>

    <div>
      <label for="spool_core_diameter" class="block font-medium mb-1">
        Spool core diameter (mm)
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        The diameter of the core of the spool
      </p>
      <input
        id="spool_core_diameter"
        type="number"
        name="spool_core_diameter"
        step="0.1"
        placeholder="100"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.spool_core_diameter} />
      {#if $errors.spool_core_diameter}
        <span class="text-red-600 text-xs">{$errors.spool_core_diameter}</span>
      {/if}
    </div>

    <div>
      <label for="ean" class="block font-medium mb-1">EAN</label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        European Article Number - barcode identifier
      </p>
      <input
        id="ean"
        type="text"
        name="ean"
        placeholder="1234567890123"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.ean} />
      {#if $errors.ean}
        <span class="text-red-600 text-xs">{$errors.ean}</span>
      {/if}
    </div>

    <div>
      <label for="article_number" class="block font-medium mb-1">
        Article number
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Article number - manufacturer's internal product code
      </p>
      <input
        id="article_number"
        type="text"
        name="article_number"
        placeholder="PLA-1000-BLK"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.article_number} />
      {#if $errors.article_number}
        <span class="text-red-600 text-xs">{$errors.article_number}</span>
      {/if}
    </div>

    <div>
      <div>
        <div class="flex flex-row items-center">
          <input
          id="size_specific_discontinued"
          type="checkbox"
          name="size_specific_discontinued"
          class="accent-blue-600 w-4 h-4 mr-2"
          bind:checked={$form.size_specific_discontinued} />

          <label for="size_specific_discontinued" class="inline-block font-medium">
            Discontinued
          </label>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Select if this size is discontinued 
          </p>
      </div>
      {#if $errors.size_specific_discontinued}
        <span class="text-red-600 text-xs">{$errors.size_specific_discontinued}</span>
      {/if}
    </div>

    <fieldset>
      <div class="flex items-center justify-between mb-4">
        <legend class="block font-medium">Purchase Links (Optional)</legend>
        <button
          type="button"
          onclick={addPurchaseLink}
          class="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
          + Add Link
        </button>
      </div>

      {#if $form.purchase_links && $form.purchase_links.length > 0}
        <div class="space-y-6">
          {#each $form.purchase_links as link, index}
            <div
              class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium text-gray-700 dark:text-gray-300">
                  Purchase Link {index + 1}
                </h4>
                  <button
                    type="button"
                    onclick={() => removePurchaseLink(index)}
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label for="store_id_{index}" class="block font-medium mb-1 text-sm"
                    >Store ID</label>
                  <input
                    id="store_id_{index}"
                    type="text"
                    name="purchase_links[{index}].store_id"
                    placeholder="amazon-us"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    bind:value={link.store_id} />
                  {#if $errors.purchase_links?.[index]?.store_id}
                    <span class="text-red-600 text-xs"
                      >{$errors.purchase_links[index].store_id}</span>
                  {/if}
                </div>

                <div>
                  <label for="url_{index}" class="block font-medium mb-1 text-sm"
                    >Purchase URL</label>
                  <input
                    id="url_{index}"
                    type="url"
                    name="purchase_links[{index}].url"
                    placeholder="https://www.store.com/product/12345"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    bind:value={link.url} />
                  {#if $errors.purchase_links?.[index]?.url}
                    <span class="text-red-600 text-xs">{$errors.purchase_links[index].url}</span>
                  {/if}
                </div>

                <div class="flex items-center gap-2">
                  <input
                    id="affiliate_{index}"
                    type="checkbox"
                    name="purchase_links[{index}].affiliate"
                    class="accent-blue-600 w-4 h-4"
                    bind:checked={link.affiliate} />
                  <label for="affiliate_{index}" class="font-medium text-sm">Affiliate link</label>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    id="spool_refill_{index}"
                    type="checkbox"
                    name="purchase_links[{index}].spool_refill"
                    class="accent-blue-600 w-4 h-4"
                    bind:checked={link.spool_refill} />
                  <label for="spool_refill_{index}" class="font-medium text-sm">Is spool refill</label>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="ships_from_{index}" class="block font-medium mb-1 text-sm"
                      >Ships from</label>
                    <input
                      id="ships_from_{index}"
                      type="text"
                      name="purchase_links[{index}].ships_from"
                      placeholder="USA"
                      class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      bind:value={link.ships_from} />
                  </div>

                  <div>
                    <label for="ships_to_{index}" class="block font-medium mb-1 text-sm"
                      >Ships to</label>
                    <input
                      id="ships_to_{index}"
                      type="text"
                      name="purchase_links[{index}].ships_to"
                      placeholder="Worldwide"
                      class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      bind:value={link.ships_to} />
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-4 text-gray-500 dark:text-gray-400">
          <p class="text-sm">No purchase links added yet.</p>
          <p class="text-xs mt-1">Click "Add Link" to add purchase information.</p>
        </div>
      {/if}
    </fieldset>

    <button
      type="submit"
      class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors">
      {formType === 'edit' ? 'Save' : 'Create'}
    </button>
  </form>
</div>
