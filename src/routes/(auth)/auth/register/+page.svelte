<script lang="ts">
	import { Eye, EyeOff, UserPlus, ArrowRight, Check, X } from 'lucide-svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirm = $state(false);
	let isLoading = $state(false);
	let acceptedTerms = $state(false);

	// Password Strength Logic
	let strength = $derived.by(() => {
		let score = 0;
		if (password.length > 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		return score;
	});

	let strengthLabel = $derived.by(() => {
		if (password.length === 0) return '';
		if (strength <= 1) return 'Weak';
		if (strength === 2) return 'Medium';
		if (strength >= 3) return 'Strong';
		return '';
	});

	let strengthColor = $derived.by(() => {
		if (strength <= 1) return 'bg-error';
		if (strength === 2) return 'bg-warning';
		if (strength >= 3) return 'bg-success';
		return 'bg-base-300';
	});

	let passwordsMatch = $derived(password === confirmPassword && password.length > 0);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!passwordsMatch || !acceptedTerms) return;

		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 1500);
	}
</script>

<div class="min-h-screen flex bg-base-100">
	<!-- Left Side: Branding (Hidden on mobile) -->
	<div
		class="hidden lg:flex lg:w-1/2 bg-secondary text-secondary-content flex-col justify-between p-12 relative overflow-hidden"
	>
		<div class="relative z-10">
			<a href="/" class="flex items-center gap-3 text-2xl font-bold">
				<span class="text-4xl">🕌</span>
				<span>TadBeer</span>
			</a>
		</div>

		<div class="relative z-10 max-w-md">
			<h2 class="text-4xl font-bold mb-6">Join Our Community.</h2>
			<p class="text-lg opacity-90">
				Start managing your masjid digitally today. It takes less than 2 minutes to get started.
			</p>
		</div>

		<div class="relative z-10 text-sm opacity-75">
			&copy; {new Date().getFullYear()} TadBeer. All rights reserved.
		</div>

		<div class="absolute inset-0 opacity-10 pattern-islamic"></div>
	</div>

	<!-- Right Side: Register Form -->
	<div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center lg:text-left">
				<h1 class="text-3xl font-bold">Create Account</h1>
				<p class="text-base-content/60 mt-2">Get started with your free account.</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-5">
				<div class="form-control">
					<label class="label" for="name">
						<span class="label-text font-medium">Full Name</span>
					</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						placeholder="Abdullah Al-Fatih"
						class="input input-bordered w-full"
						required
					/>
				</div>

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
							class="input input-bordered w-full pr-10"
							required
							minlength="8"
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
					<!-- Strength Meter -->
					{#if password.length > 0}
						<div class="mt-2 flex items-center gap-2">
							<div class="h-1.5 flex-1 bg-base-200 rounded-full overflow-hidden">
								<div
									class="h-full {strengthColor} transition-all duration-300"
									style="width: {(strength / 4) * 100}%"
								></div>
							</div>
							<span
								class="text-xs font-medium {strength <= 1
									? 'text-error'
									: strength === 2
										? 'text-warning'
										: 'text-success'}"
							>
								{strengthLabel}
							</span>
						</div>
					{/if}
				</div>

				<div class="form-control">
					<label class="label" for="confirm">
						<span class="label-text font-medium">Confirm Password</span>
					</label>
					<div class="relative">
						<input
							type={showConfirm ? 'text' : 'password'}
							id="confirm"
							bind:value={confirmPassword}
							class="input input-bordered w-full pr-10 {confirmPassword && !passwordsMatch
								? 'input-error'
								: ''}"
							required
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
							onclick={() => (showConfirm = !showConfirm)}
						>
							{#if showConfirm}
								<EyeOff class="w-5 h-5" />
							{:else}
								<Eye class="w-5 h-5" />
							{/if}
						</button>
					</div>
					{#if confirmPassword && !passwordsMatch}
						<label class="label">
							<span class="label-text-alt text-error flex items-center gap-1">
								<X class="w-3 h-3" /> Passwords do not match
							</span>
						</label>
					{/if}
				</div>

				<div class="form-control">
					<label class="label cursor-pointer justify-start gap-3 items-start">
						<input
							type="checkbox"
							bind:checked={acceptedTerms}
							class="checkbox checkbox-primary checkbox-sm mt-1"
							required
						/>
						<span class="label-text text-sm">
							I agree to the <a href="/terms" class="link link-primary">Terms of Service</a> and
							<a href="/privacy" class="link link-primary">Privacy Policy</a>.
						</span>
					</label>
				</div>

				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={isLoading || !acceptedTerms || !passwordsMatch}
				>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
						Creating Account...
					{:else}
						Create Account <UserPlus class="w-4 h-4 ml-2" />
					{/if}
				</button>
			</form>

			<div class="text-center text-sm">
				<span class="text-base-content/60">Already have an account?</span>
				<a href="/login" class="link link-primary font-medium no-underline hover:underline ml-1">
					Sign in
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
