<script lang="ts">

	import {
		FormInput,
		FormSelect,
		FormTextarea,
		Toast,
		success,
		error,
		warning,
		info,
		ConfirmModal,
		DataTable,
		StatsCard,
		Badge
	} from '$lib/components/ui';

	// Form state
	let name = $state('');
	let email = $state('');
	let category = $state('');
	let message = $state('');
	let formErrors = $state<Record<string, string>>({});

	// Modal state
	let showDeleteModal = $state(false);

	// Sample data for DataTable
	const donations = [
		{ id: 1, date: '2025-12-01', name: 'Ahmad', amount: 500000, status: 'success' },
		{ id: 2, date: '2025-12-02', name: 'Budi', amount: 250000, status: 'pending' },
		{ id: 3, date: '2025-12-03', name: 'Cindy', amount: 1000000, status: 'success' },
		{ id: 4, date: '2025-12-04', name: 'Dewi', amount: 750000, status: 'success' },
		{ id: 5, date: '2025-12-05', name: 'Eko', amount: 300000, status: 'pending' },
		{ id: 6, date: '2025-12-05', name: 'Fani', amount: 150000, status: 'failed' },
		{ id: 7, date: '2025-12-05', name: 'Gita', amount: 200000, status: 'success' },
		{ id: 8, date: '2025-12-05', name: 'Hadi', amount: 450000, status: 'success' },
		{ id: 9, date: '2025-12-05', name: 'Indra', amount: 600000, status: 'pending' },
		{ id: 10, date: '2025-12-05', name: 'Joko', amount: 800000, status: 'success' },
		{ id: 11, date: '2025-12-05', name: 'Kartika', amount: 350000, status: 'success' },
		{ id: 12, date: '2025-12-05', name: 'Lukman', amount: 900000, status: 'pending' }
	];

	const categoryOptions = [
		{ value: 'infaq', label: 'Infaq' },
		{ value: 'sedekah', label: 'Sedekah' },
		{ value: 'zakat', label: 'Zakat' },
		{ value: 'wakaf', label: 'Wakaf' }
	];

	// Form validation
	function validateForm() {
		const errors: Record<string, string> = {};
		if (!name) errors.name = 'Nama wajib diisi';
		if (!email) errors.email = 'Email wajib diisi';
		else if (!email.includes('@')) errors.email = 'Email tidak valid';
		if (!category) errors.category = 'Kategori wajib dipilih';
		formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	function handleSubmit() {
		if (validateForm()) {
			success('Form berhasil dikirim!');
			name = '';
			email = '';
			category = '';
			message = '';
			formErrors = {};
		} else {
			error('Mohon lengkapi form dengan benar');
		}
	}

	function handleDelete() {
		showDeleteModal = false;
		success('Data berhasil dihapus!');
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Demo Komponen - TadBeer</title>
</svelte:head>

<div class="space-y-8 container mx-auto px-4">
	<div>
		<h1 class="text-display text-primary">Demo Komponen UI</h1>
		<p class="text-caption mt-2">Showcase semua komponen UI yang tersedia</p>
	</div>

	<!-- Stats Cards -->
	<section class="space-y-4">
		<h2 class="text-headline">📊 Stats Cards</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title="Total Jamaah"
				value="1,234"
				icon="👥"
				trend="up"
				trendValue="12% dari bulan lalu"
			/>
			<StatsCard
				title="Donasi Bulan Ini"
				value="Rp 50jt"
				icon="💰"
				trend="up"
				trendValue="8% dari bulan lalu"
			/>
			<StatsCard title="Kegiatan" value="12" icon="📅" description="minggu ini" />
			<StatsCard title="Saldo Kas" value="Rp 75jt" icon="🏦" trend="neutral" trendValue="stabil" />
		</div>
	</section>

	<!-- Badges -->
	<section class="space-y-4">
		<h2 class="text-headline">🏷️ Badges</h2>
		<div class="flex flex-wrap gap-2">
			<Badge>Default</Badge>
			<Badge variant="primary">Primary</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="accent">Accent</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="error">Error</Badge>
		</div>
		<div class="flex flex-wrap gap-2">
			<Badge variant="primary" size="xs">XS</Badge>
			<Badge variant="primary" size="sm">SM</Badge>
			<Badge variant="primary" size="md">MD</Badge>
			<Badge variant="primary" size="lg">LG</Badge>
		</div>
		<div class="flex flex-wrap gap-2">
			<Badge variant="primary" outline>Outline Primary</Badge>
			<Badge variant="success" outline>Outline Success</Badge>
			<Badge variant="error" outline>Outline Error</Badge>
		</div>
	</section>

	<!-- Toast Notifications -->
	<section class="space-y-4">
		<h2 class="text-headline">🔔 Toast Notifications</h2>
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-success btn-sm" onclick={() => success('Operasi berhasil!')}>
				✓ Success Toast
			</button>
			<button class="btn btn-error btn-sm" onclick={() => error('Terjadi kesalahan!')}>
				✗ Error Toast
			</button>
			<button class="btn btn-warning btn-sm" onclick={() => warning('Perhatian!')}>
				⚠ Warning Toast
			</button>
			<button class="btn btn-info btn-sm" onclick={() => info('Informasi penting')}>
				ℹ Info Toast
			</button>
		</div>
	</section>

	<!-- Form Components -->
	<section class="space-y-4">
		<h2 class="text-headline">📝 Form Components</h2>
		<div class="card bg-base-200 shadow-md">
			<div class="card-body">
				<h3 class="card-title">Form Donasi</h3>
				<form
					class="grid grid-cols-1 md:grid-cols-2 gap-4"
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<FormInput
						label="Nama Lengkap"
						placeholder="Masukkan nama..."
						bind:value={name}
						error={formErrors.name}
						required
					/>
					<FormInput
						label="Email"
						type="email"
						placeholder="email@example.com"
						bind:value={email}
						error={formErrors.email}
						hint="Kami akan mengirim bukti donasi ke email ini"
					/>
					<FormSelect
						label="Kategori Donasi"
						options={categoryOptions}
						bind:value={category}
						error={formErrors.category}
					/>
					<FormInput label="Jumlah" type="number" placeholder="100000" hint="Minimal Rp 10.000" />
					<div class="md:col-span-2">
						<FormTextarea
							label="Catatan (Opsional)"
							placeholder="Tulis catatan atau doa..."
							bind:value={message}
							rows={3}
						/>
					</div>
					<div class="md:col-span-2 flex gap-2 justify-end">
						<button type="reset" class="btn btn-ghost">Reset</button>
						<button type="submit" class="btn btn-primary">Kirim Donasi</button>
					</div>
				</form>
			</div>
		</div>
	</section>

	<!-- Confirm Modal -->
	<section class="space-y-4">
		<h2 class="text-headline">🗑️ Confirm Modal</h2>
		<button class="btn btn-error" onclick={() => (showDeleteModal = true)}>
			Hapus Data (dengan konfirmasi)
		</button>
		<ConfirmModal
			bind:open={showDeleteModal}
			title="Konfirmasi Hapus"
			message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
			confirmText="Hapus"
			confirmClass="btn-error"
			onconfirm={handleDelete}
		/>
	</section>

	<!-- DataTable -->
	<section class="space-y-4">
		<h2 class="text-headline">📋 Data Table</h2>
		<div class="card bg-base-200 shadow-md">
			<div class="card-body">
				<h3 class="card-title">Daftar Donasi</h3>
				<DataTable
					data={donations}
					columns={[
						{ key: 'date', label: 'Tanggal', sortable: true },
						{ key: 'name', label: 'Nama', sortable: true },
						{ key: 'amount', label: 'Jumlah', sortable: true, class: 'text-right font-mono' },
						{ key: 'status', label: 'Status' }
					]}
					pageSize={5}
				/>
				<p class="text-caption mt-2">
					💡 Tip: Klik header kolom untuk sort, gunakan search untuk filter
				</p>
			</div>
		</div>
	</section>
</div>

<!-- Global Toast Container -->
<Toast />
