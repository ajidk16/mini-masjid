<script lang="ts">
	import { Mail, ArrowLeft, AlertCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { forgotPasswordSchema } from '$lib/schemas';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: PageData } = $props();

	const { form, errors, constraints, enhance, delayed, message } = superForm(data.form, {
		validators: valibotClient(forgotPasswordSchema)
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold">Forgot Password?</h1>
			<p class="text-base-content/60 mt-2">
				Enter your email address and we'll send you a code to reset your password.
			</p>
		</div>

		{#if $message}
			<div class="alert alert-info">
				<AlertCircle class="w-5 h-5" />
				<span>{$message}</span>
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-6">
			<div class="form-control">
				<label class="label" for="email">
					<span class="label-text font-medium">Email Address</span>
				</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={$form.email}
					aria-invalid={$errors.email ? 'true' : undefined}
					placeholder="name@example.com"
					class="input input-bordered w-full {$errors.email ? 'input-error' : ''}"
					{...$constraints.email}
				/>
				{#if $errors.email}
					<label class="label">
						<span class="label-text-alt text-error">{$errors.email}</span>
					</label>
				{/if}
			</div>

			<button type="submit" class="btn btn-primary w-full" disabled={$delayed}>
				{#if $delayed}
					<span class="loading loading-spinner loading-sm"></span>
					Sending Code...
				{:else}
					Send Reset Code <Mail class="w-4 h-4 ml-2" />
				{/if}
			</button>
		</form>

		<div class="text-center text-sm">
			<a
				href="/auth/login"
				class="link link-hover flex items-center justify-center gap-2 text-base-content/60 hover:text-primary"
			>
				<ArrowLeft class="w-4 h-4" /> Back to Sign In
			</a>
		</div>
	</div>
</div>
