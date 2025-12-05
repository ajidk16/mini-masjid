<script lang="ts">
	import { page } from '$app/state';
	import { StatsCard, Chart } from '$lib/components/ui';
	import { Wallet, TrendingUp, TrendingDown, BarChart3, Plus, ArrowRight } from 'lucide-svelte';


	// Chart data for cashflow
	const cashflowSeries = $derived([
		{
			name: 'Pemasukan',
			data: page.data.cashflowData?.income || [0, 0, 0, 0, 0, 0]
		},
		{
			name: 'Pengeluaran',
			data: page.data.cashflowData?.expense || [0, 0, 0, 0, 0, 0]
		}
	]);

	const cashflowOptions = {
		colors: ['#10b981', '#ef4444'],
		xaxis: {
			categories: page.data.cashflowData?.months || ['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
		},
		yaxis: {
			labels: {
				formatter: (val: number) => `Rp ${(val / 1000000).toFixed(1)}jt`
			}
		},
		tooltip: {
			y: {
				formatter: (val: number) =>
					new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)
			}
		}
	};

	// Donut charts
	const incomeCategories = {
		series: page.data.incomeByCategory?.values || [45, 25, 18, 12],
		labels: page.data.incomeByCategory?.labels || ['Infaq', 'Zakat', 'Sadaqah', 'Wakaf']
	};

	const expenseCategories = {
		series: page.data.expenseByCategory?.values || [40, 30, 20, 10],
		labels: page.data.expenseByCategory?.labels || ['Operasional', 'Proyek', 'Gaji', 'Lainnya']
	};

	const categoryOptions = (labels: string[], colors: string[]) => ({
		colors,
		labels,
		legend: {
			position: 'bottom' as const
		},
		plotOptions: {
			pie: {
				donut: {
					size: '60%'
				}
			}
		}
	});

	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	function formatShortCurrency(value: number): string {
		if (value >= 1000000000) {
			return `Rp ${(value / 1000000000).toFixed(1)}M`;
		}
		if (value >= 1000000) {
			return `Rp ${(value / 1000000).toFixed(1)}jt`;
		}
		return formatCurrency(value);
	}
</script>

<svelte:head>
	<title>Keuangan | MiniMasjid</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">📊 Overview Keuangan</h1>
			<p class="text-base-content/60 mt-1">Ringkasan keuangan masjid bulan ini</p>
		</div>
		<div class="flex gap-2">
			<select class="select select-bordered select-sm">
				<option value="month">Bulan Ini</option>
				<option value="quarter">3 Bulan</option>
				<option value="year">Tahun Ini</option>
			</select>
			<button class="btn btn-sm btn-ghost">
				<BarChart3 class="w-4 h-4" />
				Export
			</button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatsCard
			title="Saldo Kas"
			value={formatShortCurrency(page.data.stats?.balance || 0)}
			icon="💰"
			trend={page.data.stats?.balanceTrend || 'up'}
			trendValue={page.data.stats?.balanceTrendValue || '+12%'}
			description="dari bulan lalu"
		/>
		<StatsCard
			title="Total Pemasukan"
			value={formatShortCurrency(page.data.stats?.totalIncome || 0)}
			icon="⬆️"
			trend="up"
			trendValue="+{page.data.stats?.incomeCount || 0} transaksi"
			description="bulan ini"
			class="border-l-4 border-l-success"
		/>
		<StatsCard
			title="Total Pengeluaran"
			value={formatShortCurrency(page.data.stats?.totalExpense || 0)}
			icon="⬇️"
			trend="down"
			trendValue="{page.data.stats?.expenseCount || 0} transaksi"
			description="bulan ini"
			class="border-l-4 border-l-error"
		/>
		<StatsCard
			title="Trend"
			value={page.data.stats?.trendPercentage || '+12%'}
			icon="📈"
			trend={page.data.stats?.trendDirection || 'up'}
			trendValue="vs bulan lalu"
			description="pertumbuhan"
		/>
	</div>

	<!-- Quick Actions -->
	<div class="flex flex-wrap gap-2">
		<a href="/keuangan/pemasukan/tambah" class="btn btn-primary btn-sm">
			<Plus class="w-4 h-4" />
			Catat Pemasukan
		</a>
		<a href="/keuangan/pengeluaran/tambah" class="btn btn-error btn-outline btn-sm">
			<Plus class="w-4 h-4" />
			Catat Pengeluaran
		</a>
		<a href="/keuangan/laporan" class="btn btn-ghost btn-sm">
			Lihat Laporan
			<ArrowRight class="w-4 h-4" />
		</a>
	</div>

	<!-- Charts Section -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Main Chart - Cashflow -->
		<div class="lg:col-span-2 card bg-base-100 shadow-sm">
			<div class="card-body">
				<div class="flex items-center justify-between mb-2">
					<h2 class="card-title text-lg">📊 Arus Kas Bulanan</h2>
					<select class="select select-bordered select-xs">
						<option value="6">6 Bulan</option>
						<option value="12">12 Bulan</option>
					</select>
				</div>
				<Chart type="area" series={cashflowSeries} options={cashflowOptions} height={320} />
			</div>
		</div>

		<!-- Side Stats -->
		<div class="space-y-4">
			<!-- Income Categories -->
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-4">
					<h3 class="font-semibold text-sm mb-2">🥧 Kategori Pemasukan</h3>
					<Chart
						type="donut"
						series={incomeCategories.series}
						options={categoryOptions(incomeCategories.labels, [
							'#10b981',
							'#f59e0b',
							'#3b82f6',
							'#8b5cf6'
						])}
						height={200}
					/>
				</div>
			</div>

			<!-- Expense Categories -->
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-4">
					<h3 class="font-semibold text-sm mb-2">🥧 Kategori Pengeluaran</h3>
					<Chart
						type="donut"
						series={expenseCategories.series}
						options={categoryOptions(expenseCategories.labels, [
							'#ef4444',
							'#f97316',
							'#eab308',
							'#6b7280'
						])}
						height={200}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Transactions -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<div class="flex items-center justify-between mb-4">
				<h2 class="card-title text-lg">📋 Transaksi Terakhir</h2>
				<a href="/keuangan/pemasukan" class="btn btn-ghost btn-sm">
					Lihat Semua
					<ArrowRight class="w-4 h-4" />
				</a>
			</div>

			<div class="overflow-x-auto">
				<table class="table table-sm">
					<thead>
						<tr>
							<th>Tanggal</th>
							<th>Keterangan</th>
							<th>Kategori</th>
							<th class="text-right">Jumlah</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#if page.data.recentTransactions && page.data.recentTransactions.length > 0}
							{#each page.data.recentTransactions as tx}
								<tr class="hover:bg-base-200/50">
									<td class="text-sm"
										>{new Date(tx.date).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short'
										})}</td
									>
									<td>
										<span class="font-medium">{tx.description}</span>
									</td>
									<td>
										<span class="badge badge-ghost badge-sm">{tx.category}</span>
									</td>
									<td
										class="text-right font-mono {tx.type === 'income'
											? 'text-success'
											: 'text-error'}"
									>
										{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
									</td>
									<td>
										<span class="badge badge-success badge-xs">✓</span>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="5" class="text-center py-8 text-base-content/50">
									Belum ada transaksi
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
