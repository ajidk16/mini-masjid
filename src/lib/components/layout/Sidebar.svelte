<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		LayoutDashboard,
		Wallet,
		Calendar,
		Users,
		Heart,
		Package,
		Megaphone,
		Settings,
		ChevronDown
	} from 'lucide-svelte';

	interface MenuChild {
		href: string;
		label: string;
	}

	interface MenuItem {
		href?: string;
		label: string;
		icon: any;
		children?: MenuChild[];
	}

	const menuItems: MenuItem[] = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{
			label: 'Keuangan',
			icon: Wallet,
			children: [
				{ href: '/keuangan', label: 'Overview' },
				{ href: '/keuangan/pemasukan', label: 'Pemasukan' },
				{ href: '/keuangan/pengeluaran', label: 'Pengeluaran' },
				{ href: '/keuangan/laporan', label: 'Laporan' }
			]
		},
		{ href: '/kegiatan', label: 'Kegiatan', icon: Calendar },
		{ href: '/jamaah', label: 'Jamaah', icon: Users },
		{ href: '/donasi', label: 'Donasi', icon: Heart },
		{ href: '/inventaris', label: 'Inventaris', icon: Package },
		{ href: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
	];

	// Track expanded submenus
	let expandedMenus = $state<Set<string>>(new Set());

	function isActive(href: string): boolean {
		if (href === '/dashboard') {
			return page.url.pathname === '/dashboard';
		}
		return page.url.pathname.startsWith(href);
	}

	function isParentActive(item: MenuItem): boolean {
		if (item.children) {
			return item.children.some((child) => isActive(child.href));
		}
		return false;
	}

	function toggleSubmenu(label: string) {
		if (expandedMenus.has(label)) {
			expandedMenus.delete(label);
		} else {
			expandedMenus.add(label);
		}
		expandedMenus = new Set(expandedMenus);
	}

	function isExpanded(label: string): boolean {
		return expandedMenus.has(label);
	}

	// Auto-expand active parent menu on mount (one-time only)
	onMount(() => {
		menuItems.forEach((item) => {
			if (item.children && isParentActive(item)) {
				expandedMenus.add(item.label);
			}
		});
		expandedMenus = new Set(expandedMenus);
	});
</script>

<aside class="bg-base-200 w-64 min-h-full flex flex-col">
	<!-- Logo -->
	<div class="p-4 border-b border-base-300">
		<a href="/dashboard" class="flex items-center gap-3 text-xl font-bold text-primary">
			<span class="text-2xl">🕌</span>
			<span>MiniMasjid</span>
		</a>
	</div>

	<!-- Menu -->
	<nav class="flex-1 p-3 overflow-y-auto">
		<ul class="menu gap-1 w-full">
			{#each menuItems as item}
				{@const Icon = item.icon}
				<li>
					{#if item.children}
						<!-- Menu with submenu -->
						<button
							type="button"
							class="flex items-center justify-between w-full rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-base-300 {isParentActive(
								item
							)
								? 'bg-primary/10 text-primary'
								: ''}"
							onclick={() => toggleSubmenu(item.label)}
							aria-expanded={isExpanded(item.label)}
						>
							<span class="flex items-center gap-3">
								<Icon class="w-5 h-5" />
								<span class="font-medium">{item.label}</span>
							</span>
							<ChevronDown
								class="w-4 h-4 transition-transform duration-200 {isExpanded(item.label)
									? 'rotate-180'
									: ''}"
							/>
						</button>

						<!-- Submenu -->
						{#if isExpanded(item.label)}
							<ul class="ml-4 mt-1 space-y-1 border-l-2 border-base-300 pl-3">
								{#each item.children as child}
									<li>
										<a
											href={child.href}
											class="block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-base-300 {isActive(
												child.href
											)
												? 'bg-primary/10 text-primary font-medium'
												: ''}"
											aria-current={isActive(child.href) ? 'page' : undefined}
										>
											{child.label}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					{:else if item.href}
						<!-- Simple menu item -->
						<a
							href={item.href}
							class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-base-300 {isActive(
								item.href
							)
								? 'bg-primary/10 text-primary font-medium'
								: ''}"
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							<Icon class="w-5 h-5" />
							<span>{item.label}</span>
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Footer -->
	<div class="p-4 border-t border-base-300">
		<p class="text-xs text-base-content/50">© 2025 MiniMasjid</p>
		<p class="text-xs text-base-content/40">v1.0.0</p>
	</div>
</aside>
