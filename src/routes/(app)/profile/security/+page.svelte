<script lang="ts">
	import { ArrowLeft, Key, Lock, Save, Eye, EyeOff } from 'lucide-svelte';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let showCurrent = $state(false);
	let showNew = $state(false);
	let showConfirm = $state(false);
</script>

<div class="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
	<div class="flex items-center gap-4 mb-6">
		<a href="/profile" class="btn btn-ghost btn-circle btn-sm">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold">Security Settings</h1>
			<p class="text-base-content/60">Update your password and security preferences.</p>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm border border-base-200">
		<div class="card-body">
			<h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
				<Key class="w-5 h-5" /> Change Password
			</h3>

			<div class="space-y-4">
				<div class="form-control">
					<label class="label" for="current">
						<span class="label-text font-medium">Current Password</span>
					</label>
					<div class="relative">
						<input
							type={showCurrent ? 'text' : 'password'}
							id="current"
							bind:value={currentPassword}
							class="input input-bordered w-full pl-10 pr-10"
						/>
						<Lock
							class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-20"
						/>
						<button
							class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-20"
							onclick={() => (showCurrent = !showCurrent)}
							type="button"
						>
							{#if showCurrent}
								<EyeOff class="w-4 h-4" />
							{:else}
								<Eye class="w-4 h-4" />
							{/if}
						</button>
					</div>
				</div>

				<div class="divider"></div>

				<div class="form-control">
					<label class="label" for="new">
						<span class="label-text font-medium">New Password</span>
					</label>
					<div class="relative">
						<input
							type={showNew ? 'text' : 'password'}
							id="new"
							bind:value={newPassword}
							class="input input-bordered w-full pl-10 pr-10"
						/>
						<Lock
							class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-20"
						/>
						<button
							class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-20"
							onclick={() => (showNew = !showNew)}
							type="button"
						>
							{#if showNew}
								<EyeOff class="w-4 h-4" />
							{:else}
								<Eye class="w-4 h-4" />
							{/if}
						</button>
					</div>
					<label class="label">
						<span class="label-text-alt">Must be at least 8 characters long.</span>
					</label>
				</div>

				<div class="form-control">
					<label class="label" for="confirm">
						<span class="label-text font-medium">Confirm New Password</span>
					</label>
					<div class="relative">
						<input
							type={showConfirm ? 'text' : 'password'}
							id="confirm"
							bind:value={confirmPassword}
							class="input input-bordered w-full pl-10 pr-10"
						/>
						<Lock
							class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-20"
						/>
						<button
							class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-20"
							onclick={() => (showConfirm = !showConfirm)}
							type="button"
						>
							{#if showConfirm}
								<EyeOff class="w-4 h-4" />
							{:else}
								<Eye class="w-4 h-4" />
							{/if}
						</button>
					</div>
				</div>

				<div class="card-actions justify-end mt-4">
					<button
						class="btn btn-primary"
						disabled={!currentPassword || !newPassword || !confirmPassword}
					>
						<Save class="w-4 h-4 mr-2" /> Update Password
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
