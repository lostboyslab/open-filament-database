<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { pseudoDelete, pseudoUndoDelete } from '$lib/pseudoDeleter';
  import { pseudoEdit } from '$lib/pseudoEditor';
  import { realDelete } from '$lib/realDeleter';
  import { fileProxy } from 'sveltekit-superforms';
  import { stripOfIllegalChars } from '$lib/globalHelpers';
  import TextField from '../components/textField.svelte';
  import LogoUpload from './components/logoUpload.svelte';
  import DeleteButton from '../components/deleteButton.svelte';
  import Form from '../components/form.svelte';
  import SubmitButton from '../components/submitButton.svelte';

  type formType = 'edit' | 'create';
  let { form, errors, formType } = $props();
  
  const file = fileProxy(form, 'logo');

  async function handleDelete() {
    if (
      confirm(
        `Are you sure you want to delete the brand "${$form.brand}"? This action cannot be undone.`,
      )
    ) {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (isLocal) {
        await realDelete('brand', stripOfIllegalChars($form.brand));
      } else {
        pseudoDelete('brand', $form.brand);
      }
    }
  }

  const enhancedSubmit = () => {
    return async ({ result, update }) => {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (result.type === 'success' && !isLocal) {
        const brandData = {
          brand: $form.brand,
        };

        pseudoEdit('brand', $form.brand, brandData);
        pseudoUndoDelete('brand', $form.brand);
        await invalidateAll();
      }

      await update();
    };
  };
</script>

<Form
  enhancedSubmit={enhancedSubmit}
  endpoint="brand"
>
  <TextField
    id="brand"
    title="Brand Name"
    description='Enter the official name of the filament manufacturer (e.g., "Prusa", "Hatchbox")'
    placeholder="e.g. Prusa"
    formVar={$form.brand}
    errorVar={$errors.brand}
    required={true}
  />

  <TextField
    id="website"
    title="Website"
    description='Official website URL of the brand'
    placeholder="https://www.example.com"
    formVar={$form.website}
    errorVar={$errors.website}
    required={true}
  />

  <TextField
    id="origin"
    title="Origin"
    description='Country or region where the brand is based'
    placeholder="e.g. US, DK"
    formVar={$form.origin}
    errorVar={$errors.origin}
    required={true} 
  />

  {#if formType === 'create'}
    <LogoUpload
      id="logo"
      title="Logo"
      file={$file}
      errorVar={$errors.file}
      required={true}
    />
  {/if}

  <SubmitButton>
    {formType === 'edit' ? 'Save' : 'Create'}
  </SubmitButton>

  {#if formType === 'edit'}
    <DeleteButton handleDelete={handleDelete} />
  {/if}
</Form>