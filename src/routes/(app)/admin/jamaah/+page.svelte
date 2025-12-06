<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, Toast, success as toastSuccess, error as toastError } from '$lib/components/ui';
	import {
		Plus,
		Search,
		Download,
		Upload,
		Eye,
		SquarePen,
		Trash2,
		X,
		Phone,
		Mail,
		MapPin,
		User,
		Users,
		MessageCircle,
		Send,
		FileSpreadsheet
	} from 'lucide-svelte';

	let { data } = $props();

	// Filter & search
	let searchQuery = $state('');
	let selectedGender = $state('');
	let selectedStatus = $state('');

	// Modal states
	let showDetailModal = $state(false);
	let showDeleteModal = $state(false);
	let showImportModal = $state(false);
	let showBroadcastModal = $state(false);
	let selectedMember = $state<(typeof data.members)[0] | null>(null);

	// Import states
	let importFile = $state<File | null>(null);
	let isImporting = $state(false);

	// Broadcast states
	let broadcastType = $state<'whatsapp' | 'email'>('whatsapp');
	let broadcastMessage = $state('');
	let isSending = $state(false);

	// Filtered members
	const filteredMembers = $derived(() => {
		let result = data.members || [];
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(m) =>
					m.name.toLowerCase().includes(q) ||
					m.phone?.includes(q) ||
					m.email?.toLowerCase().includes(q)
			);
		}
		if (selectedGender) result = result.filter((m) => m.gender === selectedGender);
		if (selectedStatus) result = result.filter((m) => m.status === selectedStatus);
		return result;
	});

	function getStatusBadge(status: string) {
		return status === 'active' ? 'success' : 'ghost';
	}

	function calculateAge(birthDate: string | null) {
		if (!birthDate) return '-';
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const m = today.getMonth() - birth.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
		return age + ' tahun';
	}

	function exportData(format: 'xlsx' | 'csv') {
		// Generate CSV content
		const headers = [
			'Nama',
			'NIK',
			'Gender',
			'Tanggal Lahir',
			'Telepon',
			'Email',
			'Alamat',
			'Status'
		];
		const rows = (data.members || []).map((m) => [
			m.name,
			m.nik || '',
			m.gender === 'male' ? 'Laki-laki' : 'Perempuan',
			m.birthDate || '',
			m.phone || '',
			m.email || '',
			m.address || '',
			m.status === 'active' ? 'Aktif' : 'Tidak Aktif'
		]);

		const csvContent = [
			headers.join(','),
			...rows.map((r) => r.map((c) => `"${c}"`).join(','))
		].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `jamaah_${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'csv' : 'csv'}`;
		link.click();
		toastSuccess(`Data berhasil diexport ke ${format.toUpperCase()}`);
	}

	async function handleImport() {
		if (!importFile) return;
		isImporting = true;

		// Simulate import process
		await new Promise((resolve) => setTimeout(resolve, 1500));

		toastSuccess(`${importFile.name} berhasil diimport`);
		isImporting = false;
		showImportModal = false;
		importFile = null;
	}

	async function sendBroadcast() {
		if (!broadcastMessage.trim()) {
			toastError('Pesan tidak boleh kosong');
			return;
		}

		isSending = true;

		// Simulate sending
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const count = filteredMembers().filter((m) =>
			broadcastType === 'whatsapp' ? m.phone : m.email
		).length;
		toastSuccess(
			`Pesan terkirim ke ${count} jamaah via ${broadcastType === 'whatsapp' ? 'WhatsApp' : 'Email'}`
		);
		isSending = false;
		showBroadcastModal = false;
		broadcastMessage = '';
	}

	function openDetail(member: (typeof data.members)[0]) {
		selectedMember = member;
		showDetailModal = true;
	}

	function openDelete(member: (typeof data.members)[0]) {
		selectedMember = member;
		showDeleteModal = true;
	}

	function handleDelete() {
		return async ({ result, update }: any) => {
			showDeleteModal = false;
			selectedMember = null;
			if (result.type === 'success') {
				toastSuccess('Data jamaah berhasil dihapus');
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menghapus');
			}
		};
	}
</script>

<svelte:head>
	<title>Jamaah | TadBeer</title>
