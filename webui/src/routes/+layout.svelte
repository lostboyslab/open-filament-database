<script lang="ts">
  import BackBtn from '$lib/components/backBtn.svelte';
  import Breadcrumb from '$lib/components/breadcrumb.svelte';
    import '../app.css';
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav class="sm:px-6 lg:px-8 flex gap-4 align-center">
            <BackBtn />
            <Breadcrumb />
        </nav>
        {@render children()}
    </main>

    <footer class="bg-gray-900 dark:bg-gray-800 text-white text-center p-3 mt-5 shadow-inner">
        © 2025 SimplyPrint – All rights reserved
    </footer>
</div>