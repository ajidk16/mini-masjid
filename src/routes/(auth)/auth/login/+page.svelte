<script lang="ts">
	import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { loginSchema } from '$lib/schemas';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { page } from '$app/state';

	const { form, errors, constraints, enhance, delayed, message } = superForm(page.data.form, {
		validators: valibotClient(loginSchema)
	});

	let showPassword = $state(false);
</script>

<div class="min-h-screen flex bg-base-100">
	<!-- Left Side: Branding (Hidden on mobile) -->
	<div
		class="hidden lg:flex lg:w-1/2 bg-primary text-primary-content flex-col justify-between p-12 relative overflow-hidden"
	>
		<div class="relative z-10">
			<a href="/" class="flex items-center gap-3 text-2xl font-bold">
				<span class="text-4xl">🕌</span>
				<span>TadBeer</span>
			</a>
		</div>

		<div class="relative z-10 max-w-md">
			<h2 class="text-4xl font-bold mb-6">Welcome Back.</h2>
			<p class="text-lg opacity-90">
				Sign in to access your dashboard and manage your masjid activities.
			</p>
		</div>

		<div class="relative z-10 text-sm opacity-75">
			&copy; {new Date().getFullYear()} TadBeer. All rights reserved.
		</div>

		<div class="absolute inset-0 opacity-10 pattern-islamic"></div>
	</div>

	<!-- Right Side: Login Form -->
	<div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center lg:text-left">
				<h1 class="text-3xl font-bold">Sign In</h1>
				<p class="text-base-content/60 mt-2">Enter your credentials to access your account.</p>
			</div>

			{#if $message}
				<div class="alert alert-error">
					<AlertCircle class="w-5 h-5" />
					<span>{$message}</span>
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-5">
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
						<label for="" class="label">
							<span class="label-text-alt text-error">{$errors.email}</span>
						</label>
					{/if}
				</div>

				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text font-medium">Password</span>
					</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							name="password"
							bind:value={$form.password}
							aria-invalid={$errors.password ? 'true' : undefined}
							class="input input-bordered w-full pr-10 {$errors.password ? 'input-error' : ''}"
							{...$constraints.password}
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
					{#if $errors.password}
						<label for="password" class="label">
							<span class="label-text-alt text-error">{$errors.password}</span>
						</label>
					{/if}
					<label for="" class="label">
						<a href="/auth/forgot-password" class="label-text-alt link link-primary">
							Forgot password?
						</a>
					</label>
				</div>

				<button type="submit" class="btn btn-primary w-full" disabled={$delayed}>
					{#if $delayed}
						<span class="loading loading-spinner loading-sm"></span>
						Signing in...
					{:else}
						Sign In <LogIn class="w-4 h-4 ml-2" />
					{/if}
				</button>
			</form>

			<div class="text-center text-sm">
				<span class="text-base-content/60">Don't have an account?</span>
				<a
					href="/auth/register"
					class="link link-primary font-medium no-underline hover:underline ml-1"
				>
					Create account
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.pattern-islamic {
		background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
		background-size: 20px 20px;
	}
</style>
