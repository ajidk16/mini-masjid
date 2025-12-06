<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, Toast, success as toastSuccess, error as toastError } from '$lib/components/ui';
	import {
		Plus,
		Search,
		Download,
		Filter,
		Box,
		Wrench,
		History,
		MoreVertical,
		SquarePen,
		Trash2,
		Eye,
		Package,
		DollarSign,
		AlertTriangle,
		Image as ImageIcon
	} from 'lucide-svelte';

	let { data } = $props();

	// View state
	let activeTab = $state('assets'); // assets, lending, maintenance
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let selectedCondition = $state('');

	// Modal states
	let showDeleteModal = $state(false);
	let selectedAsset = $state<(typeof data.assets)[0] | null>(null);

	// Filtered assets
	const filteredAssets = $derived(() => {
		let result = data.assets || [];
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(a) =>
					a.name.toLowerCase().includes(q) ||
					a.code.toLowerCase().includes(q) ||
					a.location.toLowerCase().includes(q)
			);
		}
		if (selectedCategory) result = result.filter((a) => a.category === selectedCategory);
		if (selectedCondition) result = result.filter((a) => a.condition === selectedCondition);
		return result;
	});

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	function getConditionBadge(condition: string) {
		const map: Record<string, string> = {
			good: 'success',
			maintenance: 'warning',
			damaged: 'error',
			lost: 'ghost'
		};
		return map[condition] || 'ghost';
	}

	function getConditionLabel(condition: string) {
		const map: Record<string, string> = {
			good: 'Baik',
			maintenance: 'Perbaikan',
			damaged: 'Rusak',
			lost: 'Hilang'
		};
		return map[condition] || condition;
	}

	function openDelete(asset: (typeof data.assets)[0]) {
		selectedAsset = asset;
		showDeleteModal = true;
	}

	function handleDelete() {
		return async ({ result, update }: any) => {
			showDeleteModal = false;
			selectedAsset = null;
			if (result.type === 'success') {
				toastSuccess('Aset berhasil dihapus');
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menghapus');
			}
		};
	}
</script>

<svelte:head>
	<title>Inventaris | TadBeer</title>
</svelte:head>

