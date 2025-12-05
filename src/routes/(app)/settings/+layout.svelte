<script lang="ts">
	import { page } from '$app/state';
	import { Building2, Users, Shield, FileText, Settings, Menu } from 'lucide-svelte';

	let { children } = $props();

	const navItems = [
		{ href: '/settings/masjid', label: 'Profile Masjid', icon: Building2 },
		{ href: '/settings/users', label: 'User Management', icon: Users },
		{ href: '/settings/roles', label: 'Role Management', icon: Shield },
		{ href: '/settings/logs', label: 'Audit Logs', icon: FileText },
		{ href: '/settings/config', label: 'Configuration', icon: Settings }
	];

	let isMobileMenuOpen = $state(false);
</script>

<div class="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] gap-6 p-4 md:p-6">
	<!-- Mobile Navigation Toggle -->
	<div
		class="md:hidden flex justify-between items-center bg-base-100 p-4 rounded-box shadow-sm mb-4"
	>
		<span class="font-bold text-lg">Settings Menu</span>
		<button class="btn btn-ghost btn-sm" onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}>
			<Menu class="w-5 h-5" />
		</button>
	</div>

	<!-- Sidebar Navigation -->
	<aside class="w-full md:w-64 shrink-0 {isMobileMenuOpen ? 'block' : 'hidden'} md:block">
		<div class="bg-base-100 rounded-box shadow-sm sticky top-20">
			<ul class="menu p-2 rounded-box w-full">
				<li
					class="menu-title text-xs font-semibold uppercase tracking-wider text-base-content/50 px-4 py-2"
				>
					Administration
				</li>
				{#each navItems as item}
					<li class="{page.url.pathname.startsWith(item.href) ? 'bg-primary/10 text-primary' : ''}">
						<a
							href={item.href}
							class="flex items-center gap-3 py-3 "
							onclick={() => (isMobileMenuOpen = false)}
						>
							<item.icon class="w-5 h-5" />
							<span>{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="flex-1 min-w-0">
		<div class="bg-base-100 rounded-box shadow-sm min-h-full p-6 animate-fadeIn">
			{@render children()}
		</div>
	</main>
</div>
