<script lang="ts">
	import { page } from '$app/state';
	import { StatsCard, Chart, QuickActionCard } from '$lib/components/ui';
	import {
		Wallet,
		Calendar,
		Users,
		Heart,
		TrendingUp,
		TrendingDown,
		ArrowRight
	} from 'lucide-svelte';


	// Derived user info (avoid type issues with union types)
	const userName = $derived((page.data.user as any)?.name || 'Pengguna');
	const userRole = $derived((page.data.user as any)?.role || 'jamaah');

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
			categories: page.data.cashflowData?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']
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

	// Donut chart for income categories
	const categoryData = $derived({
		series: page.data.categoryData?.values || [40, 25, 20, 15],
		labels: page.data.categoryData?.labels || ['Infaq', 'Zakat', 'Sadaqah', 'Wakaf']
	});

	const categoryOptions = {
		colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
		// svelte-ignore state_referenced_locally
		labels: categoryData.labels,
		legend: {
			position: 'bottom' as const
		},
		plotOptions: {
			pie: {
				donut: {
					size: '65%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Total',
							formatter: () => `Rp ${((page.data.stats?.totalDonation || 0) / 1000000).toFixed(1)}jt`
						}
					}
				}
			}
		}
	};

	// Quick action items
	const quickActions = [
		{
			href: '/keuangan/tambah',
			title: 'Catat Keuangan',
			description: 'Input pemasukan/pengeluaran',
			icon: Wallet
		},
		{
			href: '/kegiatan/tambah',
			title: 'Buat Kegiatan',
			description: 'Jadwalkan acara baru',
			icon: Calendar
		},
		{
			href: '/jamaah',
			title: 'Data Jamaah',
			description: 'Kelola anggota masjid',
			icon: Users,
			badge: page.data.stats?.newMembers || 0,
			badgeType: 'success' as const
		},
		{
			href: '/donasi',
			title: 'Donasi Online',
			description: 'Lihat donasi masuk',
			icon: Heart,
			badge: page.data.stats?.pendingDonations || 0,
			badgeType: 'warning' as const
		}
	];

	// Format currency
	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return `Rp ${(value / 1000000).toFixed(1)}jt`;
		}
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
	}

	// Get greeting based on time
	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) return 'Selamat Pagi';
		if (hour < 15) return 'Selamat Siang';
		if (hour < 18) return 'Selamat Sore';
		return 'Selamat Malam';
	}

	// Format date
	function formatDate(): string {
		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date());
	}
</script>

<svelte:head>
	<title>Dashboard | TadBeer</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header Section -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
		<div>
			<h1 class="text-2xl lg:text-3xl font-bold">
				{getGreeting()}, <span class="text-primary">{userName}</span>! 👋
			</h1>
			<p class="text-base-content/60 mt-1">{formatDate()}</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="badge badge-primary badge-outline">{userRole}</span>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatsCard
			title="Saldo Kas"
			value={formatCurrency(page.data.stats?.balance || 0)}
			icon="💰"
			trend={page.data.stats?.balanceTrend || 'neutral'}
			trendValue={page.data.stats?.balanceTrendValue || '0%'}
			description="dari bulan lalu"
		/>
		<StatsCard
			title="Kegiatan Bulan Ini"
			value={page.data.stats?.eventsThisMonth || 0}
			icon="📅"
			trend="up"
			trendValue={`+${page.data.stats?.newEvents || 0}`}
			description="kegiatan baru"
		/>
		<StatsCard
			title="Total Jamaah"
			value={page.data.stats?.totalMembers || 0}
			icon="👥"
			trend="up"
			trendValue={`+${page.data.stats?.newMembers || 0}`}
			description="anggota baru"
		/>
		<StatsCard
			title="Donasi Bulan Ini"
			value={formatCurrency(page.data.stats?.donationThisMonth || 0)}
			icon="🤲"
			trend={page.data.stats?.donationTrend || 'up'}
			trendValue={page.data.stats?.donationTrendValue || '+15%'}
			description="dari bulan lalu"
		/>
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column: Charts -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Cashflow Chart -->
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<div class="flex items-center justify-between mb-4">
						<h2 class="card-title text-lg">📊 Arus Kas Bulanan</h2>
						<select class="select select-bordered select-sm">
							<option value="6">6 Bulan Terakhir</option>
							<option value="12">12 Bulan Terakhir</option>
						</select>
					</div>
					<Chart type="area" series={cashflowSeries} options={cashflowOptions} height={320} />
				</div>
			</div>

			<!-- Two Column Charts -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Category Donut -->
				<div class="card bg-base-100 shadow-sm">
					<div class="card-body">
						<h2 class="card-title text-base">🥧 Kategori Pemasukan</h2>
						<Chart
							type="donut"
							series={categoryData.series}
							options={categoryOptions}
							height={280}
						/>
					</div>
				</div>

				<!-- Upcoming Events -->
				<div class="card bg-base-100 shadow-sm">
					<div class="card-body">
						<div class="flex items-center justify-between mb-2">
							<h2 class="card-title text-base">📅 Kegiatan Mendatang</h2>
							<a href="/admin/kegiatan" class="btn btn-ghost btn-xs">
								Lihat semua
								<ArrowRight class="w-3 h-3" />
							</a>
						</div>
						<div class="space-y-3">
							{#if page.data.upcomingEvents && page.data.upcomingEvents.length > 0}
								{#each page.data.upcomingEvents.slice(0, 4) as event}
									<div
										class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200/50 transition-colors"
									>
										<div
											class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary"
										>
											{new Date(event.date).getDate()}
										</div>
										<div class="flex-1 min-w-0">
											<p class="font-medium text-sm truncate">{event.title}</p>
											<p class="text-xs text-base-content/60">{event.time} • {event.location}</p>
										</div>
									</div>
								{/each}
							{:else}
								<div class="text-center py-6 text-base-content/50">
									<Calendar class="w-10 h-10 mx-auto mb-2 opacity-30" />
									<p class="text-sm">Tidak ada kegiatan mendatang</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Column: Quick Actions & Notifications -->
		<div class="space-y-6">
			<!-- Quick Actions -->
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<h2 class="card-title text-lg mb-2">⚡ Aksi Cepat</h2>
					<div class="space-y-3">
						{#each quickActions as action}
							<QuickActionCard
								href={action.href}
								title={action.title}
								description={action.description}
								icon={action.icon}
								badge={action.badge}
								badgeType={action.badgeType}
							/>
						{/each}
					</div>
				</div>
			</div>

			<!-- Recent Notifications / Activity -->
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<div class="flex items-center justify-between mb-2">
						<h2 class="card-title text-lg">🔔 Aktivitas Terbaru</h2>
						<a href="/admin/notifications" class="btn btn-ghost btn-xs">Semua</a>
					</div>
					<div class="space-y-3">
						{#if page.data.recentActivity && page.data.recentActivity.length > 0}
							{#each page.data.recentActivity.slice(0, 5) as activity}
								<div class="flex items-start gap-3 p-2 border-l-2 border-primary/30 pl-4">
									<div class="flex-1">
										<p class="text-sm">{activity.message}</p>
										<p class="text-xs text-base-content/50 mt-1">{activity.time}</p>
									</div>
								</div>
							{/each}
						{:else}
							<div class="text-center py-6 text-base-content/50">
								<p class="text-sm">Belum ada aktivitas terbaru</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
