<script lang="ts">
  import { pseudoDelete } from '$lib/pseudoDeleter';
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

  $effect(() => {
    if (!$form.prusa_overrides) $form.prusa_overrides = {};
    if (!$form.bambus_overrides) $form.bambus_overrides = {};
    if (!$form.orca_overrides) $form.orca_overrides = {};
    if (!$form.cura_overrides) $form.cura_overrides = {};
  });

  let selectedSlicer: string[] = $state([]);
</script>

<div
  class="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 text-gray-900 dark:text-gray-100">
  <form
    method="POST"
    use:enhance
    action="?/material"
    enctype="multipart/form-data"
    class="space-y-5">
    <div>
      <label for="name" class="block font-medium mb-1"
        >Material name<span class="text-red-500">*</span></label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Enter the material type or category (e.g., "PLA", "PETG", "ABS", "TPU")
      </p>
      <input
        id="name"
        type="text"
        name="name"
        aria-required="true"
        aria-describedby="name-help"
        placeholder="e.g. PLA"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={$errors.name ? 'true' : undefined}
        bind:value={$form.name} />

      {#if $errors.name}
        <span class="text-red-600 text-xs">{$errors.name}</span>
      {/if}
    </div>

    <div class="slicerSettings space-y-4">
      <p class="block font-medium mb-1">Slicer Type</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Select which slicers you want to provide print settings for. Choose Generic for basic
        temperature settings that work across all slicers.
      </p>
      <div class="flex flex-wrap gap-4 mb-4">
        {#each slicerOptions as option}
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="slicerType"
              value={option.key}
              bind:group={selectedSlicer} />
            {option.label}
          </label>
        {/each}
        {#if selectedSlicer.includes('generic')}
          <fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
            <legend class="font-semibold text-base mb-2">Generic Slicer Settings</legend>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Basic temperature settings that work across different slicers
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="first_layer_bed_temp" class="block text-sm font-medium mb-1"
                  >First Layer Bed Temp (°C)</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Bed temperature for first layer adhesion
                </p>
                <input
                  id="first_layer_bed_temp"
                  type="number"
                  name="first_layer_bed_temp"
                  placeholder="e.g. 60"
                  aria-describedby="first-layer-bed-temp-help"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.first_layer_bed_temp} />
              </div>
              <div>
                <label for="first_layer_nozzle_temp" class="block text-sm font-medium mb-1"
                  >First Layer Nozzle Temp (°C)</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Nozzle temperature for first layer
                </p>
                <input
                  id="first_layer_nozzle_temp"
                  type="number"
                  name="first_layer_nozzle_temp"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.first_layer_nozzle_temp} />
              </div>
              <div>
                <label for="bed_temp" class="block text-sm font-medium mb-1">Bed Temp (°C)</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Standard bed temperature for remaining layers
                </p>
                <input
                  id="bed_temp"
                  type="number"
                  name="bed_temp"
                  placeholder="e.g. 60"
                  aria-describedby="bed-temp-help"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.bed_temp} />
              </div>
              <div>
                <label for="nozzle_temp" class="block text-sm font-medium mb-1"
                  >Nozzle Temp (°C)</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Standard nozzle temperature for printing
                </p>
                <input
                  id="nozzle_temp"
                  type="number"
                  name="nozzle_temp"
                  placeholder="e.g. 210"
                  aria-describedby="nozzle-temp-help"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.nozzle_temp} />
              </div>
            </div>
          </fieldset>
        {/if}
        {#if selectedSlicer.includes('prusaslicer')}
          <fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
            <legend class="font-semibold text-base mb-2">PrusaSlicer Settings</legend>
            <div class="space-y-4">
              <div>
                <label for="prusa_profile_path" class="block text-sm font-medium mb-1"
                  >Profile Path</label>
                <input
                  id="prusa_profile_path"
                  type="text"
                  name="prusa_profile_path"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.prusa_profile_path} />
              </div>
              <div>
                <h4 class="text-sm font-medium mb-2">Override Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="prusa_first_layer_bed_temp" class="block text-xs mb-1"
                      >First Layer Bed Temp (°C)</label>
                    <input
                      id="prusa_first_layer_bed_temp"
                      type="number"
                      name="prusa_first_layer_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.prusa_overrides.first_layer_bed_temp} />
                  </div>
                  <div>
                    <label for="prusa_first_layer_nozzle_temp" class="block text-xs mb-1"
                      >First Layer Nozzle Temp (°C)</label>
                    <input
                      id="prusa_first_layer_nozzle_temp"
                      type="number"
                      name="prusa_first_layer_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.prusa_overrides.first_layer_nozzle_temp} />
                  </div>
                  <div>
                    <label for="prusa_bed_temp" class="block text-xs mb-1">Bed Temp (°C)</label>
                    <input
                      id="prusa_bed_temp"
                      type="number"
                      name="prusa_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.prusa_overrides.bed_temp} />
                  </div>
                  <div>
                    <label for="prusa_nozzle_temp" class="block text-xs mb-1"
                      >Nozzle Temp (°C)</label>
                    <input
                      id="prusa_nozzle_temp"
                      type="number"
                      name="prusa_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.prusa_overrides.nozzle_temp} />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        {/if}
        {#if selectedSlicer.includes('bambustudio')}
          <fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
            <legend class="font-semibold text-base mb-2">Bambu Studio Settings</legend>
            <div class="space-y-4">
              <div>
                <label for="bambus_profile_path" class="block text-sm font-medium mb-1"
                  >Profile Path</label>
                <input
                  id="bambus_profile_path"
                  type="text"
                  name="bambus_profile_path"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.bambus_profile_path} />
              </div>
              <div>
                <h4 class="text-sm font-medium mb-2">Override Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="bambus_first_layer_bed_temp" class="block text-xs mb-1"
                      >First Layer Bed Temp (°C)</label>
                    <input
                      id="bambus_first_layer_bed_temp"
                      type="number"
                      name="bambus_first_layer_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.bambus_overrides.first_layer_bed_temp} />
                  </div>
                  <div>
                    <label for="bambus_first_layer_nozzle_temp" class="block text-xs mb-1"
                      >First Layer Nozzle Temp (°C)</label>
                    <input
                      id="bambus_first_layer_nozzle_temp"
                      type="number"
                      name="bambus_first_layer_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.bambus_overrides.first_layer_nozzle_temp} />
                  </div>
                  <div>
                    <label for="bambus_bed_temp" class="block text-xs mb-1">Bed Temp (°C)</label>
                    <input
                      id="bambus_bed_temp"
                      type="number"
                      name="bambus_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.bambus_overrides.bed_temp} />
                  </div>
                  <div>
                    <label for="bambus_nozzle_temp" class="block text-xs mb-1"
                      >Nozzle Temp (°C)</label>
                    <input
                      id="bambus_nozzle_temp"
                      type="number"
                      name="bambus_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.bambus_overrides.nozzle_temp} />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        {/if}
        {#if selectedSlicer.includes('orcaslicer')}
          <fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
            <legend class="font-semibold text-base mb-2">OrcaSlicer Settings</legend>
            <div class="space-y-4">
              <div>
                <label for="orca_profile_path" class="block text-sm font-medium mb-1"
                  >Profile Path</label>
                <input
                  id="orca_profile_path"
                  type="text"
                  name="orca_profile_path"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.orca_profile_path} />
              </div>
              <div>
                <h4 class="text-sm font-medium mb-2">Override Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="orca_first_layer_bed_temp" class="block text-xs mb-1"
                      >First Layer Bed Temp (°C)</label>
                    <input
                      id="orca_first_layer_bed_temp"
                      type="number"
                      name="orca_first_layer_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.orca_overrides.first_layer_bed_temp} />
                  </div>
                  <div>
                    <label for="orca_first_layer_nozzle_temp" class="block text-xs mb-1"
                      >First Layer Nozzle Temp (°C)</label>
                    <input
                      id="orca_first_layer_nozzle_temp"
                      type="number"
                      name="orca_first_layer_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.orca_overrides.first_layer_nozzle_temp} />
                  </div>
                  <div>
                    <label for="orca_bed_temp" class="block text-xs mb-1">Bed Temp (°C)</label>
                    <input
                      id="orca_bed_temp"
                      type="number"
                      name="orca_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.orca_overrides.bed_temp} />
                  </div>
                  <div>
                    <label for="orca_nozzle_temp" class="block text-xs mb-1"
                      >Nozzle Temp (°C)</label>
                    <input
                      id="orca_nozzle_temp"
                      type="number"
                      name="orca_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.orca_overrides.nozzle_temp} />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        {/if}
        {#if selectedSlicer.includes('cura')}
          <fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
            <legend class="font-semibold text-base mb-2">Cura Settings</legend>
            <div class="space-y-4">
              <div>
                <label for="cura_profile_path" class="block text-sm font-medium mb-1"
                  >Profile Path</label>
                <input
                  id="cura_profile_path"
                  type="text"
                  name="cura_profile_path"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                  bind:value={$form.cura_profile_path} />
              </div>
              <div>
                <h4 class="text-sm font-medium mb-2">Override Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="cura_first_layer_bed_temp" class="block text-xs mb-1"
                      >First Layer Bed Temp (°C)</label>
                    <input
                      id="cura_first_layer_bed_temp"
                      type="number"
                      name="cura_first_layer_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.cura_overrides.first_layer_bed_temp} />
                  </div>
                  <div>
                    <label for="cura_first_layer_nozzle_temp" class="block text-xs mb-1"
                      >First Layer Nozzle Temp (°C)</label>
                    <input
                      id="cura_first_layer_nozzle_temp"
                      type="number"
                      name="cura_first_layer_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.cura_overrides.first_layer_nozzle_temp} />
                  </div>
                  <div>
                    <label for="cura_bed_temp" class="block text-xs mb-1">Bed Temp (°C)</label>
                    <input
                      id="cura_bed_temp"
                      type="number"
                      name="cura_bed_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.cura_overrides.bed_temp} />
                  </div>
                  <div>
                    <label for="cura_nozzle_temp" class="block text-xs mb-1"
                      >Nozzle Temp (°C)</label>
                    <input
                      id="cura_nozzle_temp"
                      type="number"
                      name="cura_nozzle_temp"
                      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
                      bind:value={$form.cura_overrides.nozzle_temp} />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        {/if}
      </div>

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
          onclick={() => pseudoDelete('material', $form.name)}>
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
    </div>
  </form>
</div>
