<script lang="ts">
  import { browser } from '$app/environment';
  import EditModal from '$lib/components/editModal.svelte';
  import FilamentForm from '$lib/components/forms/filament/filamentForm.svelte';
  import MaterialForm from '$lib/components/forms/material/materialForm.svelte';
  import MaterialItem from '$lib/components/items/materialItem.svelte';
  import { isItemDeleted } from '$lib/pseudoDeleter.js';
  import { filamentMaterialSchema } from '$lib/validation/filament-material-schema.js';
  import { filamentVariantSchema } from '$lib/validation/filament-variant-schema';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  const { data } = $props();
  let filamentKeys = Object.keys(data.materialData.filaments ?? {});

  const filteredFilamentKeys = $derived(
    !browser
      ? filamentKeys
      : filamentKeys.filter(
          (filamentKey) =>
            !isItemDeleted(
              'filament',
              filamentKey,
              data.brandData.brand,
              data.materialData.material,
            ),
        ),
  );

  const {
    form: materialForm,
    errors: materialErrors,
    message: materialMessage,
    enhance: materialEnhance,
  } = superForm(data.materialForm, {
    dataType: 'json',
    resetForm: false,
    validationMethod: 'onblur',
    validators: zodClient(filamentMaterialSchema),
  });

  const {
    form: filamentForm,
    errors: filamentErrors,
    message: filamentMessage,
    enhance: filamentEnhance,
  } = superForm(data.filamentForm, {
    dataType: 'json',
    resetForm: false,
    validationMethod: 'onblur',
    validators: zodClient(filamentVariantSchema),
  });

  $effect(() => {
    filamentKeys = Object.keys(data.materialData.filaments ?? {});
  });
</script>

<svelte:head>
	<title>{data?.materialData?.material ? data.materialData.material : "Material"}</title>
	<meta name="description" content="This is an overview of {data?.materialData?.material ? data.materialData.material : "a Material"}"/>
</svelte:head>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
    Filaments for {data.materialData.material}
  </h1>
  <div class="btn-wrapper flex gap-2">
    <EditModal
      spanText={data?.materialData?.material ? `Edit ${data.materialData.material}` : ""}
    >
      <MaterialForm
        form={materialForm}
        errors={materialErrors}
        brandName={data.brandData.brand}
        formType={'edit'} />
    </EditModal>
    <EditModal
      btnType={'create'}
      spanText="Create filament"
    >
      <FilamentForm
        form={filamentForm}
        errors={filamentErrors}
        brandName={data.brandData.brand}
        materialName={data.materialData.material}
        formType={'create'} />
    </EditModal>
  </div>

  <div class="flex space-x-4 space-y-4 mt-2">
    {#key [filteredFilamentKeys, data.materialData.filaments]}
      {#each filteredFilamentKeys as filamentKey}
        {#if data.materialData.filaments[filamentKey]}
          <MaterialItem
            filament={data.materialData.filaments[filamentKey]}
            {filamentKey}
            brandName={data.brandData.brand}
            materialName={data.materialData.material} />
        {/if}
      {/each}
    {/key}
  </div>
</section>
