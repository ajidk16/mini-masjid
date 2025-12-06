<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		user?: {
			name: string;
			role?: string;
			avatar?: string | null;
		};
	}

	let { children, user }: Props = $props();

	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="drawer lg:drawer-open">
	<!-- Drawer toggle -->
	<input
		id="app-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={sidebarOpen}
		aria-label="Toggle sidebar"
	/>

	<!-- Main content area -->
	<div class="drawer-content flex flex-col min-h-screen bg-base-100">
		<!-- Navbar -->
		<Navbar {toggleSidebar} {user} />

		<!-- Page content -->
		<main class="flex-1 p-4 md:p-6 lg:p-8">
			<!-- Breadcrumbs -->
			<Breadcrumbs />

			<!-- Page content -->
			{@render children()}
		</main>

		<!-- Footer -->
		<footer class="p-4 border-t border-base-200 text-center text-xs text-base-content/50">
			<p>© 2025 TadBeer. Dibangun dengan ❤️ untuk umat.</p>
		</footer>
	</div>

	<!-- Sidebar -->
	<div class="drawer-side z-40">
		<!-- Overlay for mobile -->
		<label for="app-drawer" class="drawer-overlay" aria-label="Close sidebar"></label>

		<!-- Sidebar content -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div onclick={closeSidebar} class="h-full">
			<Sidebar />
		</div>
	</div>
</div>
