<script lang="ts">
	import {
		Calendar,
		MapPin,
		Clock,
		Users,
		ChevronLeft,
		ChevronRight,
		List,
		Grid
	} from 'lucide-svelte';
	import { Badge } from '$lib/components/ui';

	// Mock Data
	const events = [
		{
			id: 1,
			title: "Kajian Rutin Ba'da Maghrib",
			date: new Date(2023, 11, 15, 18, 30),
			location: 'Ruang Utama Masjid',
			speaker: 'Ustadz Abdullah',
			type: 'kajian',
			image:
				'https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=800&auto=format&fit=crop&q=60'
		},
		{
			id: 2,
			title: 'Sholat Jumat Berjamaah',
			date: new Date(2023, 11, 17, 11, 45),
			location: 'Ruang Utama & Lantai 2',
			speaker: 'Khatib: Ustadz Fulan',
			type: 'ibadah',
			image:
				'https://images.unsplash.com/photo-1584661009405-24227445c743?w=800&auto=format&fit=crop&q=60'
		},
		{
			id: 3,
			title: 'Buka Puasa Bersama Senin Kamis',
			date: new Date(2023, 11, 18, 17, 45),
			location: 'Selasar Masjid',
			speaker: '-',
			type: 'sosial',
			image:
				'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=60'
		},
		{
			id: 4,
			title: 'Tabligh Akbar Akhir Tahun',
			date: new Date(2023, 11, 31, 19, 30),
			location: 'Halaman Utama',
			speaker: 'Syekh Ali Jaber (Alm)',
			type: 'event',
			image:
				'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=60'
		}
	];

	let viewMode = $state<'list' | 'calendar'>('list');
	let currentDate = $state(new Date());

	const monthNames = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function formatTime(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getBadgeVariant(type: string) {
		switch (type) {
			case 'kajian':
				return 'primary';
			case 'ibadah':
				return 'success';
			case 'sosial':
				return 'warning';
			case 'event':
				return 'accent';
			default:
				return 'neutral';
		}
	}
</script>

<svelte:head>
	<title>Kegiatan Masjid | TadBeer</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 pb-24 md:pb-8">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-primary">Jadwal Kegiatan</h1>
			<p class="text-base-content/70 mt-1">Ikuti berbagai kegiatan bermanfaat di masjid kami</p>
		</div>

		<div class="flex items-center gap-2 bg-base-200 p-1 rounded-lg self-start md:self-auto">
			<button
				class="btn btn-sm btn-ghost gap-2 {viewMode === 'list' ? 'bg-base-100 shadow-sm' : ''}"
				onclick={() => (viewMode = 'list')}
			>
				<List class="w-4 h-4" />
				List
			</button>
			<button
				class="btn btn-sm btn-ghost gap-2 {viewMode === 'calendar' ? 'bg-base-100 shadow-sm' : ''}"
				onclick={() => (viewMode = 'calendar')}
			>
				<Grid class="w-4 h-4" />
				Kalender
			</button>
		</div>
	</div>

	{#if viewMode === 'list'}
		<!-- List View -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each events as event}
				<div
					class="card bg-base-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-base-200 overflow-hidden group"
				>
					<figure class="relative h-48 overflow-hidden">
						<img
							src={event.image}
							alt={event.title}
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<div class="absolute top-3 right-3">
							<Badge variant={getBadgeVariant(event.type) as any} class="shadow-sm">
								{event.type.toUpperCase()}
							</Badge>
						</div>
					</figure>
					<div class="card-body p-5">
						<div class="flex items-center gap-2 text-sm text-base-content/60 mb-2">
							<Calendar class="w-4 h-4" />
							<span>{formatDate(event.date)}</span>
						</div>
						<h3 class="card-title text-lg font-bold mb-2 line-clamp-2">
							{event.title}
						</h3>
						<div class="space-y-2 text-sm text-base-content/70 mb-4">
							<div class="flex items-center gap-2">
								<Clock class="w-4 h-4 text-primary" />
								<span>{formatTime(event.date)} WIB</span>
							</div>
							<div class="flex items-center gap-2">
								<MapPin class="w-4 h-4 text-primary" />
								<span>{event.location}</span>
							</div>
							<div class="flex items-center gap-2">
								<Users class="w-4 h-4 text-primary" />
								<span>{event.speaker}</span>
							</div>
						</div>
						<div class="card-actions justify-end mt-auto">
							<button class="btn btn-primary btn-sm btn-outline w-full"> Lihat Detail </button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Simple Calendar View Placeholder -->
		<div class="card bg-base-100 border border-base-200 shadow-sm">
			<div class="card-body">
				<div class="flex items-center justify-between mb-6">
					<button class="btn btn-ghost btn-circle btn-sm">
						<ChevronLeft class="w-5 h-5" />
					</button>
					<h2 class="text-xl font-bold">
						{monthNames[currentDate.getMonth()]}
						{currentDate.getFullYear()}
					</h2>
					<button class="btn btn-ghost btn-circle btn-sm">
						<ChevronRight class="w-5 h-5" />
					</button>
				</div>

				<div class="grid grid-cols-7 gap-2 text-center mb-2">
					{#each ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] as day}
						<div class="text-sm font-semibold text-base-content/50 py-2">{day}</div>
					{/each}
				</div>

				<!-- Mock Calendar Grid (Static for demo) -->
				<div class="grid grid-cols-7 gap-2">
					{#each Array(35) as _, i}
						<div
							class="aspect-square rounded-lg border border-base-200 p-1 relative hover:bg-base-200/50 cursor-pointer transition-colors"
						>
							<span
								class="text-sm {i === 14
									? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center'
									: ''}"
							>
								{i + 1}
							</span>
							{#if [14, 16, 17, 30].includes(i)}
								<div
									class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary"
								></div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
