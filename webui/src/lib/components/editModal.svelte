<script lang="ts">
  let dialogElement: HTMLDialogElement | null = null;
  let { children } = $props();
</script>

<button
  type="button"
  onclick={() => dialogElement?.showModal()}
  class="flex items-center gap-2 p-2 mb-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300 shadow transition-colors"
  aria-label="Edit"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182l-11.25 11.25a2 2 0 0 1-.878.513l-4 1a.5.5 0 0 1-.606-.606l1-4a2 2 0 0 1 .513-.878l11.25-11.25z" />
  </svg>
  <span class="text-sm font-medium">Edit</span>

</button>

<dialog 
  bind:this={dialogElement} 
  class="w-full h-full bg-transparent p-4 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
>
  <div class="max-w-2xl w-full mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl text-gray-900 dark:text-gray-100">
    {@render children()}
  </div>
</dialog>