<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { mosqueProfileSchema } from '$lib/schemas';
	import { Camera, Save } from 'lucide-svelte';

	let { data } = $props();

	const { form, errors, constraints, enhance, message, delayed } = superForm(data.form, {
		validators: valibotClient(mosqueProfileSchema),
		resetForm: false
	});

	let previewUrl = $state(data.form.data.imageUrl || '');

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			previewUrl = URL.createObjectURL(file);
		}
	}
</script>

<svelte:head>
	<title>Profile Masjid | Minimasjid</title>
</svelte:head>

<div class="space-y-6">
	<div class="border-b border-base-200 pb-4">
		<h2 class="text-2xl font-bold">Profile Masjid</h2>
		<p class="text-base-content/60">Manage your masjid's public information and branding.</p>
	</div>

	{#if $message}
		<div class="alert alert-success">
			<span>{$message}</span>
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance
		class="grid grid-cols-1 lg:grid-cols-3 gap-8"
	>
		<!-- Logo Section -->
		<div class="lg:col-span-1 flex flex-col items-center gap-4">
			<div class="relative group cursor-pointer">
				<div class="avatar placeholder">
					<div
						class="bg-neutral text-neutral-content rounded-full w-32 h-32 ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden"
					>
						{#if previewUrl}
							<img src={previewUrl} alt="Mosque Profile" class="object-cover w-full h-full" />
						{:else}
							<span class="text-3xl">MA</span>
						{/if}
					</div>
				</div>
				<label
					class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
				>
					<Camera class="w-8 h-8 text-white" />
					<input
						type="file"
						name="image"
						accept="image/*"
						onchange={handleFileChange}
						class="hidden"
					/>
				</label>
			</div>
			<div class="text-center">
				<h3 class="font-semibold">Masjid Logo</h3>
				<p class="text-xs text-base-content/60 mt-1">Recommended: 500x500px, PNG or JPG</p>
				<button
					type="button"
					class="btn btn-outline btn-sm mt-3"
					onclick={() => document.querySelector('input[name="image"]')?.click()}
				>
					Upload New
				</button>
			</div>
		</div>

		<!-- Form Section -->
		<div class="lg:col-span-2 space-y-4">
			<div class="form-control">
				<label class="label" for="name">
					<span class="label-text font-medium">Masjid Name</span>
				</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={$form.name}
					class="input input-bordered w-full"
					aria-invalid={$errors.name ? 'true' : undefined}
					{...$constraints.name}
				/>
				{#if $errors.name}<span class="text-error text-sm mt-1">{$errors.name}</span>{/if}
			</div>

			<div class="form-control">
				<label class="label" for="address">
					<span class="label-text font-medium">Address</span>
				</label>
				<textarea
					id="address"
					name="address"
					bind:value={$form.address}
					class="textarea textarea-bordered h-24 w-full"
					{...$constraints.address}
				></textarea>
				{#if $errors.address}<span class="text-error text-sm mt-1">{$errors.address}</span>{/if}
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="form-control">
					<label class="label" for="email">
						<span class="label-text font-medium">Email</span>
					</label>
					<input
						type="email"
						id="email"
						name="email"
						bind:value={$form.email}
						class="input input-bordered w-full"
					/>
					{#if $errors.email}<span class="text-error text-sm mt-1">{$errors.email}</span>{/if}
				</div>

				<div class="form-control">
					<label class="label" for="phone">
						<span class="label-text font-medium">Phone</span>
					</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						bind:value={$form.phone}
						class="input input-bordered w-full"
					/>
					{#if $errors.phone}<span class="text-error text-sm mt-1">{$errors.phone}</span>{/if}
				</div>
			</div>

			<div class="form-control">
				<label class="label" for="website">
					<span class="label-text font-medium">Website</span>
				</label>
				<input
					type="url"
					id="website"
					name="website"
					bind:value={$form.website}
					class="input input-bordered w-full"
				/>
				{#if $errors.website}<span class="text-error text-sm mt-1">{$errors.website}</span>{/if}
			</div>

			<!-- Additional Fields (Vision, Mission, History) - Styled to match -->
			<div class="divider">Additional Info</div>

			<div class="form-control">
				<label class="label" for="vision">
					<span class="label-text font-medium">Vision</span>
				</label>
				<textarea
					id="vision"
					name="vision"
					bind:value={$form.vision}
					class="textarea textarea-bordered h-20 w-full"
				></textarea>
			</div>

			<div class="form-control">
				<label class="label" for="mission">
					<span class="label-text font-medium">Mission</span>
				</label>
				<textarea
					id="mission"
					name="mission"
					bind:value={$form.mission}
					class="textarea textarea-bordered h-24 w-full"
				></textarea>
			</div>

			<div class="form-control">
				<label class="label" for="history">
					<span class="label-text font-medium">History</span>
				</label>
				<textarea
					id="history"
					name="history"
					bind:value={$form.history}
					class="textarea textarea-bordered h-24 w-full"
				></textarea>
			</div>

			<div class="pt-4 flex justify-end">
				<button type="submit" class="btn btn-primary" disabled={$delayed}>
					{#if $delayed}
						<span class="loading loading-spinner loading-sm mr-2"></span>
						Saving...
					{:else}
						<Save class="w-4 h-4 mr-2" />
						Save Changes
					{/if}
				</button>
			</div>
		</div>
	</form>
</div>