<Toast />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">📦 Inventaris</h1>
			<p class="text-base-content/60 mt-1">Manajemen aset dan perlengkapan masjid</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost btn-sm">
				<Download class="w-4 h-4" />
				Export
			</button>
			<a href="/admin/inventaris/tambah" class="btn btn-primary btn-sm">
				<Plus class="w-4 h-4" />
				Tambah Aset
			</a>
		</div>
	</div>

	<!-- Stats -->
	<div class="stats stats-vertical sm:stats-horizontal shadow w-full">
		<div class="stat">
			<div class="stat-figure text-primary"><Package class="w-8 h-8" /></div>
			<div class="stat-title">Total Aset</div>
			<div class="stat-value text-xl">{data.stats.totalAssets}</div>
			<div class="stat-desc">Unit barang</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-success"><DollarSign class="w-8 h-8" /></div>
			<div class="stat-title">Total Nilai</div>
			<div class="stat-value text-xl text-success">{formatCurrency(data.stats.totalValue)}</div>
			<div class="stat-desc">Estimasi nilai aset</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-warning"><Wrench class="w-8 h-8" /></div>
			<div class="stat-title">Perlu Perbaikan</div>
			<div class="stat-value text-xl text-warning">{data.stats.maintenanceCount}</div>
			<div class="stat-desc">Unit barang</div>
		</div>
	</div>

	<!-- Tabs -->
	<div role="tablist" class="tabs tabs-bordered">
		<button
			role="tab"
			class="tab {activeTab === 'assets' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'assets')}
		>
			<Box class="w-4 h-4 mr-2" /> Daftar Aset
		</button>
		<button
			role="tab"
			class="tab {activeTab === 'lending' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'lending')}
		>
			<History class="w-4 h-4 mr-2" /> Peminjaman
		</button>
		<button
			role="tab"
			class="tab {activeTab === 'maintenance' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'maintenance')}
		>
			<Wrench class="w-4 h-4 mr-2" /> Maintenance
		</button>
	</div>

	{#if activeTab === 'assets'}
		<!-- Assets Content -->
		<div class="space-y-4">
			<!-- Filters -->
			<div class="flex flex-wrap gap-3 items-center">
				<div class="flex-1 min-w-[200px]">
					<label class="input input-bordered input-sm flex items-center gap-2 w-full">
						<Search class="w-4 h-4 text-base-content/50" />
						<input
							type="text"
							placeholder="Cari nama, kode, lokasi..."
							class="grow"
							bind:value={searchQuery}
						/>
					</label>
				</div>
				<select class="select select-bordered select-sm" bind:value={selectedCategory}>
					<option value="">Semua Kategori</option>
					<option value="Elektronik">Elektronik</option>
					<option value="Furniture">Furniture</option>
					<option value="Perlengkapan">Perlengkapan</option>
				</select>
				<select class="select select-bordered select-sm" bind:value={selectedCondition}>
					<option value="">Semua Kondisi</option>
					<option value="good">Baik</option>
					<option value="maintenance">Perbaikan</option>
					<option value="damaged">Rusak</option>
					<option value="lost">Hilang</option>
				</select>
			</div>

			<!-- Assets Table -->
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-0">
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Aset</th>
									<th>Kategori</th>
									<th>Lokasi</th>
									<th>Jumlah</th>
									<th>Kondisi</th>
									<th class="text-center">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredAssets() as asset (asset.id)}
									<tr class="hover:bg-base-200/50">
										<td>
											<div class="flex items-center gap-3">
												<div class="avatar rounded-lg {asset.image ? '' : 'placeholder'}">
													{#if asset.image}
														<div class="w-12 h-12 rounded-lg">
															<img src={asset.image} alt={asset.name} />
														</div>
													{:else}
														<div class="bg-base-200 text-base-content/50 rounded-lg w-12 h-12">
															<ImageIcon class="w-6 h-6" />
														</div>
													{/if}
												</div>
												<div>
													<div class="font-medium">{asset.name}</div>
													<div class="text-xs text-base-content/50">{asset.code}</div>
												</div>
											</div>
										</td>
										<td>{asset.category}</td>
										<td>{asset.location}</td>
										<td>{asset.quantity} Unit</td>
										<td>
											<Badge variant={getConditionBadge(asset.condition) as any} size="sm">
												{getConditionLabel(asset.condition)}
											</Badge>
										</td>
										<td>
											<div class="flex justify-center gap-1">
												<a
													href="/admin/inventaris/{asset.id}/edit"
													class="btn btn-ghost btn-xs btn-square"
												>
													<SquarePen class="w-4 h-4" />
												</a>
												<button
													class="btn btn-ghost btn-xs btn-square text-error"
													onclick={() => openDelete(asset)}
												>
													<Trash2 class="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="6" class="text-center py-12 text-base-content/50">
											<p class="text-4xl mb-2">📦</p>
											<p>Tidak ada data aset</p>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	{:else if activeTab === 'lending'}
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<div class="form-control">
					<label class="input input-bordered input-sm flex items-center gap-2">
						<Search class="w-4 h-4 text-base-content/50" />
						<input type="text" placeholder="Cari peminjam..." class="grow" />
					</label>
				</div>
				<button class="btn btn-primary btn-sm">
					<Plus class="w-4 h-4" /> Catat Peminjaman
				</button>
			</div>

			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-0">
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Aset</th>
									<th>Peminjam</th>
									<th>Tanggal Pinjam</th>
									<th>Status</th>
									<th class="text-center">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{#each data.lendings as lending (lending.id)}
									<tr class="hover:bg-base-200/50">
										<td class="font-medium">{lending.assetName}</td>
										<td>{lending.borrower}</td>
										<td>
											<div class="text-sm">{lending.date}</div>
											<div class="text-xs text-base-content/50">Kembali: {lending.returnDate}</div>
										</td>
										<td>
											<Badge
												variant={lending.status === 'returned' ? 'success' : 'warning'}
												size="sm"
											>
												{lending.status === 'returned' ? 'Dikembalikan' : 'Dipinjam'}
											</Badge>
										</td>
										<td>
											<div class="flex justify-center gap-1">
												<button class="btn btn-ghost btn-xs btn-square">
													<SquarePen class="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	{:else if activeTab === 'maintenance'}
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<div class="form-control">
					<label class="input input-bordered input-sm flex items-center gap-2">
						<Search class="w-4 h-4 text-base-content/50" />
						<input type="text" placeholder="Cari log..." class="grow" />
					</label>
				</div>
				<button class="btn btn-primary btn-sm">
					<Plus class="w-4 h-4" /> Catat Maintenance
				</button>
			</div>

			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-0">
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Aset</th>
									<th>Tanggal</th>
									<th>Deskripsi</th>
									<th>Biaya</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{#each data.maintenance as log (log.id)}
									<tr class="hover:bg-base-200/50">
										<td class="font-medium">{log.assetName}</td>
										<td>{log.date}</td>
										<td>{log.description}</td>
										<td>{formatCurrency(log.cost)}</td>
										<td>
											<Badge variant={log.status === 'completed' ? 'success' : 'info'} size="sm">
												{log.status === 'completed' ? 'Selesai' : 'Terjadwal'}
											</Badge>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Delete Modal -->
{#if showDeleteModal && selectedAsset}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg text-error">⚠️ Hapus Aset</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus aset ini?</p>
			<div class="bg-base-200 rounded-lg p-4 mb-4">
				<div class="flex items-center gap-3">
					<div class="avatar rounded-lg {selectedAsset.image ? '' : 'placeholder'}">
						{#if selectedAsset.image}
							<div class="w-12 h-12 rounded-lg">
								<img src={selectedAsset.image} alt={selectedAsset.name} />
							</div>
						{:else}
							<div class="bg-base-300 text-base-content/50 rounded-lg w-12 h-12">
								<ImageIcon class="w-6 h-6" />
							</div>
						{/if}
					</div>
					<div>
						<p class="font-medium">{selectedAsset.name}</p>
						<p class="text-sm text-base-content/60">{selectedAsset.code}</p>
					</div>
				</div>
			</div>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showDeleteModal = false;
						selectedAsset = null;
					}}>Batal</button
				>
				<form method="POST" action="?/delete" use:enhance={() => handleDelete()}>
					<input type="hidden" name="id" value={selectedAsset.id} />
					<button type="submit" class="btn btn-error"><Trash2 class="w-4 h-4" /> Hapus</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDeleteModal = false;
					selectedAsset = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}