</svelte:head>

<Toast />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">👥 Data Jamaah</h1>
			<p class="text-base-content/60 mt-1">Kelola database anggota masjid</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<!-- Import Button -->
			<button class="btn btn-ghost btn-sm" onclick={() => (showImportModal = true)}>
				<Upload class="w-4 h-4" />
				Import
			</button>

			<!-- Export Dropdown -->
			<div class="dropdown dropdown-end">
				<button class="btn btn-ghost btn-sm">
					<Download class="w-4 h-4" />
					Export
				</button>
				<ul class="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-40 p-2">
					<li>
						<button onclick={() => exportData('xlsx')}
							><FileSpreadsheet class="w-4 h-4" /> Excel</button
						>
					</li>
					<li>
						<button onclick={() => exportData('csv')}
							><FileSpreadsheet class="w-4 h-4" /> CSV</button
						>
					</li>
				</ul>
			</div>

			<!-- Broadcast Button -->
			<button class="btn btn-secondary btn-sm" onclick={() => (showBroadcastModal = true)}>
				<MessageCircle class="w-4 h-4" />
				Broadcast
			</button>

			<a href="/admin/jamaah/tambah" class="btn btn-primary btn-sm">
				<Plus class="w-4 h-4" />
				Tambah
			</a>
		</div>
	</div>

	<!-- Stats -->
	<div class="stats stats-vertical sm:stats-horizontal shadow w-full">
		<div class="stat">
			<div class="stat-figure text-primary"><Users class="w-8 h-8" /></div>
			<div class="stat-title">Total Jamaah</div>
			<div class="stat-value text-xl">{data.totalMembers || 0}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Laki-laki</div>
			<div class="stat-value text-xl text-info">{data.maleCount || 0}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Perempuan</div>
			<div class="stat-value text-xl text-secondary">{data.femaleCount || 0}</div>
		</div>
		<div class="stat">
			<div class="stat-title">Aktif</div>
			<div class="stat-value text-xl text-success">{data.activeCount || 0}</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap gap-3 items-center">
		<div class="flex-1 min-w-[200px]">
			<label for="" class="input input-bordered input-sm flex items-center gap-2 w-full">
				<Search class="w-4 h-4 text-base-content/50" />
				<input
					type="text"
					placeholder="Cari nama, telepon, email..."
					class="grow"
					bind:value={searchQuery}
				/>
			</label>
		</div>
		<select class="select select-bordered select-sm" bind:value={selectedGender}>
			<option value="">Semua Gender</option>
			<option value="male">Laki-laki</option>
			<option value="female">Perempuan</option>
		</select>
		<select class="select select-bordered select-sm" bind:value={selectedStatus}>
			<option value="">Semua Status</option>
			<option value="active">Aktif</option>
			<option value="inactive">Tidak Aktif</option>
		</select>
	</div>

	<!-- Members Table -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-0">
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Nama</th>
							<th>Kontak</th>
							<th>Gender</th>
							<th>Usia</th>
							<th>Status</th>
							<th class="text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredMembers() as member (member.id)}
							<tr class="hover:bg-base-200/50">
								<td>
									<div class="flex items-center gap-3">
										<div class="avatar {member.avatar ? '' : 'placeholder'}">
											{#if member.avatar}
												<div class="w-10 rounded-full">
													<img src={member.avatar} alt={member.name} />
												</div>
											{:else}
												<div class="bg-primary/10 text-primary rounded-full w-10">
													<span class="text-sm">{member.name.charAt(0).toUpperCase()}</span>
												</div>
											{/if}
										</div>
										<div>
											<div class="font-medium">{member.name}</div>
											{#if member.nik}
												<div class="text-xs text-base-content/50">NIK: {member.nik}</div>
											{/if}
										</div>
									</div>
								</td>
								<td>
									{#if member.phone}
										<div class="flex items-center gap-1 text-sm">
											<Phone class="w-3 h-3" />
											{member.phone}
										</div>
									{/if}
									{#if member.email}
										<div class="flex items-center gap-1 text-xs text-base-content/50">
											<Mail class="w-3 h-3" />
											{member.email}
										</div>
									{/if}
								</td>
								<td>
									<Badge variant={member.gender === 'male' ? 'info' : 'secondary'} size="sm">
										{member.gender === 'male' ? 'L' : 'P'}
									</Badge>
								</td>
								<td class="text-sm">{calculateAge(member.birthDate)}</td>
								<td>
									<Badge variant={getStatusBadge(member.status) as any} size="sm">
										{member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
									</Badge>
								</td>
								<td>
									<div class="flex justify-center gap-1">
										<button
											class="btn btn-ghost btn-xs btn-square"
											onclick={() => openDetail(member)}
										>
											<Eye class="w-4 h-4" />
										</button>
										<a href="/admin/jamaah/{member.id}/edit" class="btn btn-ghost btn-xs btn-square">
											<SquarePen class="w-4 h-4" />
										</a>
										<button
											class="btn btn-ghost btn-xs btn-square text-error"
											onclick={() => openDelete(member)}
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="text-center py-12 text-base-content/50">
									<p class="text-4xl mb-2">📭</p>
									<p>Tidak ada data jamaah</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Detail Modal -->
{#if showDetailModal && selectedMember}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					showDetailModal = false;
					selectedMember = null;
				}}
			>
				<X class="w-4 h-4" />
			</button>

			<div class="flex items-center gap-4 mb-4">
				<div class="avatar {selectedMember.avatar ? '' : 'placeholder'}">
					{#if selectedMember.avatar}
						<div class="w-16 rounded-full">
							<img src={selectedMember.avatar} alt={selectedMember.name} />
						</div>
					{:else}
						<div class="bg-primary/10 text-primary rounded-full w-16">
							<span class="text-2xl">{selectedMember.name.charAt(0).toUpperCase()}</span>
						</div>
					{/if}
				</div>
				<div>
					<h3 class="font-bold text-xl">{selectedMember.name}</h3>
					<Badge variant={getStatusBadge(selectedMember.status) as any}>
						{selectedMember.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
					</Badge>
				</div>
			</div>

			<div class="space-y-3">
				{#if selectedMember.nik}
					<div class="flex items-center gap-3">
						<User class="w-5 h-5 text-base-content/50" />
						<div>
							<p class="text-xs text-base-content/50">NIK</p>
							<p>{selectedMember.nik}</p>
						</div>
					</div>
				{/if}
				<div class="flex items-center gap-3">
					<User class="w-5 h-5 text-base-content/50" />
					<div>
						<p class="text-xs text-base-content/50">Gender / Usia</p>
						<p>
							{selectedMember.gender === 'male' ? 'Laki-laki' : 'Perempuan'} • {calculateAge(
								selectedMember.birthDate
							)}
						</p>
					</div>
				</div>
				{#if selectedMember.phone}
					<div class="flex items-center gap-3">
						<Phone class="w-5 h-5 text-base-content/50" />
						<div>
							<p class="text-xs text-base-content/50">Telepon</p>
							<p>{selectedMember.phone}</p>
						</div>
					</div>
				{/if}
				{#if selectedMember.email}
					<div class="flex items-center gap-3">
						<Mail class="w-5 h-5 text-base-content/50" />
						<div>
							<p class="text-xs text-base-content/50">Email</p>
							<p>{selectedMember.email}</p>
						</div>
					</div>
				{/if}
				{#if selectedMember.address}
					<div class="flex items-center gap-3">
						<MapPin class="w-5 h-5 text-base-content/50" />
						<div>
							<p class="text-xs text-base-content/50">Alamat</p>
							<p>{selectedMember.address}</p>
						</div>
					</div>
				{/if}
			</div>

			<div class="modal-action">
				<a href="/admin/jamaah/{selectedMember.id}/edit" class="btn btn-primary btn-sm">
					<SquarePen class="w-4 h-4" /> Edit
				</a>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showDetailModal = false;
						selectedMember = null;
					}}>Tutup</button
				>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDetailModal = false;
					selectedMember = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal && selectedMember}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg text-error">⚠️ Hapus Jamaah</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus data jamaah ini?</p>
			<div class="bg-base-200 rounded-lg p-4 mb-4">
				<p class="font-medium">{selectedMember.name}</p>
				{#if selectedMember.phone}<p class="text-sm text-base-content/60">
						{selectedMember.phone}
					</p>{/if}
			</div>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showDeleteModal = false;
						selectedMember = null;
					}}>Batal</button
				>
				<form method="POST" action="?/delete" use:enhance={() => handleDelete()}>
					<input type="hidden" name="id" value={selectedMember.id} />
					<button type="submit" class="btn btn-error"><Trash2 class="w-4 h-4" /> Hapus</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDeleteModal = false;
					selectedMember = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}

<!-- Import Modal -->
{#if showImportModal}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					showImportModal = false;
					importFile = null;
				}}
			>
				<X class="w-4 h-4" />
			</button>

			<h3 class="font-bold text-lg mb-4">📥 Import Data Jamaah</h3>

			<div class="space-y-4">
				<div class="alert alert-info">
					<span
						>Format file: CSV atau Excel dengan kolom: Nama, NIK, Gender, Tanggal Lahir, Telepon,
						Email, Alamat</span
					>
				</div>

				<div class="form-control">
					<label for="" class="label"><span class="label-text">Pilih File</span></label>
					<input
						type="file"
						accept=".csv,.xlsx,.xls"
						class="file-input file-input-bordered w-full"
						onchange={(e) => (importFile = (e.target as HTMLInputElement).files?.[0] || null)}
					/>
				</div>

				{#if importFile}
					<div class="bg-base-200 rounded-lg p-3 flex items-center gap-3">
						<FileSpreadsheet class="w-8 h-8 text-success" />
						<div>
							<p class="font-medium">{importFile.name}</p>
							<p class="text-sm text-base-content/60">{(importFile.size / 1024).toFixed(1)} KB</p>
						</div>
					</div>
				{/if}
			</div>

			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showImportModal = false;
						importFile = null;
					}}>Batal</button
				>
				<button
					class="btn btn-primary"
					disabled={!importFile || isImporting}
					onclick={handleImport}
				>
					{#if isImporting}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<Upload class="w-4 h-4" />
					{/if}
					Import
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showImportModal = false;
					importFile = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}

<!-- Broadcast Modal -->
{#if showBroadcastModal}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					showBroadcastModal = false;
					broadcastMessage = '';
				}}
			>
				<X class="w-4 h-4" />
			</button>

			<h3 class="font-bold text-lg mb-4">📢 Broadcast Pesan</h3>

			<div class="space-y-4">
				<!-- Channel Selection -->
				<div class="form-control">
					<label for="" class="label"><span class="label-text">Kirim Via</span></label>
					<div class="join w-full">
						<button
							class="join-item btn flex-1"
							class:btn-primary={broadcastType === 'whatsapp'}
							onclick={() => (broadcastType = 'whatsapp')}
						>
							📱 WhatsApp
						</button>
						<button
							class="join-item btn flex-1"
							class:btn-primary={broadcastType === 'email'}
							onclick={() => (broadcastType = 'email')}
						>
							📧 Email
						</button>
					</div>
				</div>

				<!-- Recipients Info -->
				<div class="bg-base-200 rounded-lg p-3">
					<p class="text-sm">
						{#if broadcastType === 'whatsapp'}
							📱 {filteredMembers().filter((m) => m.phone).length} jamaah dengan nomor telepon
						{:else}
							📧 {filteredMembers().filter((m) => m.email).length} jamaah dengan email
						{/if}
					</p>
				</div>

				<!-- Message -->
				<div class="form-control">
					<label for="" class="label"><span class="label-text">Pesan</span></label>
					<textarea
						class="textarea textarea-bordered w-full"
						rows="5"
						placeholder="Tulis pesan Anda di sini..."
						bind:value={broadcastMessage}
					></textarea>
				</div>
			</div>

			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showBroadcastModal = false;
						broadcastMessage = '';
					}}>Batal</button
				>
				<button class="btn btn-secondary" disabled={isSending} onclick={sendBroadcast}>
					{#if isSending}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<Send class="w-4 h-4" />
					{/if}
					Kirim
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showBroadcastModal = false;
					broadcastMessage = '';
				}}>close</button
			>
		</form>
	</dialog>
{/if}
