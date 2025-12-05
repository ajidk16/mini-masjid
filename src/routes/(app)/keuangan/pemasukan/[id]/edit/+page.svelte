<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		FormInput,
		FormSelect,
		FormTextarea,
		Toast,
		success as toastSuccess,
		error as toastError
	} from '$lib/components/ui';
	import { ArrowLeft, Save, X, Trash2 } from 'lucide-svelte';

	let { data, form } = $props();

	// Form states
	let isSubmitting = $state(false);
	let amount = $state(data.transaction?.amount?.toString() || '');
	let formattedAmount = $state('');

	// Format amount on load
	$effect(() => {
		if (amount && !formattedAmount) {
			formattedAmount = new Intl.NumberFormat('id-ID').format(Number(amount));
		}
	});

	function formatAmount(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '');
		const formatted = new Intl.NumberFormat('id-ID').format(Number(value));
		amount = value;
		formattedAmount = formatted;
		input.value = formatted;
	}

	function handleSubmit() {
		return async ({ result, update }: any) => {
			isSubmitting = false;
			if (result.type === 'redirect') {
				toastSuccess('Transaksi berhasil diperbarui');
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
	<title>Edit Pemasukan | Keuangan | MiniMasjid</title>
</svelte:head>

<Toast />

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/keuangan/pemasukan" class="btn btn-ghost btn-sm btn-square">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold">✏️ Edit Pemasukan</h1>
			<p class="text-base-content/60">Perbarui data transaksi pemasukan</p>
		</div>
	</div>

	<!-- Form -->
	<form
		method="POST"
		action="?/update"
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

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Tanggal -->
				<FormInput
					label="Tanggal"
					name="date"
					type="date"
					value={data.transaction?.date?.split('T')[0] || ''}
					required
				/>

				<!-- Kategori -->
				<FormSelect
					label="Kategori"
					name="category"
					required
					value={data.transaction?.category || ''}
					options={[
						{ value: '', label: 'Pilih kategori', disabled: true },
						{ value: 'Infaq', label: 'Infaq' },
						{ value: 'Zakat', label: 'Zakat' },
						{ value: 'Sadaqah', label: 'Sadaqah' },
						{ value: 'Wakaf', label: 'Wakaf' },
						{ value: 'Lainnya', label: 'Lainnya' }
					]}
				/>
			</div>

			<!-- Jumlah -->
			<div class="form-control">
				<label class="label">
					<span class="label-text">Jumlah <span class="text-error">*</span></span>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<span class="text-base-content/60">Rp</span>
					<input
						type="text"
						name="amount"
						class="grow"
						placeholder="0"
						required
						value={formattedAmount}
						oninput={formatAmount}
					/>
				</label>
				<input type="hidden" name="amountRaw" value={amount} />
			</div>

			<!-- Keterangan -->
			<FormInput
				label="Keterangan"
				name="description"
				placeholder="Contoh: Infaq Jumat Minggu I Desember"
				value={data.transaction?.description || ''}
				required
			/>

			<!-- Catatan -->
			<FormTextarea
				label="Catatan (opsional)"
				name="notes"
				placeholder="Catatan tambahan..."
				rows={3}
				value={data.transaction?.notes || ''}
			/>

			<!-- Actions -->
			<div class="flex justify-between pt-4 border-t border-base-200">
				<a
					href="/keuangan/pemasukan/{data.transaction?.id}/delete"
					class="btn btn-ghost text-error btn-sm"
					onclick={(e) => {
						e.preventDefault();
						if (confirm('Yakin ingin menghapus transaksi ini?')) {
							const form = document.createElement('form');
							form.method = 'POST';
							form.action = '?/delete';
							const input = document.createElement('input');
							input.type = 'hidden';
							input.name = 'id';
							input.value = data.transaction?.id || '';
							form.appendChild(input);
							document.body.appendChild(form);
							form.submit();
						}
					}}
				>
					<Trash2 class="w-4 h-4" />
					Hapus
				</a>

				<div class="flex gap-2">
					<a href="/keuangan/pemasukan" class="btn btn-ghost">
						<X class="w-4 h-4" />
						Batal
					</a>
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
		</div>
	</form>
</div>
