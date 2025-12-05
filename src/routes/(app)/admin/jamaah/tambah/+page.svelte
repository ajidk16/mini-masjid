<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Toast, { success as toastSuccess, error as toastError } from '$lib/components/ui/Toast.svelte';
	import { ArrowLeft, Save, Camera, Upload, X } from 'lucide-svelte';

	let { form } = $props();

	let isSubmitting = $state(false);
	let avatarPreview = $state<string | null>(null);
	let avatarInput: HTMLInputElement;

	function handleAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				avatarPreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleSubmit() {
		return async ({ result, update }: any) => {
			isSubmitting = false;
			if (result.type === 'redirect') {
				toastSuccess('Jamaah berhasil ditambahkan');
				goto(result.location);
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menyimpan');
			} else {
				await update();
			}
		};
	}
</script>

<svelte:head>
	<title>Tambah Jamaah | MiniMasjid</title>
</svelte:head>

<Toast />

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/admin/jamaah" class="btn btn-ghost btn-sm btn-square">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold">➕ Tambah Jamaah</h1>
			<p class="text-base-content/60">Daftarkan anggota baru</p>
		</div>
	</div>

	<!-- Form -->
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			isSubmitting = true;
			return handleSubmit();
		}}
		class="card bg-base-100 shadow-sm"
	>
		<div class="card-body space-y-4">
			{#if form?.error}
				<div class="alert alert-error">
					<span>{form.error}</span>
				</div>
			{/if}

			<!-- Avatar Upload -->
			<div class="form-control">
				<label for="avatar" class="label"><span class="label-text">Foto Profil</span></label>
				<div class="flex items-center gap-4">
					<div class="avatar {avatarPreview ? '' : 'placeholder'}">
						{#if avatarPreview}
							<div class="w-20 rounded-full">
								<img src={avatarPreview} alt="Preview" />
							</div>
						{:else}
							<div class="bg-primary/10 text-primary rounded-full w-20">
								<Camera class="w-8 h-8" />
							</div>
						{/if}
					</div>
					<div class="space-y-2">
						<input
							type="file"
							name="avatar"
							accept="image/*"
							class="hidden"
							bind:this={avatarInput}
							onchange={handleAvatarChange}
						/>
						<button
							type="button"
							class="btn btn-sm btn-outline"
							onclick={() => avatarInput.click()}
						>
							<Upload class="w-4 h-4" /> Pilih Foto
						</button>
						{#if avatarPreview}
							<button
								type="button"
								class="btn btn-sm btn-ghost text-error"
								onclick={() => (avatarPreview = null)}
							>
								<X class="w-4 h-4" /> Hapus
							</button>
						{/if}
						<p class="text-xs text-base-content/50">JPG, PNG max 2MB</p>
					</div>
				</div>
			</div>

			<div class="divider"></div>

			<!-- Name -->
			<div class="form-control">
				<label for="name" class="label"
					><span class="label-text">Nama Lengkap <span class="text-error">*</span></span></label
				>
				<input
					type="text"
					name="name"
					class="input input-bordered w-full"
					placeholder="Ahmad Sudrajat"
					required
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- NIK -->
				<div class="form-control">
					<label for="nik" class="label"><span class="label-text">NIK</span></label>
					<input
						type="text"
						name="nik"
						class="input input-bordered w-full"
						placeholder="16 digit"
						maxlength="16"
					/>
				</div>

				<!-- Gender -->
				<div class="form-control">
					<label for="gender" class="label"
						><span class="label-text">Jenis Kelamin <span class="text-error">*</span></span></label
					>
					<select name="gender" class="select select-bordered w-full" required>
						<option value="" disabled selected>Pilih</option>
						<option value="male">Laki-laki</option>
						<option value="female">Perempuan</option>
					</select>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Birth Date -->
				<div class="form-control">
					<label for="birthDate" class="label"><span class="label-text">Tanggal Lahir</span></label>
					<input type="date" name="birthDate" class="input input-bordered w-full" />
				</div>

				<!-- Phone -->
				<div class="form-control">
					<label for="phone" class="label"><span class="label-text">No. Telepon</span></label>
					<input
						type="tel"
						name="phone"
						class="input input-bordered w-full"
						placeholder="08xxxxxxxxxx"
					/>
				</div>
			</div>

			<!-- Email -->
			<div class="form-control">
				<label for="email" class="label"><span class="label-text">Email</span></label>
				<input
					type="email"
					name="email"
					class="input input-bordered w-full"
					placeholder="email@example.com"
				/>
			</div>

			<!-- Address -->
			<div class="form-control">
				<label for="address" class="label"><span class="label-text">Alamat</span></label>
				<textarea
					name="address"
					class="textarea textarea-bordered w-full"
					rows="3"
					placeholder="Alamat lengkap..."
				></textarea>
			</div>

			<!-- Status -->
			<div class="form-control">
				<label for="status" class="label"><span class="label-text">Status</span></label>
				<select name="status" class="select select-bordered w-full">
					<option value="active" selected>Aktif</option>
					<option value="inactive">Tidak Aktif</option>
				</select>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-2 pt-4 border-t border-base-200">
				<a href="/admin/jamaah" class="btn btn-ghost">Batal</a>
				<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<Save class="w-4 h-4" />
					{/if}
					Simpan
				</button>
			</div>
		</div>
	</form>
</div>
