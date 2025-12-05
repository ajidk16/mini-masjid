<script lang="ts">
	import { ArrowLeft, Save, Camera } from 'lucide-svelte';

	let name = $state('Abdullah Al-Fatih');
	let bio = $state('Khidmat untuk umat. Managing operational activities of Masjid Al-Ikhlas.');
	let phone = $state('+62 812-3456-7890');
	let location = $state('Jakarta Selatan, Indonesia');
</script>

<div class="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
	<div class="flex items-center gap-4 mb-6">
		<a href="/profile" class="btn btn-ghost btn-circle btn-sm">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold">Edit Profile</h1>
			<p class="text-base-content/60">Update your personal information.</p>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm border border-base-200">
		<div class="card-body space-y-4">
			<!-- Avatar Upload -->
			<div class="flex flex-col items-center gap-4 mb-4">
				<div class="relative group cursor-pointer">
					<div class="avatar placeholder">
						<div class="bg-neutral text-neutral-content rounded-full w-24 text-3xl">
							<span>A</span>
						</div>
					</div>
					<div
						class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<Camera class="w-6 h-6 text-white" />
					</div>
				</div>
				<button class="btn btn-ghost btn-xs">Change Avatar</button>
			</div>

			<div class="form-control">
				<label class="label" for="name">
					<span class="label-text font-medium">Full Name</span>
				</label>
				<input type="text" id="name" bind:value={name} class="input input-bordered w-full" />
			</div>

			<div class="form-control">
				<label class="label" for="bio">
					<span class="label-text font-medium">Bio</span>
				</label>
				<textarea id="bio" bind:value={bio} class="textarea textarea-bordered h-24"></textarea>
				<label class="label">
					<span class="label-text-alt">Brief description for your profile.</span>
				</label>
			</div>

			<div class="form-control">
				<label class="label" for="phone">
					<span class="label-text font-medium">Phone Number</span>
				</label>
				<input type="tel" id="phone" bind:value={phone} class="input input-bordered w-full" />
			</div>

			<div class="form-control">
				<label class="label" for="location">
					<span class="label-text font-medium">Location</span>
				</label>
				<input
					type="text"
					id="location"
					bind:value={location}
					class="input input-bordered w-full"
				/>
			</div>

			<div class="card-actions justify-end mt-4">
				<a href="/profile" class="btn btn-ghost">Cancel</a>
				<button class="btn btn-primary">
					<Save class="w-4 h-4 mr-2" /> Save Changes
				</button>
			</div>
		</div>
	</div>
</div>
