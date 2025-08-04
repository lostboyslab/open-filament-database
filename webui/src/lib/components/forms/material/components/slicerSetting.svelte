<script lang="ts">
  import NumberField from "../../components/numberField.svelte";
  type slicerField = {
    id: string,
    title: string,
    description: string,
    placeholder: string,
    formVar: any,
    errorVar: any
  };

  let { id_prefix, title, tempOverrides, children = null, showOverrideLabel=true } = $props();
</script>

<fieldset class="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
  <legend class="font-semibold text-base mb-2">
    {title}
  </legend>
  <div class="space-y-4">
    {#if children}
      {@render children()}
    {/if}

    {#if showOverrideLabel}
      <p class="text-lg font-bold mb-2">Temperature Overrides</p>
    {/if}
    <div class="grid grid-cols-2 gap-4">
      {#each tempOverrides as field}
        <NumberField
          id={`${id_prefix}${field.id}`}
          title={field.title}
          description={field.description}
          placeholder={field.placeholder}
          formVar={field.formVar}
          errorVar={field.errorVar}
        />
      {/each}
    </div>
    <!--<div>
      <p class="text-sm font-medium mb-2">Temperature Overrides</p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="prusa_first_layer_bed_temp" class="block text-xs mb-1"
            >First Layer Bed Temp (°C)</label>
          <input
            id="prusa_first_layer_bed_temp"
            type="number"
            name="prusa_first_layer_bed_temp"
            placeholder="60"
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
            bind:value={$prusa_flbt} />
        </div>
        <div>
          <label for="prusa_first_layer_nozzle_temp" class="block text-xs mb-1"
            >First Layer Nozzle Temp (°C)</label>
          <input
            id="prusa_first_layer_nozzle_temp"
            type="number"
            name="prusa_first_layer_nozzle_temp"
            placeholder="215"
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
            bind:value={$prusa_flnt} />
        </div>
        <div>
          <label for="prusa_bed_temp" class="block text-xs mb-1">Bed Temp (°C)</label>
          <input
            id="prusa_bed_temp"
            type="number"
            name="prusa_bed_temp"
            placeholder="60"
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
            bind:value={$prusa_bt} />
        </div>
        <div>
          <label for="prusa_nozzle_temp" class="block text-xs mb-1">Nozzle Temp (°C)</label>
          <input
            id="prusa_nozzle_temp"
            type="number"
            name="prusa_nozzle_temp"
            placeholder="210"
            class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm"
            bind:value={$prusa_nt} />
        </div>
      </div>
    </div>-->
  </div>
</fieldset>