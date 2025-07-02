<script lang="ts">
  import EditModal from '$lib/components/editModal.svelte';
  import FilamentVariantForm from '$lib/components/filamentVariantForm.svelte';
  import InstanceSizeForm from '$lib/components/instanceSizeForm.svelte';
  import InstanceVariantForm from '$lib/components/instanceVariantForm.svelte';
  import { filamentVariantSchema } from '$lib/validation/filament-schema';
  import { filamentSizeSchema } from '$lib/validation/filament-size-schema';

  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  const { data } = $props();

  const {
    form: variantForm,
    errors: variantErrors,
    message: variantMessage,
    enhance: variantEnhance,
  } = superForm(data.variantForm, {
    resetForm: false,
    validationMethod: 'onblur',
    dataType: 'json',
    validators: zodClient(filamentVariantSchema),
  });

  const {
    form: sizeForm,
    errors: sizeErrors,
    message: sizeMessage,
    enhance: sizeEnhance,
  } = superForm(data.sizeForm, {
    dataType: 'json',
    resetForm: false,
    validationMethod: 'onblur',
    validators: zodClient(filamentSizeSchema),
  });
</script>

<section
  class="max-w-4xl mt-5 mx-auto px-4 py-12 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100">
  <div class="flex items-center gap-4 mb-6">
    {#if data.colorData.variant?.color_hex}
      <span
        class="inline-block w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
        style="background-color: {data.colorData.variant.color_hex};"
        title={data.colorData.variant.color_hex}></span>
    {/if}
    <h1 class="text-3xl font-bold">
      {data.colorData.name}
    </h1>
    {#if data.colorData.variant?.color_hex}
      <span class="text-lg text-gray-500 dark:text-gray-400"
        >{data.colorData.variant.color_hex}</span>
    {/if}
  </div>

  <div class="mb-8">
    <p>Color</p>
    <EditModal>
      <InstanceVariantForm
        form={variantForm}
        errors={variantErrors}
        message={variantMessage}
        brandName={data.brandData.brand}
        materialName={data.materialData.name}
        filamentName={data.filamentData.name}
        enhance={variantEnhance}
        formType={'edit'} />
    </EditModal>
    <p>Size</p>
    <EditModal>
      <InstanceSizeForm
        form={sizeForm}
        errors={sizeErrors}
        message={sizeMessage}
        enhance={sizeEnhance}
        formType={'edit'} />
    </EditModal>
  </div>
</section>
