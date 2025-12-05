<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, Toast, success as toastSuccess, error as toastError } from '$lib/components/ui';
	import {
		Plus,
		Heart,
		DollarSign,
		Users,
		TrendingUp,
		Share2,
		Copy,
		Trash2,
		ExternalLink,
		CreditCard,
		Wallet,
		QrCode,
		Clock,
		SquarePen
	} from 'lucide-svelte';

	let { data } = $props();

	// View state
	let activeTab = $state('campaigns'); // campaigns, transactions

	// Modal states
	let showCampaignModal = $state(false);
	let showDeleteModal = $state(false);
	let selectedItem = $state<any>(null);
	let isEditMode = $state(false);
	let isSubmitting = $state(false);

	// Form states
	let formTitle = $state('');
	let formTarget = $state('');
	let formDeadline = $state('');
	let formDescription = $state('');

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function getProgress(collected: number, target: number) {
		return Math.min(Math.round((collected / target) * 100), 100);
	}

	function copyLink(id: string) {
		const url = `${window.location.origin}/donasi/${id}`;
		navigator.clipboard.writeText(url);
		toastSuccess('Link donasi berhasil disalin');
	}

	function openCampaignModal() {
		selectedItem = null;
		isEditMode = false;
		formTitle = '';
		formTarget = '';
		formDeadline = '';
		formDescription = '';
		showCampaignModal = true;
	}

	function openEditCampaign(item: any) {
		selectedItem = item;
		isEditMode = true;
		formTitle = item.title;
		formTarget = item.target.toString();
		formDeadline = item.deadline;
		formDescription = item.description || '';
		showCampaignModal = true;
	}

	function openDelete(item: any) {
		selectedItem = item;
		showDeleteModal = true;
	}

	function handleSubmit() {
		return async ({ result, update }: any) => {
			isSubmitting = false;
			if (result.type === 'success') {
				toastSuccess('Program donasi berhasil dibuat');
				showCampaignModal = false;
				await update();
			} else {
				toastError('Gagal menyimpan');
			}
		};
	}

	function handleDelete() {
		return async ({ result, update }: any) => {
			showDeleteModal = false;
			if (result.type === 'success') {
				toastSuccess('Data berhasil dihapus');
				await update();
			} else {
				toastError('Gagal menghapus');
			}
		};
	}
</script>

<svelte:head>
	<title>Donasi | MiniMasjid</title>
</svelte:head>

