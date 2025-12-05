<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { NotificationDropdown } from '$lib/components/ui';
	import { Menu, Search, LogOut, User, Settings } from 'lucide-svelte';

	interface Props {
		toggleSidebar?: () => void;
		user?: {
			name: string;
			role?: string;
			avatar?: string | null;
		};
	}

	let { toggleSidebar, user = { name: 'Admin', role: 'admin' } }: Props = $props();

	// Mock notifications - in real app, fetch from server
	const notifications = $state([
		{
			id: '1',
			title: 'Donasi Baru',
			message: 'Rp 500.000 dari Hamba Allah',
			type: 'success' as const,
			isRead: false,
			createdAt: new Date(Date.now() - 5 * 60 * 1000)
		},
		{
			id: '2',
			title: 'Kegiatan Mendatang',
			message: 'Pengajian Rutin besok jam 08:00',
			type: 'info' as const,
			isRead: false,
			createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
		},
		{
			id: '3',
			title: 'Laporan Keuangan',
			message: 'Laporan November telah dibuat',
			type: 'info' as const,
			isRead: true,
			createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
		}
	]);

	function handleMarkAsRead(id: string) {
		const notification = notifications.find((n) => n.id === id);
		if (notification) {
			notification.isRead = true;
		}
	}

	function handleMarkAllAsRead() {
		notifications.forEach((n) => (n.isRead = true));
	}

	// Get initials for avatar
	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<nav class="navbar bg-base-200 sticky top-0 z-50 border-b border-base-300 px-4">
	<!-- Left: Menu toggle (mobile) + Logo -->
	<div class="navbar-start gap-2">
		<!-- Hamburger menu button (mobile only) -->
		<button
			type="button"
			class="btn btn-ghost btn-square lg:hidden"
			onclick={toggleSidebar}
			aria-label="Toggle menu"
		>
			<Menu class="w-5 h-5" />
		</button>

		<!-- Logo (visible on mobile) -->
		<a href="/dashboard" class="btn btn-ghost text-xl font-bold text-primary lg:hidden">
			<span>🕌</span>
			<span class="hidden sm:inline">MiniMasjid</span>
		</a>
	</div>

	<!-- Center: Search (hidden on mobile) -->
	<div class="navbar-center hidden md:flex">
		<div class="relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
			<input
				type="text"
				placeholder="Cari..."
				class="input input-sm bg-base-100 pl-10 w-64 focus:w-80 transition-all duration-300"
			/>
		</div>
	</div>

	<!-- Right: Notifications + Theme + User -->
	<div class="navbar-end gap-1">
		<!-- Notifications -->
		<NotificationDropdown
			{notifications}
			onMarkAsRead={handleMarkAsRead}
			onMarkAllAsRead={handleMarkAllAsRead}
		/>

		<!-- Theme Toggle -->
		<ThemeToggle />

		<!-- User Dropdown -->
		<div class="dropdown dropdown-end">
			<button
				type="button"
				class="btn btn-ghost btn-circle avatar"
				aria-label="User menu"
				aria-haspopup="true"
			>
				<div
					class="w-10 h-10 rounded-full bg-primary text-primary-content grid place-items-center ring-2 ring-base-300"
				>
					{#if user.avatar}
						<img src={user.avatar} alt={user.name} class="rounded-full" />
					{:else}
						<span class="text-sm font-bold">{getInitials(user.name)}</span>
					{/if}
				</div>
			</button>

			<div
				class="dropdown-content mt-3 w-64 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50"
			>
				<!-- User Info -->
				<div class="p-4 border-b border-base-200">
					<p class="font-semibold">{user.name}</p>
					{#if user.role}
						<span class="badge badge-primary badge-sm mt-1">{user.role}</span>
					{/if}
				</div>

				<!-- Menu Items -->
				<ul class="menu p-2">
					<li>
						<a href="/profile" class="flex items-center gap-3">
							<User class="w-4 h-4" />
							<span>Profil Saya</span>
						</a>
					</li>
					<li>
						<a href="/settings/masjid" class="flex items-center gap-3">
							<Settings class="w-4 h-4" />
							<span>Pengaturan</span>
						</a>
					</li>
				</ul>

				<!-- Logout -->
				<div class="p-2 border-t border-base-200">
					<form action="/auth/logout" method="POST">
						<button type="submit" class="btn btn-ghost btn-sm w-full justify-start text-error">
							<LogOut class="w-4 h-4" />
							<span>Keluar</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</nav>
