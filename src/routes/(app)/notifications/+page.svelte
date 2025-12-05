<script lang="ts">
	import { Bell, Check, Info, AlertTriangle, CheckCircle, Settings, Trash2 } from 'lucide-svelte';

	let notifications = $state([
		{
			id: 1,
			type: 'info',
			title: 'New Feature Available',
			message: 'You can now schedule recurring donations.',
			time: '2 hours ago',
			read: false
		},
		{
			id: 2,
			type: 'success',
			title: 'Donation Received',
			message: 'Received Rp 500.000 from Hamba Allah.',
			time: '5 hours ago',
			read: false
		},
		{
			id: 3,
			type: 'warning',
			title: 'Storage Limit',
			message: 'You are approaching your storage limit for media uploads.',
			time: '1 day ago',
			read: true
		},
		{
			id: 4,
			type: 'info',
			title: 'System Update',
			message: 'System maintenance scheduled for tonight at 02:00 AM.',
			time: '2 days ago',
			read: true
		},
		{
			id: 5,
			type: 'success',
			title: 'Campaign Goal Reached',
			message: 'Ramadhan Berbagi campaign has reached its goal!',
			time: '3 days ago',
			read: true
		}
	]);

	function markAsRead(id: number) {
		notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
	}

	function markAllRead() {
		notifications = notifications.map((n) => ({ ...n, read: true }));
	}

	function deleteNotification(id: number) {
		notifications = notifications.filter((n) => n.id !== id);
	}

	let unreadCount = $derived(notifications.filter((n) => !n.read).length);
</script>

<div class="max-w-3xl mx-auto space-y-6 p-4 md:p-6">
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold flex items-center gap-2">
				<Bell class="w-6 h-6" />
				Notifications
				{#if unreadCount > 0}
					<span class="badge badge-primary badge-sm align-top">{unreadCount}</span>
				{/if}
			</h1>
			<p class="text-base-content/60">Stay updated with latest activities.</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost btn-sm" onclick={markAllRead} disabled={unreadCount === 0}>
				<Check class="w-4 h-4 mr-1" />
				Mark all read
			</button>
			<a href="/notifications/settings" class="btn btn-ghost btn-sm btn-square">
				<Settings class="w-5 h-5" />
			</a>
		</div>
	</div>

	<div class="space-y-4">
		{#if notifications.length === 0}
			<div
				class="text-center py-12 text-base-content/50 bg-base-100 rounded-box border border-base-200"
			>
				<Bell class="w-12 h-12 mx-auto mb-3 opacity-20" />
				<p>No notifications yet.</p>
			</div>
		{:else}
			{#each notifications as notification (notification.id)}
				<div
					class="card bg-base-100 shadow-sm border border-base-200 transition-all hover:shadow-md"
					class:bg-base-200={!notification.read}
				>
					<div class="card-body p-4 flex-row gap-4 items-start">
						<div class="mt-1">
							{#if notification.type === 'info'}
								<div class="p-2 bg-info/10 text-info rounded-full"><Info class="w-5 h-5" /></div>
							{:else if notification.type === 'success'}
								<div class="p-2 bg-success/10 text-success rounded-full">
									<CheckCircle class="w-5 h-5" />
								</div>
							{:else if notification.type === 'warning'}
								<div class="p-2 bg-warning/10 text-warning rounded-full">
									<AlertTriangle class="w-5 h-5" />
								</div>
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex justify-between items-start">
								<h3
									class="font-semibold {notification.read
										? 'text-base-content/80'
										: 'text-base-content'}"
								>
									{notification.title}
								</h3>
								<span class="text-xs text-base-content/50 whitespace-nowrap ml-2"
									>{notification.time}</span
								>
							</div>
							<p class="text-sm text-base-content/70 mt-1">{notification.message}</p>
						</div>
						<div class="flex flex-col gap-1">
							{#if !notification.read}
								<button
									class="btn btn-ghost btn-xs btn-circle text-primary"
									onclick={() => markAsRead(notification.id)}
									title="Mark as read"
								>
									<div class="w-2 h-2 bg-primary rounded-full"></div>
								</button>
							{/if}
							<button
								class="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity"
								onclick={() => deleteNotification(notification.id)}
								title="Delete"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
