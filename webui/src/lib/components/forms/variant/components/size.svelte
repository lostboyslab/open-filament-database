<script>
  import DiscontinuedCheck from '$lib/components/forms/components/discontinuedCheck.svelte';
  import NumberField from '$lib/components/forms/components/numberField.svelte';
  import TextField from '$lib/components/forms/components/textField.svelte';
  import PurchaseLink from './purchaseLink.svelte';
  import { writable } from 'svelte/store';

  export let size, sizeIndex, removeSize, errors;
  
  let tempLinks = writable([]);
  
  function addPurchaseLink() {
    console.log(`Adding purchase link`);

    if (!$tempLinks) {
      console.log(`tempLinks reinit`);
      tempLinks = writable([]);
    }

    tempLinks.update(items => [
      ...items,
      { id: Math.max(0, ...items.map(i => i.id)) + 1, value: { store_id: undefined, url: undefined, affiliate: false }},
    ]);
  }

  function removePurchaseLink(index) {
    console.log(`Removing purchase link ${index + 1}`);
    tempLinks.update(items => items.filter((_, i) => i !== index));
  }

  if (size.purchase_links) {
    let test = structuredClone(size.purchase_links).map((x, i) => {
        return {
          id: i,
          value: structuredClone(x)
        }
    });
    tempLinks.set(structuredClone(test));
  }
  
  tempLinks.subscribe((value) => {
    size.purchase_links = value.map((x) => x.value);
  });
</script>

<div class="rounded-lg border border-gray-300 dark:border-gray-700 p-2 flex flex-col space-y-4">
  <div class="flex justify-between items-center">
    <h2 class="text-xl text-gray-600 dark:text-gray-400">
      <b>Size {sizeIndex + 1}</b>
    </h2>
    <button
      type="button"
      onclick={() => removeSize(sizeIndex)}
      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>

  <div class="flex space-x-2">
    <NumberField
      id="filament_weight_{sizeIndex}"
      title="Weight (g)"
      description='Net weight of the filament material (including spool)'
      placeholder="1000"
      bind:formVar={size.filament_weight}
      errorVar={$errors?.sizes?.[sizeIndex]?.filament_weight}
      required={true}
    />

    <NumberField
      id="diameter_{sizeIndex}"
      title="Diameter (mm)"
      description='Filament diameter (typically 1.75mm or 2.85mm)'
      placeholder="1.75"
      bind:formVar={size.diameter}
      errorVar={$errors?.sizes?.[sizeIndex]?.diameter}
      required={true}
    />
  </div>

  <div class="flex space-x-2">
    <NumberField
      id="empty_spool_weight_{sizeIndex}"
      title="Spool weight (g)"
      description='Weight of the empty spool without any filament'
      placeholder="250"
      bind:formVar={size.empty_spool_weight}
      errorVar={$errors?.sizes?.[sizeIndex]?.empty_spool_weight}
    />

    <NumberField
      id="spool_core_diameter_{sizeIndex}"
      title="Spool core diameter (mm)"
      description='The diameter of the core of the spool'
      placeholder="100"
      bind:formVar={size.spool_core_diameter}
      errorVar={$errors?.sizes?.[sizeIndex]?.spool_core_diameter}
    />
  </div>
  
  <div class="flex space-x-2">
    <TextField
      id="ean_{sizeIndex}"
      title="EAN"
      description="European Article Number - barcode identifier"
      placeholder="1234567890123"
      bind:formVar={size.ean}
      errorVar={$errors?.sizes?.[sizeIndex]?.ean}
    />

    <TextField
      id="article_number_{sizeIndex}"
      title="Article number"
      description="Article number - manufacturer's internal product code"
      placeholder="PLA-1000-BLK"
      bind:formVar={size.article_number}
      errorVar={$errors?.sizes?.[sizeIndex]?.article_number}
    />
  </div>

  <DiscontinuedCheck
    description="Select if this size is discontinued"
    bind:formVar={size.discontinued}
    errorVar={$errors?.sizes?.[sizeIndex]?.discontinued}
  />


  <fieldset>
    <div class="flex items-center justify-between mb-4">
      <legend class="block font-medium">Purchase Links</legend>
      <button
        type="button"
        onclick={addPurchaseLink}
        class="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
        + Add Link
      </button>
    </div>

    {#if $tempLinks && $tempLinks.length > 0}
      <div class="space-y-6">
        {#each $tempLinks as link, index (link.id)}
          <PurchaseLink
            bind:link={link.value}
            errors={errors}
            purchaseIndex={index}
            sizeIndex={sizeIndex}
            removePurchaseLink={() => removePurchaseLink(index)}
          />
        {/each}
      </div>
    {:else}
      <div class="text-center py-4 text-gray-500 dark:text-gray-400">
        <p class="text-sm">No purchase links added yet.</p>
        <p class="text-xs mt-1">Click "Add Link" to add purchase information.</p>
      </div>
    {/if}
  </fieldset>
</div>