<script lang="ts">
	import { Chart } from '$lib/components/ui';
	import { Download, FileText, Calendar } from 'lucide-svelte';

	let { data } = $props();

	// Selected period
	let selectedYear = $state(new Date().getFullYear());
	let selectedMonth = $state<number | null>(null);

	// Chart options
	const monthlyChartOptions = {
		colors: ['#10b981', '#ef4444'],
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'Mei',
				'Jun',
				'Jul',
				'Agu',
				'Sep',
				'Okt',
				'Nov',
				'Des'
			]
		},
		yaxis: {
			labels: {
				formatter: (val: number) => `Rp ${(val / 1000000).toFixed(0)}jt`
			}
		}
	};

	const monthlySeries = [
		{
			name: 'Pemasukan',
			data: data.monthlyIncome || Array(12).fill(0)
		},
		{
			name: 'Pengeluaran',
			data: data.monthlyExpense || Array(12).fill(0)
		}
	];

	// Calculate totals
	const totalYearIncome = $derived(
		(data.monthlyIncome || []).reduce((a: number, b: number) => a + b, 0)
	);
	const totalYearExpense = $derived(
		(data.monthlyExpense || []).reduce((a: number, b: number) => a + b, 0)
	);
	const netBalance = $derived(totalYearIncome - totalYearExpense);

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(value);
	}

	function formatShortCurrency(value: number): string {
		if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
		if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
		return formatCurrency(value);
	}
</script>

<svelte:head>
	<title>Laporan Keuangan | MiniMasjid</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">📄 Laporan Keuangan</h1>
			<p class="text-base-content/60 mt-1">Laporan bulanan dan tahunan</p>
		</div>
		<div class="flex gap-2">
			<select class="select select-bordered select-sm" bind:value={selectedYear}>
				{#each [2025, 2024, 2023] as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
			<div class="dropdown dropdown-end">
				<button class="btn btn-primary btn-sm">
					<Download class="w-4 h-4" />
					Export
				</button>
				<ul class="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-48 p-2">
					<li><button>📊 Excel (.xlsx)</button></li>
					<li><button>📄 PDF Laporan</button></li>
					<li><button>🖨️ Print</button></li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Yearly Summary Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="stat bg-base-100 rounded-box shadow-sm">
			<div class="stat-title">Total Pemasukan {selectedYear}</div>
			<div class="stat-value text-success text-2xl">{formatShortCurrency(totalYearIncome)}</div>
		</div>
		<div class="stat bg-base-100 rounded-box shadow-sm">
			<div class="stat-title">Total Pengeluaran {selectedYear}</div>
			<div class="stat-value text-error text-2xl">{formatShortCurrency(totalYearExpense)}</div>
		</div>
		<div class="stat bg-base-100 rounded-box shadow-sm">
			<div class="stat-title">Saldo Bersih</div>
			<div class="stat-value text-2xl {netBalance >= 0 ? 'text-success' : 'text-error'}">
				{netBalance >= 0 ? '+' : ''}{formatShortCurrency(netBalance)}
			</div>
		</div>
	</div>

	<!-- Monthly Chart -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-lg">📊 Arus Kas Bulanan {selectedYear}</h2>
			<Chart type="bar" series={monthlySeries} options={monthlyChartOptions} height={350} />
		</div>
	</div>

	<!-- Monthly Breakdown Table -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-lg">📋 Rincian Per Bulan</h2>

			<div class="overflow-x-auto">
				<table class="table table-sm">
					<thead>
						<tr>
							<th>Bulan</th>
							<th class="text-right">Pemasukan</th>
							<th class="text-right">Pengeluaran</th>
							<th class="text-right">Selisih</th>
							<th class="text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'] as month, i}
							{@const income = data.monthlyIncome?.[i] || 0}
							{@const expense = data.monthlyExpense?.[i] || 0}
							{@const diff = income - expense}
							<tr class="hover:bg-base-200/50">
								<td>
									<div class="flex items-center gap-2">
										<Calendar class="w-4 h-4 text-base-content/50" />
										{month}
									</div>
								</td>
								<td class="text-right font-mono text-success">
									+{formatCurrency(income)}
								</td>
								<td class="text-right font-mono text-error">
									-{formatCurrency(expense)}
								</td>
								<td class="text-right font-mono {diff >= 0 ? 'text-success' : 'text-error'}">
									{diff >= 0 ? '+' : ''}{formatCurrency(diff)}
								</td>
								<td class="text-center">
									<a
										href="/keuangan/laporan/{selectedYear}-{String(i + 1).padStart(2, '0')}"
										class="btn btn-ghost btn-xs"
										title="Lihat Detail"
									>
										<FileText class="w-4 h-4" />
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="font-bold bg-base-200">
							<td>TOTAL</td>
							<td class="text-right font-mono text-success">
								+{formatCurrency(totalYearIncome)}
							</td>
							<td class="text-right font-mono text-error">
								-{formatCurrency(totalYearExpense)}
							</td>
							<td class="text-right font-mono {netBalance >= 0 ? 'text-success' : 'text-error'}">
								{netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
							</td>
							<td></td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	</div>

	<!-- Category Breakdown -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h3 class="font-semibold">📈 Pemasukan per Kategori</h3>
				<Chart
					type="pie"
					series={data.incomeByCategory?.values || [45, 25, 18, 12]}
					options={{
						labels: data.incomeByCategory?.labels || ['Infaq', 'Zakat', 'Sadaqah', 'Wakaf'],
						colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
					}}
					height={250}
				/>
			</div>
		</div>
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h3 class="font-semibold">📉 Pengeluaran per Kategori</h3>
				<Chart
					type="pie"
					series={data.expenseByCategory?.values || [40, 30, 20, 10]}
					options={{
						labels: data.expenseByCategory?.labels || ['Operasional', 'Proyek', 'Gaji', 'Lainnya'],
						colors: ['#ef4444', '#f97316', '#eab308', '#6b7280']
					}}
					height={250}
				/>
			</div>
		</div>
	</div>
</div>
