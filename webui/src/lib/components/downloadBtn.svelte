<script lang="ts">
  function downloadColor(brand: string, material: string, filament: string, color: string) {
    const url = `/api/download/${encodeURIComponent(brand)}/${encodeURIComponent(material)}/${encodeURIComponent(filament)}/${encodeURIComponent(color)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  let { brandName, materialName, filamentName, colorKey } = $props();
</script>

<button
  type="button"
  class="flex items-center gap-2 p-2 mb-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300 shadow transition-colors"
  aria-label="Download"
  onclick={() => downloadColor(brandName, materialName, filamentName, colorKey)}
>
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-6-6m6 6l6-6" />
  </svg>
  <span class="text-sm font-medium">Download</span>
</button>