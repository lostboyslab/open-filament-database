<script>
  export let id, title, placeholder, formVar, required = false;;
</script>

<div>
  <label for={id} class="block font-medium mb-1 text-sm">
    {title}
    {#if required}
      <span class="text-red-500">*</span>
    {/if}
  </label>
  <input
    id={id}
    type="text"
    name={id}
    placeholder={placeholder}
    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    bind:value={formVar} />
</div>