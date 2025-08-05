<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { pseudoDelete, pseudoUndoDelete } from '$lib/pseudoDeleter';
  import { pseudoEdit } from '$lib/pseudoEditor';
  import { realDelete } from '$lib/realDeleter';
  import { redirect } from '@sveltejs/kit';
  import DeleteButton from '../components/deleteButton.svelte';
  import DiscontinuedCheck from '../components/discontinuedCheck.svelte';
  import Form from '../components/form.svelte';
  import NumberField from '../components/numberField.svelte';
  import SubmitButton from '../components/submitButton.svelte';
  import TextField from '../components/textField.svelte';

  type formType = 'edit' | 'create';
  let { form, errors, formType: formType, brandName, materialName } = $props();

  async function handleDelete() {
    if (
      confirm(
        `Are you sure you want to delete the filament "${$form.name}"? This action cannot be undone.`,
      )
    ) {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (isLocal) {
        await realDelete('filament', $form.name, brandName, materialName);
      } else {
        pseudoDelete('filament', $form.name, brandName, materialName);
      }
    }
  }

  const enhancedSubmit = () => {
    return async ({ result, update }) => {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (result.type === 'success' && !isLocal) {
        const filamentData = {
          name: $form.name,
        };

        pseudoEdit('filament', brandName, filamentData, materialName);
        pseudoUndoDelete('filament', $form.name);
        await invalidateAll();
      }

      await update();
    };
  };
</script>

<Form
  enhancedSubmit={enhancedSubmit}
  endpoint="filament"
>
  <TextField
    id="name"
    title="Filament name"
    description='Enter the specific name or type of this filament material (e.g., "PLA+", "PETG", "ABS Pro")'
    placeholder="e.g. PLA+"
    bind:formVar={$form.name}
    errorVar={$errors.name}
    required={true}
  />

  <NumberField
    id="diameter_tolerance"
    title="Diameter tolerance"
    description='Acceptable variation in filament diameter (typically ±0.02mm or ±0.03mm)'
    placeholder="e.g. 0.02"
    bind:formVar={$form.diameter_tolerance}
    errorVar={$errors.diameter_tolerance}
    required={true}
  />

  <NumberField
    id="density"
    title="Density"
    description='Material density in grams per cubic centimeter (g/cm³)'
    placeholder="e.g. 1.24"
    bind:formVar={$form.density}
    errorVar={$errors.density}
    required={true}
  />

  <NumberField
    id="max_dry_temperature"
    title="Max Dry Temperature"
    description='Maximum drying temperature (typically somewhere around 55-65°C)'
    placeholder="e.g. 55"
    bind:formVar={$form.max_dry_temperature}
    errorVar={$errors.max_dry_temperature}
  />

  <DiscontinuedCheck
    bind:formVar={$form.discontinued}
    errorVar={$errors.discontinued}
    description="Select if this filament is discontinued"
  />

  <TextField
    id="data_sheet_url"
    title="Data sheet URL"
    description='Link to technical data sheet with material specifications'
    placeholder="https://www.example.com/datasheet.pdf"
    bind:formVar={$form.data_sheet_url}
    errorVar={$errors.data_sheet_url}
  />

  <TextField
    id="safety_sheet_url"
    title="Safety sheet URL"
    description='Link to Material Safety Data Sheet (MSDS) for handling and safety information'
    placeholder="https://www.example.com/msds.pdf"
    bind:formVar={$form.safety_sheet_url}
    errorVar={$errors.safety_sheet_url}
  />

  <SubmitButton>
    {formType === 'edit' ? 'Save' : 'Create'}
  </SubmitButton>  

  {#if formType === 'edit'}
    <DeleteButton
      handleDelete={handleDelete}
    />
  {/if}
</Form>
