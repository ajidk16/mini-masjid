<script lang="ts">
	import { Camera, Save } from 'lucide-svelte';

	let masjidName = $state('Masjid Al-Ikhlas');
	let address = $state('Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan');
	let email = $state('info@alikhlas.com');
	let phone = $state('+62 812-3456-7890');
	let website = $state('https://alikhlas.com');
</script>

<div class="space-y-6">
	<div class="border-b border-base-200 pb-4">
		<h2 class="text-2xl font-bold">Profile Masjid</h2>
		<p class="text-base-content/60">Manage your masjid's public information and branding.</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Logo Section -->
		<div class="lg:col-span-1 flex flex-col items-center gap-4">
			<div class="relative group cursor-pointer">
				<div class="avatar placeholder">
					<div
						class="bg-neutral text-neutral-content rounded-full w-32 h-32 ring ring-primary ring-offset-base-100 ring-offset-2"
					>
						<span class="text-3xl">MA</span>
					</div>
				</div>
				<div
					class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
				>
					<Camera class="w-8 h-8 text-white" />
				</div>
			</div>
			<div class="text-center">
				<h3 class="font-semibold">Masjid Logo</h3>
				<p class="text-xs text-base-content/60 mt-1">Recommended: 500x500px, PNG or JPG</p>
				<button class="btn btn-outline btn-sm mt-3">Upload New</button>
			</div>
		</div>

		<!-- Form Section -->
		<div class="lg:col-span-2 space-y-4">
			<div class="form-control">
				<label class="label" for="name">
					<span class="label-text font-medium">Masjid Name</span>
				</label>
				<input type="text" id="name" bind:value={masjidName} class="input input-bordered w-full" />
			</div>

			<div class="form-control">
				<label class="label" for="address">
					<span class="label-text font-medium">Address</span>
				</label>
				<textarea id="address" bind:value={address} class="textarea textarea-bordered h-24 w-full"
				></textarea>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="form-control">
					<label class="label" for="email">
						<span class="label-text font-medium">Email</span>
					</label>
					<input type="email" id="email" bind:value={email} class="input input-bordered w-full" />
				</div>

				<div class="form-control">
					<label class="label" for="phone">
						<span class="label-text font-medium">Phone</span>
					</label>
					<input type="tel" id="phone" bind:value={phone} class="input input-bordered w-full" />
				</div>
			</div>

			<div class="form-control">
				<label class="label" for="website">
					<span class="label-text font-medium">Website</span>
				</label>
				<input type="url" id="website" bind:value={website} class="input input-bordered w-full" />
			</div>

			<div class="pt-4 flex justify-end">
				<button class="btn btn-primary">
					<Save class="w-4 h-4 mr-2" />
					Save Changes
				</button>
			</div>
		</div>
	</div>
</div>
