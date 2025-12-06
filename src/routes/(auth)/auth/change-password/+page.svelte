<script lang="ts">
	import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { changePasswordSchema } from '$lib/schemas';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	const { form, errors, constraints, enhance, delayed, message } = superForm(data.form, {
		validators: valibotClient(changePasswordSchema)
	});

	let showPassword = $state(false);
	let showConfirm = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Set New Password</h1>
			<p class="text-base-content/60 mt-2">Create a new secure password for your account.</p>
		</div>

		{#if $message}
			<div class="alert alert-error">
				<AlertCircle class="w-5 h-5" />
				<span>{$message}</span>
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="email" bind:value={$form.email} />
			<input type="hidden" name="otp" bind:value={$form.otp} />

			<div class="form-control">
				<label class="label" for="newPassword">
					<span class="label-text font-medium">New Password</span>
				</label>
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						id="newPassword"
						name="newPassword"
						bind:value={$form.newPassword}
						aria-invalid={$errors.newPassword ? 'true' : undefined}
						class="input input-bordered w-full pr-10 {$errors.newPassword ? 'input-error' : ''}"
						{...$constraints.newPassword}
					/>
					<button
						type="button"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-10"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeOff class="w-5 h-5" />
						{:else}
							<Eye class="w-5 h-5" />
						{/if}
					</button>
				</div>
				{#if $errors.newPassword}
					<label class="label">
						<span class="label-text-alt text-error">{$errors.newPassword}</span>
					</label>
				{/if}
			</div>

			<div class="form-control">
				<label class="label" for="confirmPassword">
					<span class="label-text font-medium">Confirm Password</span>
				</label>
				<div class="relative">
					<input
						type={showConfirm ? 'text' : 'password'}
						id="confirmPassword"
						name="confirmPassword"
						bind:value={$form.confirmPassword}
						aria-invalid={$errors.confirmPassword ? 'true' : undefined}
						class="input input-bordered w-full pr-10 {$errors.confirmPassword ? 'input-error' : ''}"
						{...$constraints.confirmPassword}
					/>
					<button
						type="button"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-10"
						onclick={() => (showConfirm = !showConfirm)}
					>
						{#if showConfirm}
							<EyeOff class="w-5 h-5" />
						{:else}
							<Eye class="w-5 h-5" />
						{/if}
					</button>
				</div>
				{#if $errors.confirmPassword}
					<label class="label">
						<span class="label-text-alt text-error">{$errors.confirmPassword}</span>
					</label>
				{/if}
			</div>

			<button type="submit" class="btn btn-primary w-full" disabled={$delayed}>
				{#if $delayed}
					<span class="loading loading-spinner loading-sm"></span>
					Resetting Password...
				{:else}
					Reset Password <Lock class="w-4 h-4 ml-2" />
				{/if}
			</button>
		</form>
	</div>
</div>
