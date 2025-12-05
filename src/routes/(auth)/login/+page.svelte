<script lang="ts">
	import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let rememberMe = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		// Simulate API call
		setTimeout(() => {
			isLoading = false;
			// Handle success/error
		}, 1500);
	}
</script>

<div class="min-h-screen flex bg-base-100">
	<!-- Left Side: Branding & Illustration (Hidden on mobile) -->
	<div
		class="hidden lg:flex lg:w-1/2 bg-primary text-primary-content flex-col justify-between p-12 relative overflow-hidden"
	>
		<div class="relative z-10">
			<a href="/" class="flex items-center gap-3 text-2xl font-bold">
				<span class="text-4xl">🕌</span>
				<span>MiniMasjid</span>
			</a>
		</div>

		<div class="relative z-10 max-w-md">
			<h2 class="text-4xl font-bold mb-6">Manage Your Masjid with Ease & Barakah.</h2>
			<p class="text-lg opacity-90">
				Streamline operations, manage donations, and connect with your jamaah in one unified
				platform.
			</p>
		</div>

		<div class="relative z-10 text-sm opacity-75">
			&copy; {new Date().getFullYear()} MiniMasjid. All rights reserved.
		</div>

		<!-- Decorative Pattern Overlay -->
		<div class="absolute inset-0 opacity-10 pattern-islamic"></div>
	</div>

	<!-- Right Side: Login Form -->
	<div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center lg:text-left">
				<h1 class="text-3xl font-bold">Welcome Back</h1>
				<p class="text-base-content/60 mt-2">Sign in to your account to continue.</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="form-control">
					<label class="label" for="email">
						<span class="label-text font-medium">Email Address</span>
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="name@example.com"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text font-medium">Password</span>
					</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							bind:value={password}
							placeholder="Enter your password"
							class="input input-bordered w-full pr-10"
							required
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="w-5 h-5" />
							{:else}
								<Eye class="w-5 h-5" />
							{/if}
						</button>
					</div>
					<label for="forgot-password" class="label justify-end">
						<a
							href="/forgot-password"
							class="label-text-alt link link-primary no-underline hover:underline"
						>
							Forgot password?
						</a>
					</label>
				</div>

				<div class="form-control">
					<label class="label cursor-pointer justify-start gap-3">
						<input
							type="checkbox"
							bind:checked={rememberMe}
							class="checkbox checkbox-primary checkbox-sm"
						/>
						<span class="label-text">Remember me for 30 days</span>
					</label>
				</div>

				<button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
						Signing in...
					{:else}
						Sign In <ArrowRight class="w-4 h-4 ml-2" />
					{/if}
				</button>
			</form>

			<div class="text-center text-sm">
				<span class="text-base-content/60">Don't have an account?</span>
				<a href="/register" class="link link-primary font-medium no-underline hover:underline ml-1">
					Create an account
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	/* Simple pattern placeholder - can be replaced with SVG */
	.pattern-islamic {
		background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
		background-size: 20px 20px;
	}
</style>
