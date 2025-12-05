<script lang="ts">
	import { ArrowLeft, Bell, Mail, Smartphone } from 'lucide-svelte';

	let emailNotifications = $state(true);
	let pushNotifications = $state(true);
	let marketingEmails = $state(false);
	let securityAlerts = $state(true);
</script>

<div class="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
	<div class="flex items-center gap-4 mb-6">
		<a href="/notifications" class="btn btn-ghost btn-circle btn-sm">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold">Notification Settings</h1>
			<p class="text-base-content/60">Manage how you receive updates.</p>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm border border-base-200">
		<div class="card-body">
			<h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
				<Mail class="w-5 h-5" /> Email Notifications
			</h3>

			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-4">
					<input type="checkbox" class="toggle toggle-primary" bind:checked={emailNotifications} />
					<div>
						<span class="label-text font-medium block">Activity Updates</span>
						<span class="label-text-alt text-base-content/60"
							>Get notified about new donations, comments, and system events.</span
						>
					</div>
				</label>
			</div>

			<div class="divider my-2"></div>

			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-4">
					<input type="checkbox" class="toggle toggle-primary" bind:checked={marketingEmails} />
					<div>
						<span class="label-text font-medium block">Marketing & Tips</span>
						<span class="label-text-alt text-base-content/60"
							>Receive tips on how to manage your masjid effectively.</span
						>
					</div>
				</label>
			</div>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm border border-base-200">
		<div class="card-body">
			<h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
				<Smartphone class="w-5 h-5" /> Push Notifications
			</h3>

			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-4">
					<input type="checkbox" class="toggle toggle-primary" bind:checked={pushNotifications} />
					<div>
						<span class="label-text font-medium block">Real-time Alerts</span>
						<span class="label-text-alt text-base-content/60"
							>Receive instant notifications on your device.</span
						>
					</div>
				</label>
			</div>

			<div class="divider my-2"></div>

			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-4">
					<input type="checkbox" class="toggle toggle-primary" disabled checked={securityAlerts} />
					<div>
						<span class="label-text font-medium block">Security Alerts</span>
						<span class="label-text-alt text-base-content/60"
							>Critical security notifications cannot be disabled.</span
						>
					</div>
				</label>
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		<button class="btn btn-primary">Save Preferences</button>
	</div>
</div>
