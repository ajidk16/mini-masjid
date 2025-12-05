<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, Toast, success as toastSuccess, error as toastError } from '$lib/components/ui';
	import { Plus, Download, Eye, SquarePen, Trash2, X, Save } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	// Filter states
	let searchQuery = $state('');
	let selectedCategory = $state('');

	// Modal states
	let showDetailModal = $state(false);
	let showDeleteModal = $state(false);
	let showFormModal = $state(false);
	let isEditMode = $state(false);
	let selectedTransaction = $state<(typeof data.transactions)[0] | null>(null);
	let isSubmitting = $state(false);

	// Form fields
	let formDate = $state('');
	let formCategory = $state('');
	let formAmount = $state('');
	let formAmountFormatted = $state('');
	let formDescription = $state('');
	let formNotes = $state('');

	// Toast on form result
	let lastFormId = $state<string | null>(null);
	onMount(() => {
		const formId = form?.success ? 'success' : form?.error ? 'error' : null;
		if (formId && formId !== lastFormId) {
			lastFormId = formId;
			if (form?.success) {
				toastSuccess(form.message || 'Berhasil!');
			} else if (form?.error) {
				toastError(form.error);
			}
		}
	});

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	function formatAmountInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '');
		formAmount = value;
		formAmountFormatted = value ? new Intl.NumberFormat('id-ID').format(Number(value)) : '';
		input.value = formAmountFormatted;
	}

	const filteredTransactions = $derived(() => {
		let result = data.transactions || [];
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(tx) =>
					tx.description.toLowerCase().includes(query) || tx.category.toLowerCase().includes(query)
			);
		}
		if (selectedCategory) result = result.filter((tx) => tx.category === selectedCategory);
		return result;
	});

	const totalAmount = $derived(filteredTransactions().reduce((sum, tx) => sum + tx.amount, 0));

	function openAddModal() {
		isEditMode = false;
		selectedTransaction = null;
		formDate = new Date().toISOString().split('T')[0];
		formCategory = '';
		formAmount = '';
		formAmountFormatted = '';
		formDescription = '';
		formNotes = '';
		showFormModal = true;
	}

	function openEditModal(tx: (typeof data.transactions)[0]) {
		isEditMode = true;
		selectedTransaction = tx;
		formDate = tx.date.split('T')[0];
		formCategory = tx.category;
		formAmount = tx.amount.toString();
		formAmountFormatted = new Intl.NumberFormat('id-ID').format(tx.amount);
		formDescription = tx.description;
		formNotes = tx.notes || '';
		showFormModal = true;
	}

	function closeFormModal() {
		showFormModal = false;
		selectedTransaction = null;
		isSubmitting = false;
	}

	function openDetail(tx: (typeof data.transactions)[0]) {
		selectedTransaction = tx;
		showDetailModal = true;
	}

	function openDelete(tx: (typeof data.transactions)[0]) {
		selectedTransaction = tx;
		showDeleteModal = true;
	}

	function handleFormSubmit() {
		return async ({ result, update }: any) => {
			isSubmitting = false;
			if (result.type === 'success') {
				toastSuccess(isEditMode ? 'Berhasil diperbarui' : 'Berhasil ditambahkan');
				closeFormModal();
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menyimpan');
			}
		};
	}

	function handleDelete() {
		return async ({ result, update }: any) => {
			showDeleteModal = false;
			selectedTransaction = null;
			if (result.type === 'success') {
				toastSuccess('Transaksi berhasil dihapus');
				await update();
			} else if (result.type === 'failure') {
				toastError(result.data?.error || 'Gagal menghapus');
			}
		};
	}
</script>

<svelte:head>
	<title>Pengeluaran | Keuangan | MiniMasjid</title>
</svelte:head>

