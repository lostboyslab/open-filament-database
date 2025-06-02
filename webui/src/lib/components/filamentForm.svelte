<script lang="ts">
  import SuperDebug from 'sveltekit-superforms';
  type formType = 'edit' | 'create';
  let { form, errors, message, enhance, formType: formType, brandName } = $props();

  const slicerOptions = [
    { key: 'generic', label: 'Generic' },
    { key: 'prusaslicer', label: 'PrusaSlicer' },
    { key: 'bambustudio', label: 'Bambu Studio' },
    { key: 'orcaslicer', label: 'OrcaSlicer' },
    { key: 'cura', label: 'Cura' },
  ];

  let selectedSlicer = $state('generic');
</script>

<div
  class="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-gray-900 dark:text-gray-100">
  <form
    method="POST"
    use:enhance
    action="?/filament"
    enctype="multipart/form-data"
    class="space-y-5">
    <div>
      <label for="name" class="block font-medium mb-1">Filament name</label>
      <input
        id="name"
        type="text"
        name="name"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={$errors.name ? 'true' : undefined}
        bind:value={$form.name} />

      {#if $errors.name}
        <span class="text-red-600 text-xs">{$errors.name}</span>
      {/if}
    </div>

    <div>
      <label for="diameter_tolerance" class="block font-medium mb-1">Diameter tolerance</label>
      <input
        id="diameter_tolerance"
        type="text"
        name="diameter_tolerance"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={$errors.diameter_tolerance ? 'true' : undefined}
        bind:value={$form.diameter_tolerance} />

      {#if $errors.diameter_tolerance}
        <span class="text-red-600 text-xs">{$errors.diameter_tolerance}</span>
      {/if}
    </div>

    <div>
      <label for="density" class="block font-medium mb-1">Density</label>
      <input
        id="density"
        type="text"
        name="density"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={$errors.density ? 'true' : undefined}
        bind:value={$form.density} />

      {#if $errors.density}
        <span class="text-red-600 text-xs">{$errors.density}</span>
      {/if}
    </div>

    <div>
      <label for="data_sheet_url" class="block font-medium mb-1">Data sheet URL</label>
      <input
        id="data_sheet_url"
        type="text"
        name="data_sheet_url"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={$errors.data_sheet_url ? 'true' : undefined}
        bind:value={$form.data_sheet_url} />

      {#if $errors.data_sheet_url}
        <span class="text-red-600 text-xs">{$errors.data_sheet_url}</span>
      {/if}
    </div>

    <div>
      <label for="safety_sheet_url" class="block font-medium mb-1">Safety sheet URL</label>
      <input
        id="safety_sheet_url"
        type="text"
        name="safety_sheet_url"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={$errors.safety_sheet_url ? 'true' : undefined}
        bind:value={$form.safety_sheet_url} />

      {#if $errors.safety_sheet_url}
        <span class="text-red-600 text-xs">{$errors.safety_sheet_url}</span>
      {/if}
    </div>
    <!-- 
    <div class="slicerSettings space-y-4">
      <label class="block font-medium mb-1">Slicer Type</label>
      <div class="flex flex-wrap gap-4 mb-4">
        {#each slicerOptions as option}
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="slicerType"
              value={option.key}
              bind:group={selectedSlicer}
            />
            {option.label}
          </label>
        {/each}
          {#if selectedSlicer === 'generic'}
          <fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
            <legend class="font-semibold text-base mb-2">Generic Slicer Settings</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="first_layer_bed_temp" class="block text-sm mb-1">First Layer Bed Temp</label>
                <input
                  id="first_layer_bed_temp"
                  type="number"
                  name="first_layer_bed_temp"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.first_layer_bed_temp}
                />
              </div>
              <div>
                <label for="first_layer_nozzle_temp" class="block text-sm mb-1">First Layer Nozzle Temp</label>
                <input
                  id="first_layer_nozzle_temp"
                  type="number"
                  name="first_layer_nozzle_temp"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.first_layer_nozzle_temp}
                />
              </div>
              <div>
                <label for="bed_temp" class="block text-sm mb-1">Bed Temp</label>
                <input
                  id="bed_temp"
                  type="number"
                  name="bed_temp"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.bed_temp}
                />
              </div>
              <div>
                <label for="nozzle_temp" class="block text-sm mb-1">Nozzle Temp</label>
                <input
                  id="nozzle_temp"
                  type="number"
                  name="nozzle_temp"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.nozzle_temp}
                />
              </div>
            </div>
          </fieldset>
          {/if}
          {#if selectedSlicer === 'prusaslicer' || selectedSlicer === 'cura' || selectedSlicer === 'bambustudio' || selectedSlicer === 'orcaslicer'} 
          <div>
            <label for="profile_path" class="block text-sm mb-1">Profile Path</label>
            <input
              id="profile_path"
              type="text"
              name="profile_path"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
              bind:value={$form.profile_path}
            />
          </div>
          <div>
            <label for="overrides" class="block text-sm mb-1">Overrides</label>
            <input
              id="overrides"
              type="text"
              name="overrides"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
              bind:value={$form.overrides}
            />
          </div>
          {/if}
      </div>
       -->

    <button
      type="submit"
      class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors">
      {formType === 'edit' ? 'Save' : 'Create'}
    </button>
    {#if formType === 'edit'}
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 mt-2 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-colors"
        aria-label="Delete brand"
        onclick={() => {
          console.log('DELETE');
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
        </svg>
        Delete
      </button>
    {/if}
    <SuperDebug data={$form} />
  </form>
</div>
