<script>
  let { id, title, description, placeholder, errorVar, formVar, required = false } = $props();
</script>

<div class="mb-4">
  <label for={id} class="block font-medium mb-1">
    {title}
    {#if required}
      <span class="text-red-500">*</span>
    {/if}
  </label>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
    {description}
  </p>
  <div class="flex items-center gap-3">
    <input
      id={id}
      type="color"
      aria-required="true"
      aria-describedby={`${id}-help`}
      class="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
      aria-invalid={errorVar ? 'true' : undefined}
      bind:value={formVar}
      style="padding:0;" />
    <input
      type="text"
      class="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1"
      bind:value={formVar}
      maxlength="7"
      placeholder={placeholder} />
  </div>
  {#if errorVar}
    <span class="text-red-600 text-xs">{errorVar}</span>
  {/if}
</div>