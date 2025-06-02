<script>
  import { fileProxy, superForm } from 'sveltekit-superforms';
  import { page } from '$app/state';
  import BrandForm from '$lib/components/brandForm.svelte';
  import BrandItem from '$lib/components/brandItem.svelte';
  import CreateNew from '$lib/components/createNew.svelte';
  let { data } = $props();
  const { form, errors, constraints, delayed, message } = superForm(data.form, {
    resetForm: false,
  });
  const brands = $derived(data.filamentData);
  $inspect(brands);
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Brands</h1>

  <CreateNew>
    <BrandForm {form} {errors} {constraints} {delayed} {message} formType={'create'} />
  </CreateNew>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each Object.entries(brands.brands) as [brandName, brandData]}
      <BrandItem {brandName} {brandData} />
    {/each}
  </div>
</section>
