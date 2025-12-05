<script lang="ts">
	import { Chart, Badge } from '$lib/components/ui';
	import { ArrowLeft, Download, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-svelte';

	let { data } = $props();

	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	// Chart options for daily breakdown
	const dailyChartOptions = {
		colors: ['#10b981', '#ef4444'],
		xaxis: {
			categories: data.dailyLabels || []
		},
		yaxis: {
			labels: {
				formatter: (val: number) => `Rp ${(val / 1000).toFixed(0)}rb`
			}
		},
		stroke: {
			curve: 'smooth',
			width: 2
		},
		chart: {
			toolbar: { show: false }
		}
	};

	const dailySeries = [
		{ name: 'Pemasukan', data: data.dailyIncome || [] },
		{ name: 'Pengeluaran', data: data.dailyExpense || [] }
	];

	// Stats
	const totalIncome = $derived(
		data.transactions
			?.filter((t: any) => t.type === 'income')
			.reduce((a: number, b: any) => a + b.amount, 0) || 0
	);
	const totalExpense = $derived(
		data.transactions
			?.filter((t: any) => t.type === 'expense')
			.reduce((a: number, b: any) => a + b.amount, 0) || 0
	);
	const netBalance = $derived(totalIncome - totalExpense);
</script>

<svelte:head>
	<title>Laporan {data.monthName} {data.year} | Keuangan | MiniMasjid</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<a href="/keuangan/laporan" class="btn btn-ghost btn-sm btn-square">
				<ArrowLeft class="w-5 h-5" />
			</a>
			<div>
				<h1 class="text-2xl font-bold">📊 Laporan {data.monthName} {data.year}</h1>
				<p class="text-base-content/60">Detail transaksi bulanan</p>
			</div>
		</div>
		<div class="dropdown dropdown-end">
			<button class="btn btn-primary btn-sm">
				<Download class="w-4 h-4" />
				Export
			</button>
			<ul class="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-48 p-2">
				<li><button>📊 Excel (.xlsx)</button></li>
				<li><button>📄 PDF Laporan</button></li>
			</ul>
		</div>
	</div>

	<!-- Summary Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<div class="stat bg-base-100 rounded-box shadow-sm">
			<div class="stat-figure text-success">
				<TrendingUp class="w-8 h-8" />
			</div>
			<div class="stat-title">Total Pemasukan</div>
			<div class="stat-value text-success text-xl">{formatCurrency(totalIncome)}</div>
		</div>
		<div class="stat bg-base-100 rounded-box shadow-sm">
			<div class="stat-figure text-error">
				<TrendingDown class="w-8 h-8" />
			</div>
			<div class="stat-title">Total Pengeluaran</div>
			<div class="stat-value text-error text-xl">{formatCurrency(totalExpense)}</div>
		</div>
		<div class="stat bg-base-100 rounded-box shadow-sm">
			<div class="stat-figure text-primary">
				<Wallet class="w-8 h-8" />
			</div>
			<div class="stat-title">Saldo Bersih</div>
			<div class="stat-value text-xl {netBalance >= 0 ? 'text-success' : 'text-error'}">
				{netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
			</div>
		</div>
	</div>

	<!-- Daily Chart -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-lg">📈 Tren Harian</h2>
			<Chart type="line" series={dailySeries} options={dailyChartOptions} height={300} />
		</div>
	</div>

	<!-- Category Breakdown -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h3 class="font-semibold text-success flex items-center gap-2">
					<TrendingUp class="w-5 h-5" />
					Pemasukan per Kategori
				</h3>
				<div class="space-y-3 mt-4">
					{#each data.incomeCategories || [] as cat}
						<div class="flex justify-between items-center">
							<span>{cat.name}</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-success w-24" value={cat.percentage} max="100"
								></progress>
								<span class="text-sm font-mono">{formatCurrency(cat.amount)}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h3 class="font-semibold text-error flex items-center gap-2">
					<TrendingDown class="w-5 h-5" />
					Pengeluaran per Kategori
				</h3>
				<div class="space-y-3 mt-4">
					{#each data.expenseCategories || [] as cat}
						<div class="flex justify-between items-center">
							<span>{cat.name}</span>
							<div class="flex items-center gap-2">
								<progress class="progress progress-error w-24" value={cat.percentage} max="100"
								></progress>
								<span class="text-sm font-mono">{formatCurrency(cat.amount)}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Transactions List -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-lg">📋 Daftar Transaksi</h2>
			<div class="overflow-x-auto">
				<table class="table table-sm">
					<thead>
						<tr>
							<th>Tanggal</th>
							<th>Keterangan</th>
							<th>Kategori</th>
							<th>Tipe</th>
							<th class="text-right">Jumlah</th>
						</tr>
					</thead>
					<tbody>
						{#each data.transactions || [] as tx}
							<tr class="hover:bg-base-200/50">
								<td>
									<div class="flex items-center gap-2">
										<Calendar class="w-4 h-4 text-base-content/50" />
										{new Date(tx.date).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short'
										})}
									</div>
								</td>
								<td>{tx.description}</td>
								<td>
									<Badge variant="ghost" size="sm">{tx.category}</Badge>
								</td>
								<td>
									<Badge variant={tx.type === 'income' ? 'success' : 'error'} size="sm">
										{tx.type === 'income' ? 'Masuk' : 'Keluar'}
									</Badge>
								</td>
								<td
									class="text-right font-mono {tx.type === 'income'
										? 'text-success'
										: 'text-error'}"
								>
									{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center py-8 text-base-content/50">
									Tidak ada transaksi
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