<Toast />

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">💸 Pengeluaran</h1>
			<p class="text-base-content/60 mt-1">Kelola data pengeluaran masjid</p>
		</div>
		<button class="btn btn-error" onclick={openAddModal}>
			<Plus class="w-4 h-4" />
			Tambah Pengeluaran
		</button>
	</div>

	<div class="stats stats-vertical sm:stats-horizontal shadow w-full">
		<div class="stat">
			<div class="stat-title">Total Pengeluaran</div>
			<div class="stat-value text-error text-xl">{formatCurrency(data.totalExpense || 0)}</div>
			<div class="stat-desc">Bulan ini</div>
		</div>
		<div class="stat">
			<div class="stat-title">Jumlah Transaksi</div>
			<div class="stat-value text-xl">{data.transactionCount || 0}</div>
			<div class="stat-desc">transaksi</div>
		</div>
		<div class="stat">
			<div class="stat-title">Terbesar</div>
			<div class="stat-value text-xl">{formatCurrency(data.largestExpense || 0)}</div>
			<div class="stat-desc">single transaction</div>
		</div>
	</div>

	<div class="flex flex-wrap gap-3 items-center">
		<div class="flex-1 min-w-[200px]">
			<input
				type="text"
				placeholder="Cari transaksi..."
				class="input input-bordered w-full input-sm w-full"
				bind:value={searchQuery}
			/>
		</div>
		<select class="select select-bordered select-sm" bind:value={selectedCategory}>
			<option value="">Semua Kategori</option>
			{#each data.categories || [] as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
		<div class="dropdown dropdown-end">
			<button class="btn btn-ghost btn-sm">
				<Download class="w-4 h-4" />
				Export
			</button>
			<ul class="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-40 p-2">
				<li><button>Excel (.xlsx)</button></li>
				<li><button>PDF</button></li>
			</ul>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-0">
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Tanggal</th>
							<th>Keterangan</th>
							<th>Kategori</th>
							<th class="text-right">Jumlah</th>
							<th class="text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredTransactions() as tx (tx.id)}
							<tr class="hover:bg-base-200/50">
								<td>
									{new Date(tx.date).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})}
								</td>
								<td>
									<div class="font-medium">{tx.description}</div>
									{#if tx.notes}<div class="text-xs text-base-content/50">{tx.notes}</div>{/if}
								</td>
								<td><Badge variant="ghost">{tx.category}</Badge></td>
								<td class="text-right">
									<span class="font-mono text-error font-medium">-{formatCurrency(tx.amount)}</span>
								</td>
								<td>
									<div class="flex justify-center gap-1">
										<button class="btn btn-ghost btn-xs btn-square" onclick={() => openDetail(tx)}>
											<Eye class="w-4 h-4" />
										</button>
										<button
											class="btn btn-ghost btn-xs btn-square"
											onclick={() => openEditModal(tx)}
										>
											<SquarePen class="w-4 h-4" />
										</button>
										<button
											class="btn btn-ghost btn-xs btn-square text-error"
											onclick={() => openDelete(tx)}
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center py-12 text-base-content/50">
									<p class="text-lg mb-2">📭</p>
									<p>Tidak ada data pengeluaran</p>
								</td>
							</tr>
						{/each}
					</tbody>
					{#if filteredTransactions().length > 0}
						<tfoot>
							<tr class="bg-base-200/50">
								<td colspan="3" class="font-semibold">Total</td>
								<td class="text-right font-mono text-error font-bold"
									>-{formatCurrency(totalAmount)}</td
								>
								<td></td>
							</tr>
						</tfoot>
					{/if}
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Add/Edit Modal -->
{#if showFormModal}
	<dialog class="modal modal-open">
		<div class="modal-box max-w-lg">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={closeFormModal}
			>
				<X class="w-4 h-4" />
			</button>

			<h3 class="font-bold text-lg mb-4">
				{isEditMode ? '✏️ Edit Pengeluaran' : '➕ Tambah Pengeluaran'}
			</h3>

			<form
				method="POST"
				action={isEditMode ? '?/update' : '?/create'}
				use:enhance={() => {
					isSubmitting = true;
					return handleFormSubmit();
				}}
				class="space-y-4"
			>
				{#if isEditMode && selectedTransaction}
					<input type="hidden" name="id" value={selectedTransaction.id} />
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label"><span class="label-text">Tanggal *</span></label>
						<input
							type="date"
							name="date"
							class="input input-bordered w-full"
							value={formDate}
							required
						/>
					</div>
					<div class="form-control">
						<label class="label"><span class="label-text">Kategori *</span></label>
						<select name="category" class="select select-bordered" required>
							<option value="" disabled selected={!formCategory}>Pilih</option>
							<option value="Operasional" selected={formCategory === 'Operasional'}
								>Operasional</option
							>
							<option value="Proyek" selected={formCategory === 'Proyek'}>Proyek</option>
							<option value="Gaji" selected={formCategory === 'Gaji'}>Gaji</option>
							<option value="Lainnya" selected={formCategory === 'Lainnya'}>Lainnya</option>
						</select>
					</div>
				</div>

				<div class="form-control">
					<label class="label"><span class="label-text">Jumlah *</span></label>
					<label class="input input-bordered w-full flex items-center gap-2">
						<span class="text-base-content/60">Rp</span>
						<input
							type="text"
							class="grow"
							placeholder="0"
							required
							value={formAmountFormatted}
							oninput={formatAmountInput}
						/>
					</label>
					<input type="hidden" name="amountRaw" value={formAmount} />
				</div>

				<div class="form-control">
					<label class="label"><span class="label-text">Keterangan *</span></label>
					<input
						type="text"
						name="description"
						class="input input-bordered w-full"
						placeholder="Contoh: Pembayaran listrik"
						value={formDescription}
						required
					/>
				</div>

				<div class="form-control">
					<label class="label"><span class="label-text">Catatan</span></label>
					<textarea
						name="notes"
						class="textarea textarea-bordered w-full"
						rows="2"
						placeholder="Catatan tambahan..."
						value={formNotes}
					></textarea>
				</div>

				<div class="modal-action">
					<button type="button" class="btn btn-ghost" onclick={closeFormModal}>Batal</button>
					<button type="submit" class="btn btn-error" disabled={isSubmitting}>
						{#if isSubmitting}<span class="loading loading-spinner loading-sm"></span>{:else}<Save
								class="w-4 h-4"
							/>{/if}
						Simpan
					</button>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={closeFormModal}>close</button>
		</form>
	</dialog>
{/if}

<!-- Detail Modal -->
{#if showDetailModal && selectedTransaction}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					showDetailModal = false;
					selectedTransaction = null;
				}}
			>
				<X class="w-4 h-4" />
			</button>
			<h3 class="font-bold text-lg mb-4">📋 Detail Transaksi</h3>
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-base-content/60">Tanggal</p>
						<p class="font-medium">
							{new Date(selectedTransaction.date).toLocaleDateString('id-ID', {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						</p>
					</div>
					<div>
						<p class="text-sm text-base-content/60">Kategori</p>
						<Badge variant="error">{selectedTransaction.category}</Badge>
					</div>
				</div>
				<div>
					<p class="text-sm text-base-content/60">Keterangan</p>
					<p class="font-medium">{selectedTransaction.description}</p>
				</div>
				<div>
					<p class="text-sm text-base-content/60">Jumlah</p>
					<p class="text-2xl font-bold text-error">-{formatCurrency(selectedTransaction.amount)}</p>
				</div>
				{#if selectedTransaction.notes}
					<div>
						<p class="text-sm text-base-content/60">Catatan</p>
						<p class="text-sm bg-base-200 rounded-lg p-3">{selectedTransaction.notes}</p>
					</div>
				{/if}
			</div>
			<div class="modal-action">
				<button
					class="btn btn-primary btn-sm"
					onclick={() => {
						showDetailModal = false;
						openEditModal(selectedTransaction!);
					}}
				>
					<SquarePen class="w-4 h-4" /> Edit
				</button>
				<button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showDetailModal = false;
						selectedTransaction = null;
					}}>Tutup</button
				>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDetailModal = false;
					selectedTransaction = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal && selectedTransaction}
	<dialog class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg text-error">⚠️ Hapus Transaksi</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus transaksi ini?</p>
			<div class="bg-base-200 rounded-lg p-4 mb-4">
				<p class="font-medium">{selectedTransaction.description}</p>
				<p class="text-error font-mono">-{formatCurrency(selectedTransaction.amount)}</p>
				<p class="text-sm text-base-content/60">
					{new Date(selectedTransaction.date).toLocaleDateString('id-ID')}
				</p>
			</div>
			<div class="modal-action">
				<button
					class="btn btn-ghost"
					onclick={() => {
						showDeleteModal = false;
						selectedTransaction = null;
					}}>Batal</button
				>
				<form method="POST" action="?/delete" use:enhance={() => handleDelete()}>
					<input type="hidden" name="id" value={selectedTransaction.id} />
					<button type="submit" class="btn btn-error"><Trash2 class="w-4 h-4" /> Hapus</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button
				onclick={() => {
					showDeleteModal = false;
					selectedTransaction = null;
				}}>close</button
			>
		</form>
	</dialog>
{/if}
