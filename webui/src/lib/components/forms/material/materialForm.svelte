<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { pseudoDelete, pseudoUndoDelete } from '$lib/pseudoDeleter';
  import { pseudoEdit } from '$lib/pseudoEditor';
  import { realDelete } from '$lib/realDeleter';
  import { intProxy } from 'sveltekit-superforms';
  import Form from '../components/form.svelte';
  import TextField from '../components/textField.svelte';
  import NumberField from '../components/numberField.svelte';
  import SlicerSetting from './components/slicerSetting.svelte';
  import SubmitButton from '../components/submitButton.svelte';
  import DeleteButton from '../components/deleteButton.svelte';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { filamentMaterialSchema } from '$lib/validation/filament-material-schema';

  type formType = 'edit' | 'create';
  let { defaultForm, formType, brandName } = $props();
  
  const {
    form,
    errors,
    message,
    enhance,
  } = superForm(defaultForm, {
    dataType: 'json',
    resetForm: false,
    invalidateAll: false,
    clearOnSubmit: "none",
    validationMethod: 'onblur',
    validators: zodClient(filamentMaterialSchema),
    onResult: ({ result}) => {
      console.log(result);
    }
  });
  
  async function handleDelete() {
    if (
      confirm(
        `Are you sure you want to delete the material "${$form.material}"? This action cannot be undone.`,
      )
    ) {
      const isLocal = env.PUBLIC_IS_LOCAL === 'true';

      if (isLocal) {
        await realDelete('material', $form.material, brandName);
      } else {
        pseudoDelete('material', $form.material, brandName);
      }
    }
  }

  const slicerOptions = [
    { key: 'generic', label: 'Generic' },
    { key: 'prusaslicer', label: 'PrusaSlicer' },
    { key: 'bambustudio', label: 'Bambu Studio' },
    { key: 'orcaslicer', label: 'OrcaSlicer' },
    { key: 'cura', label: 'Cura' },
  ];

  let selectedSlicer: string[] = $state([]);

  // Proxies are needed for nested properties to work correctly with sveltekit-superforms
  const generic_flbt = intProxy(form, 'generic.first_layer_bed_temp');
  const generic_flnt = intProxy(form, 'generic.first_layer_nozzle_temp');
  const generic_bt = intProxy(form, 'generic.bed_temp');
  const generic_nt = intProxy(form, 'generic.nozzle_temp');

  const prusa_flbt = intProxy(form, 'prusa.first_layer_bed_temp');
  const prusa_flnt = intProxy(form, 'prusa.first_layer_nozzle_temp');
  const prusa_bt = intProxy(form, 'prusa.bed_temp');
  const prusa_nt = intProxy(form, 'prusa.nozzle_temp');

  const bambus_flbt = intProxy(form, 'bambus.first_layer_bed_temp');
  const bambus_flnt = intProxy(form, 'bambus.first_layer_nozzle_temp');
  const bambus_bt = intProxy(form, 'bambus.bed_temp');
  const bambus_nt = intProxy(form, 'bambus.nozzle_temp');

  const orca_flbt = intProxy(form, 'orca.first_layer_bed_temp');
  const orca_flnt = intProxy(form, 'orca.first_layer_nozzle_temp');
  const orca_bt = intProxy(form, 'orca.bed_temp');
  const orca_nt = intProxy(form, 'orca.nozzle_temp');

  const cura_flbt = intProxy(form, 'cura.first_layer_bed_temp');
  const cura_flnt = intProxy(form, 'cura.first_layer_nozzle_temp');
  const cura_bt = intProxy(form, 'cura.bed_temp');
  const cura_nt = intProxy(form, 'cura.nozzle_temp');
</script>

<Form
  endpoint="material"
  enhance={enhance}
