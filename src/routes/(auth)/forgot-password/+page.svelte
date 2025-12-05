<script lang="ts">
	import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-svelte';

	let email = $state('');
	let isLoading = $state(false);
	let isSent = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		// Simulate API call
		setTimeout(() => {
			isLoading = false;
			isSent = true;
		}, 1500);
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
	<div class="card bg-base-100 shadow-xl w-full max-w-md">
		<div class="card-body p-8">
			{#if !isSent}
				<div class="text-center mb-6">
					<div
						class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Mail class="w-8 h-8" />
					</div>
					<h1 class="text-2xl font-bold">Forgot Password?</h1>
					<p class="text-base-content/60 mt-2">No worries, we'll send you reset instructions.</p>
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

					<button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-spinner loading-sm"></span>
							Sending Link...
						{:else}
							Send Reset Link
						{/if}
					</button>
				</form>

				<div class="mt-6 text-center">
					<a
						href="/login"
						class="link link-hover text-sm flex items-center justify-center gap-2 text-base-content/70 hover:text-primary transition-colors"
					>
						<ArrowLeft class="w-4 h-4" /> Back to Login
					</a>
				</div>
			{:else}
				<div class="text-center animate-fadeIn">
					<div
						class="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<CheckCircle class="w-8 h-8" />
					</div>
					<h1 class="text-2xl font-bold">Check Your Email</h1>
					<p class="text-base-content/60 mt-2 mb-6">
						We sent a password reset link to <br />
						<span class="font-semibold text-base-content">{email}</span>
					</p>

					<div class="space-y-3">
						<a href="/login" class="btn btn-primary w-full"> Back to Login </a>
						<button class="btn btn-ghost btn-sm w-full" onclick={() => (isSent = false)}>
							Click to resend
						</button>
					</div>

					<p class="text-xs text-base-content/50 mt-6">
						Did not receive the email? Check your spam folder or try another email address.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
