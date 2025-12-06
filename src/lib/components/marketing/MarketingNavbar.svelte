<script lang="ts">
	import { Menu, X } from 'lucide-svelte';
	import { page } from '$app/state';

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	const navLinks = [
		{ href: '/', label: 'Beranda' },
		{ href: '/events', label: 'Kegiatan' },
		{ href: '/donation', label: 'Donasi' },
		{ href: '/inventory', label: 'Inventaris' },
		{ href: '/about', label: 'Tentang' }
		// { href: '/contact', label: 'Kontak' }
	];
	function isActive(href: string) {
		return (page.url.pathname as string) === href && href !== '#';
	}

	const user = $derived(page.data.profile);
</script>

<nav class="navbar fixed top-0 z-50 w-full border-b-0 shadow-sm glass">
	<div class="container mx-auto px-4">
		<div class="flex w-full items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 text-xl font-bold text-primary">
				<span class="text-2xl">🕌</span>
				<span>TadBeer</span>
			</a>

			<!-- Desktop Menu -->
			<div class="hidden items-center gap-8 md:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium text-base-content/70 transition-colors hover:text-primary"
						class:text-primary={isActive(link.href)}
					>
						{link.label}
					</a>
				{/each}
			</div>

			<!-- Desktop CTA -->
			<div class="hidden items-center gap-4 md:flex">
				{#if user}
					<a href="/admin/dashboard" class="btn btn-outline"> Dashboard </a>
				{:else}
					<a href="/auth/login" class="btn btn-outline"> Masuk </a>
					<a href="/auth/register" class="btn btn-primary text-white"> Daftar Sekarang </a>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="btn btn-ghost btn-square md:hidden"
				onclick={toggleMenu}
				aria-label="Toggle menu"
			>
				{#if isMenuOpen}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isMenuOpen}
	<div class="fixed inset-0 z-40 bg-base-100 px-4 pt-24 md:hidden">
		<div class="flex flex-col gap-4">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-lg font-medium text-base-content/70 transition-colors hover:text-primary"
					onclick={toggleMenu}
				>
					{link.label}
				</a>
			{/each}
			<div class="mt-4 flex flex-col gap-3">
				<a href="/auth/login" class="btn btn-outline w-full" onclick={toggleMenu}>Masuk</a>
				<a href="/auth/register" class="btn btn-primary w-full text-white" onclick={toggleMenu}>
					Daftar Sekarang
				</a>
			</div>
		</div>
	</div>
{/if}
