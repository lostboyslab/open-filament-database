<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { pseudoEdit } from '$lib/pseudoEditor';
  import { invalidateAll } from '$app/navigation';
  import { pseudoUndoDelete } from '$lib/pseudoDeleter';
  import { redirect } from '@sveltejs/kit';
  import { realDelete } from '$lib/realDeleter';
  import { pseudoDelete } from '$lib/pseudoDeleter';
  import DiscontinuedCheck from '../components/discontinuedCheck.svelte';
  import Form from '../components/form.svelte';
  import DeleteButton from '../components/deleteButton.svelte';
  import SubmitButton from '../components/submitButton.svelte';
  import TextField from '../components/textField.svelte';
  import HexPicker from './components/hexPicker.svelte';
  import Size from './components/size.svelte';
  import { traitsSchema } from '$lib/validation/filament-variant-schema';
  import { capitalizeFirstLetter } from '$lib/globalHelpers';
  import Trait from './components/trait.svelte';
  import { writable } from 'svelte/store';

  type formType = 'edit' | 'create';
  let { form, errors, formType, brandName, materialName, filamentName, colorData = null } = $props();

  async function handleDelete() {
    if (
      confirm(
        `Are you sure you want to delete the instance "${colorData.name}"? This action cannot be undone.`,
      )
    ) {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (isLocal) {
        await realDelete('instance', colorData.name, brandName, materialName, filamentName);
      } else {
        pseudoDelete('instance', colorData.name, brandName, materialName, filamentName);
      }
    }
  }

  // Function to add a new size 
  function addSize() {
    if (!tempSizes) {
      tempSizes = writable([]);
    }
    tempSizes.update(items => [
      ...items,
      { id: Math.max(0, ...items.map(i => i.id)) + 1, value: { filament_weight: undefined, diameter: undefined } },
    ]);
  }

  // Function to remove a size
  function removeSize(index: number) {
    tempSizes.update(items => items.filter((_, i) => i !== index));
  }

  const enhancedSubmit = ({ formData }) => {
    formData.set("serializedSizes", JSON.stringify($form.sizes));

    if ($form.traits) {
      let traitData = $form.traits;
      formData.set("serializedTraits", JSON.stringify(traitData));
    }

    return async ({ result, update }) => {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (result.type === 'success' && !isLocal) {

        const filamentData = {
          color_name: $form.color_name,
          color_hex: $form.color_hex,
          discontinued: $form.discontinued || undefined,
          traits: $form.traits || {},
        };
        pseudoEdit('filament', brandName, filamentData, materialName, filamentName);
        pseudoUndoDelete('filament', $form.name);
        await invalidateAll();
      }

      if (result?.redirect) {
        redirect(303, result.redirect);
      }

      await update();
    };
  };

  let tempTraits = {},
      tempSizes = writable([
        { id: 0, value: { filament_weight: undefined, diameter: undefined } }
      ]);
  $form.traits = {};
  $form.sizes = [];

  tempSizes.subscribe((value) => {
    $form.sizes = value;
  });

  // Init all keys in writable and real data, create subscriptions
  Object.keys(traitsSchema.shape).forEach((trait) => {
    tempTraits[trait] = writable(false);
    if (!$form.traits[trait]) {
      $form.traits[trait] = false;
    }
    tempTraits[trait].subscribe((value) => {
      $form.traits[trait] = value;
    });
  });

  $effect(() => {
    console.log($form.sizes);
  });
</script>

<Form
  enhancedSubmit={enhancedSubmit}
  endpoint="instance"
>
  <div class="flex space-x-4">
    <div class="w-3/5">
      <h3 class="text-xl font-bold mb-4">{formType === 'edit' ? 'Edit' : 'Create'} Color Variant</h3>

      <TextField
        id="color_name"
        title="Color name"
        description="Enter the official color name as specified by the manufacturer"
        placeholder="e.g. Galaxy Black"
        formVar={$form.color_name}
        errorVar={$errors.color_name}
        required={true}
      />

      <HexPicker
        id="color_hex"
        title="Color hex"
        description="Choose the color or enter the hex code that best represents this filament color"
        placeholder="#RRGGBB"
        formVar={$form.color_hex}
        errorVar={$errors.color_hex}
        required={true}
      />

      <DiscontinuedCheck
        formVar={$form.discontinued}
        errorVar={$errors.discontinued}
        description="Select if this colour/variant is discontinued"
      />

      <fieldset>
        <legend class="block font-medium mb-2">Material Traits</legend>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Select all special properties that apply to this filament variant
        </p>
        <div class="grid grid-cols-2 gap-4">
          {#each Object.keys(tempTraits) as trait}
            <Trait
              id={trait}
              title={capitalizeFirstLetter(trait)}
              formVar={tempTraits[trait]} />
          {/each}
        </div>
      </fieldset>
    </div>

    <fieldset class="w-2/5">
      {#if $tempSizes.length <= 0}
        <span class="text-red-600 text-xs">You need at least one size</span>
      {/if}

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold mb-4">
          {formType === 'edit' ? 'Edit' : 'Add'} Sizes
          <span class="text-red-500">*</span>
        </h3>
        <button
          type="button"
          onclick={addSize}
          class="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
          + Add Size
        </button>
      </div>

      {#if $tempSizes && $tempSizes.length > 0}
        <div class="space-y-5">
          {#each $tempSizes as size, index (size.id)}
            <Size
              bind:size={$tempSizes[index].value}
              sizeIndex={index}
              removeSize={removeSize}
            />
          {/each}
        </div>
      {:else}
        <div class="text-center py-4 text-gray-500 dark:text-gray-400">
          <p class="text-sm">No sizes added yet.</p>
          <p class="text-xs mt-1">Click "Add Size" to add sizes.</p>
        </div>
      {/if}
    </fieldset>
  </div>

  <SubmitButton>
    {formType === 'edit' ? 'Save' : 'Create'}
  </SubmitButton>

  {#if formType === 'edit'}
    <DeleteButton
      handleDelete={handleDelete}
    />
  {/if}
</Form>
