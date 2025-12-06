<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { CheckCircle, AlertCircle } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { verifySchema } from '$lib/schemas';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	const { form, errors, constraints, enhance, delayed, message } = superForm(data.form, {
		validators: valibotClient(verifySchema)
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Verify Your Email</h1>
			<p class="text-base-content/60 mt-2">
				We sent a verification code to <span class="font-medium text-base-content"
					>{$form.email}</span
				>
			</p>
		</div>

		{#if $message}
			<div class="alert alert-error">
				<AlertCircle class="w-5 h-5" />
				<span>{$message}</span>
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="email" bind:value={$form.email} />

			<div class="form-control">
				<label class="label" for="otp">
					<span class="label-text font-medium">Verification Code</span>
				</label>
				<input
					type="text"
					id="otp"
					name="otp"
					bind:value={$form.otp}
					placeholder="123456"
					class="input input-bordered w-full text-center text-2xl tracking-widest {$errors.otp
						? 'input-error'
						: ''}"
					maxlength="6"
					{...$constraints.otp}
				/>
				{#if $errors.otp}
					<div class="label">
						<span class="label-text-alt text-error">{$errors.otp}</span>
					</div>
				{/if}
			</div>

			<button type="submit" class="btn btn-primary w-full" disabled={$delayed}>
				{#if $delayed}
					<span class="loading loading-spinner loading-sm"></span>
					Verifying...
				{:else}
					Verify Email <CheckCircle class="w-4 h-4 ml-2" />
				{/if}
			</button>
		</form>

		<div class="text-center text-sm">
			<span class="text-base-content/60">Didn't receive the code?</span>
			<button class="link link-primary font-medium no-underline hover:underline ml-1">
				Resend Code
			</button>
		</div>
	</div>
</div>
