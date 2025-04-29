<script lang="ts">
    import '../app.css';
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
    <main class="mt-4 px-4 max-w-5xl mx-auto">
        {@render children()}
    </main>

    <footer class="bg-gray-900 dark:bg-gray-800 text-white text-center p-3 mt-5 shadow-inner">
        © 2025 SimplyPrint – All rights reserved
    </footer>
</div>