<script lang="ts">
  let { form, errors, message, enhance, formType } = $props();
</script>

<div
  class="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-gray-900 dark:text-gray-100">
  <form method="POST" use:enhance action="?/updateSize" class="space-y-5">
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

    <div class="flex items-center gap-2">
      <input
        id="spool_refill"
        type="checkbox"
        name="spool_refill"
        class="accent-blue-600 w-4 h-4"
        bind:checked={$form.spool_refill} />
      <label for="spool_refill" class="font-medium"> Spool refill </label>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Check if this is a refill (filament only) without a spool
      </p>
    </div>
    {#if $errors.spool_refill}
      <span class="text-red-600 text-xs">{$errors.spool_refill}</span>
    {/if}

    <div>
      <label for="sku" class="block font-medium mb-1">SKU</label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Stock Keeping Unit - manufacturer's internal product code (optional)
      </p>
      <input
        id="sku"
        type="text"
        name="sku"
        placeholder="PLA-1000-BLK"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={$form.sku} />
      {#if $errors.sku}
        <span class="text-red-600 text-xs">{$errors.sku}</span>
      {/if}
    </div>

    <div>
      <label for="ean" class="block font-medium mb-1">EAN</label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        European Article Number - barcode identifier (optional)
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

    <fieldset>
      <legend class="block font-medium mb-1">Purchase Information (Optional)</legend>
      <div class="space-y-4">
        <div>
          <label for="store_id" class="block font-medium mb-1">Store ID</label>
          <input
            id="store_id"
            type="text"
            name="store_id"
            placeholder="amazon-us"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={$form.store_id} />
        </div>

        <div>
          <label for="url" class="block font-medium mb-1">Purchase URL</label>
          <input
            id="url"
            type="url"
            name="url"
            placeholder="https://www.store.com/product/12345"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={$form.url} />
        </div>

        <div class="flex items-center gap-2">
          <input
            id="affiliate"
            type="checkbox"
            name="affiliate"
            class="accent-blue-600 w-4 h-4"
            bind:checked={$form.affiliate} />
          <label for="affiliate" class="font-medium">Affiliate link</label>
        </div>

        <div>
          <label for="ships_from" class="block font-medium mb-1">Ships from</label>
          <input
            id="ships_from"
            type="text"
            name="ships_from"
            placeholder="USA"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={$form.ships_from} />
        </div>

        <div>
          <label for="ships_to" class="block font-medium mb-1">Ships to</label>
          <input
            id="ships_to"
            type="text"
            name="ships_to"
            placeholder="Worldwide"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={$form.ships_to} />
        </div>
      </div>
    </fieldset>

    <button
      type="submit"
      class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors">
      {formType === 'edit' ? 'Save Changes' : 'Add Size'}
    </button>
  </form>
</div>
