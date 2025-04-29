<script lang="ts">
  import CreateNew from '$lib/components/createNew.svelte';
  import DownloadBtn from '$lib/components/downloadBtn.svelte';
  import EditModal from '$lib/components/editModal.svelte';
  import FilamentForm from '$lib/components/filamentForm.svelte';
  import FilamentItem from '$lib/components/filamentItem.svelte';
  import FilamentVariantForm from '$lib/components/filamentVariantForm.svelte';
  import { superForm } from 'sveltekit-superforms';
  const { data } = $props();
  const colorKeys = Object.keys(data.filamentData.colors ?? {});

  const { form, errors, message, enhance } = superForm(
    data.filamentForm, {
      resetForm: false
    }
  )

  const { form: filamentVariantForm, errors: filamentVariantErrors, message: filamentVariantMessage, enhance: filamentVariantEnhance } = superForm(
    data.filamentVariantForm, {
      resetForm: false
    }
  )
</script>

<section class="max-w-4xl mx-auto px-4 py-12 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100">
  <h1 class="text-3xl font-bold mb-4">

    Filament: {data.filamentData.name}
  </h1>
  <EditModal>
    <FilamentForm
    form={form}
    errors={errors}
    message={message}
    brandName={data.brandData.name}
    enhance={enhance}
    formType={"edit"} />
  </EditModal>

  <h2 class="text-2xl font-semibold mb-4">Colors & Sizes</h2>
  <div class="space-y-6">
    <CreateNew>
      <FilamentVariantForm
        form={form}
        errors={errors}
        message={message}
        brandName={data.brandData.name}
        materialName={data.materialData.name}
        filamentName={data.filamentData.name}
        enhance={enhance}
        formType={"create"} />
    </CreateNew>
    {#each colorKeys as colorKey}
      {#if data.filamentData.colors[colorKey]}
        <FilamentItem color={data.filamentData.colors[colorKey]} brandName={data.brandData.name} materialName={data.materialData.name} filamentName={data.filamentData.name} />
      {/if}
    {/each}
  </div>
</section>