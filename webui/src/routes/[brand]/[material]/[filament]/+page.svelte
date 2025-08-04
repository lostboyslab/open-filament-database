<script lang="ts">
  import DownloadBtn from '$lib/components/downloadBtn.svelte';
  import EditModal from '$lib/components/editModal.svelte';
  import FilamentForm from '$lib/components/forms/filament/filamentForm.svelte';
  import FilamentItem from '$lib/components/items/filamentItem.svelte';
  import VariantForm from '$lib/components/forms/variant/VariantForm.svelte';
  import { filamentSchema } from '$lib/validation/filament-schema.js';
  import { filamentVariantSchema } from '$lib/validation/filament-variant-schema.js';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { stripOfIllegalChars } from '$lib/globalHelpers.js';

  const { data } = $props();
  const colorKeys = Object.keys(data.filamentData.colors ?? {});

  const { form, errors, message, enhance } = superForm(data.filamentForm, {
    resetForm: false,
    validationMethod: 'onblur',
    validators: zodClient(filamentSchema),
  });

  const {
    form: variantForm,
    errors: variantErrors,
    message: variantMessage,
    enhance: variantEnhance,
  } = superForm(data.filamentVariantForm, {
    dataType: 'json',
    resetForm: false,
    validationMethod: 'onblur',
    validators: zodClient(filamentVariantSchema),
  });
</script>

<svelte:head>
	<title>{data?.filamentData?.name ? data.filamentData.name : "Filament"}</title>
	<meta name="description" content="This is an overview of {data?.filamentData?.name ? data.filamentData.name : "a Filament"}"/>
</svelte:head>

<section
  class="max-w-4xl mt-5 mx-auto px-4 py-12 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100">
  <h1 class="text-3xl font-bold mb-4">
    Filament: {data.filamentData.name}
  </h1>

  <EditModal>
    <FilamentForm
      form={form}
      errors={errors}
      brandName={stripOfIllegalChars(data.brandData.brand)}
      materialName={data.materialData.material}
      formType={'edit'} />
  </EditModal>

  <h2 class="text-2xl font-semibold mb-4">Colors & Sizes</h2>
  <div class="space-y-6">
    <div class="flex justify-between">
      <EditModal
      btnType={'create'}
    >
        <VariantForm
          form={variantForm}
          errors={variantErrors}
          brandName={stripOfIllegalChars(data.brandData.brand)}
          materialName={data.materialData.material}
          filamentName={data.filamentData.name}
          formType={'create'} />
      </EditModal>
      <DownloadBtn
        brandName={stripOfIllegalChars(data.brandData.brand)}
        materialName={data.materialData.material}
        filamentName={data.filamentData.name} />
    </div>

    {#each colorKeys as colorKey}
      {#if data.filamentData.colors[colorKey]}
        <FilamentItem
          color={data.filamentData.colors[colorKey]}
          brandName={stripOfIllegalChars(data.brandData.brand)}
          materialName={data.materialData.material}
          filamentName={data.filamentData.name} />
      {/if}
    {/each}
  </div>
</section>
