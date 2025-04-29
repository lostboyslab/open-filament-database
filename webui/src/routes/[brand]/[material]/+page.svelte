<script lang="ts">
  import EditModal from '$lib/components/editModal.svelte';
  import MaterialForm from '$lib/components/materialForm.svelte';
import MaterialItem from '$lib/components/MaterialItem.svelte';
  import { superForm } from 'sveltekit-superforms';
  const { data } = $props();
  const filamentKeys = Object.keys(data.materialData.filaments ?? {});
  const { form, errors, message, enhance } = superForm(
    data.materialForm, {
      resetForm: false
    }
  )

</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
    Filaments for {data.materialData.name}
  </h1>
  <EditModal>
    <MaterialForm 
      form={form}
      errors={errors}
      message={message}
      brandName={data.brandData.name}
      enhance={enhance}
      formType={"edit"} />
  </EditModal>

  <div class="space-y-8">      
    {#each filamentKeys as filamentKey}
      {#if data.materialData.filaments[filamentKey]}
        <MaterialItem
          filament={data.materialData.filaments[filamentKey]}
          filamentKey={filamentKey}
          brandName={data.brandData.name}
          materialName={data.materialData.name}
        />
      {/if}
    {/each}

  </div>
</section>