<Toast />

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">💝 Donasi Online</h1>
			<p class="text-base-content/60 mt-1">Kelola program donasi dan infaq</p>
		</div>
		<button class="btn btn-primary btn-sm" onclick={openCampaignModal}>
			<Plus class="w-4 h-4" /> Buat Program
		</button>
	</div>

	<!-- Stats -->
	<div class="stats stats-vertical sm:stats-horizontal shadow w-full">
		<div class="stat">
			<div class="stat-figure text-primary"><DollarSign class="w-8 h-8" /></div>
			<div class="stat-title">Total Terkumpul</div>
			<div class="stat-value text-xl text-primary">{formatCurrency(data.stats.totalCollected)}</div>
			<div class="stat-desc">Semua program</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-secondary"><Heart class="w-8 h-8" /></div>
			<div class="stat-title">Program Aktif</div>
			<div class="stat-value text-xl">{data.stats.activeCampaigns}</div>
			<div class="stat-desc">Sedang berjalan</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-accent"><Users class="w-8 h-8" /></div>
			<div class="stat-title">Total Donatur</div>
			<div class="stat-value text-xl">{data.stats.totalDonors}</div>
			<div class="stat-desc">Orang berdonasi</div>
		</div>
	</div>

	<!-- Tabs -->
	<div role="tablist" class="tabs tabs-bordered">
		<button
			role="tab"
			class="tab {activeTab === 'campaigns' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'campaigns')}
		>
			<Heart class="w-4 h-4 mr-2" /> Program Donasi
		</button>
		<button
			role="tab"
			class="tab {activeTab === 'transactions' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'transactions')}
		>
			<DollarSign class="w-4 h-4 mr-2" /> Riwayat Transaksi
		</button>
	</div>

	{#if activeTab === 'campaigns'}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.campaigns as campaign}
				<div class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
					<div class="card-body p-4">
						<div class="flex justify-between items-start mb-2">
							<Badge variant={campaign.status === 'active' ? 'success' : 'ghost'} size="sm">
								{campaign.status === 'active' ? 'Aktif' : 'Selesai'}
							</Badge>
							<div class="dropdown dropdown-end">
								<button class="btn btn-ghost btn-xs btn-square">⋮</button>
								<ul class="dropdown-content menu bg-base-100 rounded-box shadow z-10 w-40 p-1">
									<li>
										<button onclick={() => copyLink(campaign.id)}
											><Copy class="w-4 h-4" /> Salin Link</button
										>
									</li>
									<li>
										<button onclick={() => openEditCampaign(campaign)}
											><SquarePen class="w-4 h-4" /> Edit</button
										>
									</li>
									<li>
										<button class="text-error" onclick={() => openDelete(campaign)}
											><Trash2 class="w-4 h-4" /> Hapus</button
										>
									</li>
								</ul>
							</div>
						</div>

						<h3 class="font-bold text-lg mb-1">{campaign.title}</h3>
						<div class="text-sm text-base-content/60 mb-4">
							<div class="flex items-center gap-1">
								<Users class="w-3 h-3" />
								{campaign.donors} Donatur
							</div>
							<div class="flex items-center gap-1">
								<Clock class="w-3 h-3" /> Berakhir {formatDate(campaign.deadline)}
							</div>
						</div>

						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="font-medium text-primary">{formatCurrency(campaign.collected)}</span>
								<span class="text-base-content/50">dari {formatCurrency(campaign.target)}</span>
							</div>
							<progress
								class="progress progress-primary w-full"
								value={getProgress(campaign.collected, campaign.target)}
								max="100"
							></progress>
							<div class="text-right text-xs font-medium">
								{getProgress(campaign.collected, campaign.target)}%
							</div>
						</div>

						<div class="card-actions justify-end mt-4 pt-4 border-t border-base-200">
							<button
								class="btn btn-sm btn-outline btn-primary w-full"
								onclick={() => copyLink(campaign.id)}
							>
								<Share2 class="w-4 h-4" /> Bagikan
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if activeTab === 'transactions'}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-0">
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Donatur</th>
								<th>Program</th>
								<th>Jumlah</th>
								<th>Metode</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{#each data.transactions as trx}
								<tr class="hover:bg-base-200/50">
									<td>
										<div class="font-medium">{trx.donorName}</div>
										<div class="text-xs text-base-content/50">{formatDate(trx.date)}</div>
									</td>
									<td class="max-w-[200px] truncate" title={trx.campaign}>{trx.campaign}</td>
									<td class="font-medium text-success">+{formatCurrency(trx.amount)}</td>
									<td>
										<div class="flex items-center gap-2">
											{#if trx.paymentMethod === 'QRIS'}
												<QrCode class="w-4 h-4" />
											{:else if trx.paymentMethod === 'Transfer Bank'}
												<CreditCard class="w-4 h-4" />
											{:else}
												<Wallet class="w-4 h-4" />
											{/if}
											{trx.paymentMethod}
										</div>
									</td>
									<td>
										<Badge variant={trx.status === 'success' ? 'success' : 'warning'} size="sm">
											{trx.status === 'success' ? 'Berhasil' : 'Pending'}
										</Badge>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Campaign Modal -->
{#if showCampaignModal}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg mb-4">
				{isEditMode ? '✏️ Edit Program Donasi' : '💝 Buat Program Donasi'}
			</h3>
			<form
				method="POST"
				action={isEditMode ? '?/updateCampaign' : '?/createCampaign'}
				use:enhance={handleSubmit}
			>
				{#if isEditMode}
					<input type="hidden" name="id" value={selectedItem?.id} />
				{/if}
				<div class="space-y-4">
					<div class="form-control">
						<label class="label"><span class="label-text">Nama Program</span></label>
						<input
							type="text"
							name="title"
							class="input input-bordered w-full"
							bind:value={formTitle}
							required
							placeholder="Contoh: Renovasi Kubah"
						/>
					</div>
					<div class="form-control">
						<label class="label"><span class="label-text">Target Dana (Rp)</span></label>
						<input
							type="number"
							name="target"
							class="input input-bordered w-full"
							bind:value={formTarget}
							required
							placeholder="0"
						/>
					</div>
					<div class="form-control">
						<label for="deadline" class="label"><span class="label-text">Batas Waktu</span></label>
						<input
							type="date"
							name="deadline"
							class="input input-bordered w-full"
							bind:value={formDeadline}
							required
						/>
					</div>
					<div class="form-control">
						<label for="description" class="label"><span class="label-text">Deskripsi</span></label>
						<textarea
							name="description"
							class="textarea textarea-bordered h-24 w-full"
							bind:value={formDescription}
							placeholder="Jelaskan tujuan donasi..."
						></textarea>
					</div>
				</div>
				<div class="modal-action">
					<button type="button" class="btn btn-ghost" onclick={() => (showCampaignModal = false)}
						>Batal</button
					>
					<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
						{#if isSubmitting}<span class="loading loading-spinner loading-sm"></span>{:else}<Plus
								class="w-4 h-4"
							/>{/if}
						{isEditMode ? 'Simpan Perubahan' : 'Buat Program'}
					</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg text-error">⚠️ Hapus Data</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus data ini?</p>
			<div class="modal-action">
				<button class="btn btn-ghost" onclick={() => (showDeleteModal = false)}>Batal</button>
				<form method="POST" action="?/delete" use:enhance={handleDelete}>
					<input type="hidden" name="id" value={selectedItem?.id} />
					<button type="submit" class="btn btn-error"><Trash2 class="w-4 h-4" /> Hapus</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}