>
  <TextField
    id="material"
    title="Material name"
    description='Enter the material type or category (e.g., "PLA", "PETG", "ABS", "TPU")'
    placeholder="e.g. PLA"
    formVar={$form.material}
    errorVar={$errors.material}
    required={true}
  />

  <NumberField
    id="default_max_dry_temperature"
    title="Default Max Dry Temperature"
    description='Default Maximum drying temperature (typically somewhere around 55-65°C)'
    placeholder="e.g. ±55-65°C"
    formVar={$form.default_max_dry_temperature}
    errorVar={$errors.default_max_dry_temperature}
  />

  <div class="slicerSettings space-y-4">
    <p class="block font-medium mb-1">Slicer Type</p>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
      Select which slicers you want to provide print settings for.
    </p>

    <div class="flex flex-wrap gap-4 mb-4">
      {#each slicerOptions as option}
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            value={option.key}
            bind:group={selectedSlicer}
            class="rounded border-gray-300 dark:border-gray-600" />
          {option.label}
        </label>
      {/each}
    </div>

    <!-- Generic Settings -->
    {#if selectedSlicer.includes('generic')}
      <SlicerSetting
        id_prefix="generic_"
        title="Generic Settings"
        tempOverrides={[
          {
            id: "first_layer_bed_temp",
            title: "First Layer Bed Temp (°C)",
            placeholder: "60",
            formVar: {generic_flbt},
          },
          {
            id: "first_layer_nozzle_temp",
            title: "First Layer Nozzle Temp (°C)",
            placeholder: "215",
            formVar: {generic_flnt},
          },
          {
            id: "bed_temp",
            title: "Bed Temp (°C)",
            placeholder: "60",
            formVar: {generic_bt},
          },
          {
            id: "nozzle_temp",
            title: "Nozzle Temp (°C)",
            placeholder: "210",
            formVar: {generic_nt},
          },
        ]}
        showOverrideLabel={false}
      />
    {/if}

    <!-- PrusaSlicer Settings -->
    {#if selectedSlicer.includes('prusaslicer')}
      <SlicerSetting
        id_prefix="prusa_"
        title="PrusaSlicer Settings"
        tempOverrides={[
          {
            id: "first_layer_bed_temp",
            title: "First Layer Bed Temp (°C)",
            placeholder: "60",
            formVar: {prusa_flbt},
          },
          {
            id: "first_layer_nozzle_temp",
            title: "First Layer Nozzle Temp (°C)",
            placeholder: "215",
            formVar: {prusa_flnt},
          },
          {
            id: "bed_temp",
            title: "Bed Temp (°C)",
            placeholder: "60",
            formVar: {prusa_bt},
          },
          {
            id: "nozzle_temp",
            title: "Nozzle Temp (°C)",
            placeholder: "210",
            formVar: {prusa_nt},
          },
        ]}
      >
        <TextField
          id="prusa_profile_name"
          title="Profile Name"
          description={null}
          placeholder="profiles/filament/PLA_Basic.ini"
          formVar={$form.prusa.profile_name}
          errorVar={null}
        />
      </SlicerSetting>
    {/if}

    <!-- Bambu Studio Settings -->
    {#if selectedSlicer.includes('bambustudio')}
      <SlicerSetting
        id_prefix="bambus"
        title="Bambu Studio Settings"
        tempOverrides={[
          {
            id: "first_layer_bed_temp",
            title: "First Layer Bed Temp (°C)",
            placeholder: "60",
            formVar: {bambus_flbt},
          },
          {
            id: "first_layer_nozzle_temp",
            title: "First Layer Nozzle Temp (°C)",
            placeholder: "215",
            formVar: {bambus_flnt},
          },
          {
            id: "bed_temp",
            title: "Bed Temp (°C)",
            placeholder: "60",
            formVar: {bambus_bt},
          },
          {
            id: "nozzle_temp",
            title: "Nozzle Temp (°C)",
            placeholder: "210",
            formVar: {bambus_nt},
          },
        ]}
      >
        <TextField
          id="bambus_profile_name"
          title="Profile Name"
          description={null}
          placeholder="profiles/filament/PLA_Basic.ini"
          formVar={$form.bambus.profile_name}
          errorVar={null}
        />
      </SlicerSetting>
    {/if}

    <!-- OrcaSlicer Settings -->
    {#if selectedSlicer.includes('orcaslicer')}
      <SlicerSetting
        id_prefix="orca"
        title="OrcaSlicer Settings"
        tempOverrides={[
          {
            id: "first_layer_bed_temp",
            title: "First Layer Bed Temp (°C)",
            placeholder: "60",
            formVar: {orca_flbt},
          },
          {
            id: "first_layer_nozzle_temp",
            title: "First Layer Nozzle Temp (°C)",
            placeholder: "215",
            formVar: {orca_flnt},
          },
          {
            id: "bed_temp",
            title: "Bed Temp (°C)",
            placeholder: "60",
            formVar: {orca_bt},
          },
          {
            id: "nozzle_temp",
            title: "Nozzle Temp (°C)",
            placeholder: "210",
            formVar: {orca_nt},
          },
        ]}
      >
        <TextField
          id="orca_profile_name"
          title="Profile Name"
          description={null}
          placeholder="profiles/filament/PLA_Basic.ini"
          formVar={$form.orca.profile_name}
          errorVar={null}
        />
      </SlicerSetting>
    {/if}

    <!-- Cura Settings -->
    {#if selectedSlicer.includes('cura')}
    <SlicerSetting
        id_prefix="cura"
        title="Cura Settings"
        tempOverrides={[
          {
            id: "first_layer_bed_temp",
            title: "First Layer Bed Temp (°C)",
            placeholder: "60",
            formVar: {cura_flbt},
          },
          {
            id: "first_layer_nozzle_temp",
            title: "First Layer Nozzle Temp (°C)",
            placeholder: "215",
            formVar: {cura_flnt},
          },
          {
            id: "bed_temp",
            title: "Bed Temp (°C)",
            placeholder: "60",
            formVar: {cura_bt},
          },
          {
            id: "nozzle_temp",
            title: "Nozzle Temp (°C)",
            placeholder: "210",
            formVar: {cura_nt},
          },
        ]}
      >
        <TextField
          id="cura_profile_name"
          title="Profile Name"
          description={null}
          placeholder="profiles/filament/PLA_Basic.ini"
          formVar={$form.cura.profile_name}
          errorVar={null}
        />
      </SlicerSetting>
    {/if}
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