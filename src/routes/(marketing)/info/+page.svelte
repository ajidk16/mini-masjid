<script lang="ts">
	import { Megaphone, Calendar, Clock, AlertTriangle, ArrowRight, FileText } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui';

	// Mock Data
	const urgentAlert = {
		active: true,
		title: 'Perubahan Jadwal Kajian Rutin',
		message:
			"Kajian rutin malam ini ditiadakan dikarenakan Ustadz berhalangan hadir. Insya Allah akan diganti pada hari Sabtu ba'da Subuh.",
		date: '5 menit yang lalu'
	};

	const announcements = [
		{
			id: 1,
			title: 'Penerimaan Hewan Qurban 1445H',
			category: 'Berita',
			date: '10 Des 2023',
			excerpt:
				'Panitia Qurban Masjid TadBeer mulai menerima penyaluran hewan qurban sapi dan kambing mulai tanggal 1 Dzulhijjah.',
			author: 'Panitia Qurban',
			readTime: '3 min baca'
		},
		{
			id: 2,
			title: 'Laporan Keuangan Bulan November 2023',
			category: 'Laporan',
			date: '01 Des 2023',
			excerpt:
				'Alhamdulillah, laporan keuangan bulan November telah dipublikasikan. Total pemasukan sebesar Rp 45.000.000 dan pengeluaran Rp 32.000.000.',
			author: 'Bendahara',
			readTime: '5 min baca'
		},
		{
			id: 3,
			title: 'Himbauan Menjaga Kebersihan Area Masjid',
			category: 'Pengumuman',
			date: '28 Nov 2023',
			excerpt:
				'Dimohon kepada seluruh jamaah untuk senantiasa menjaga kebersihan area masjid, terutama di tempat wudhu dan toilet.',
			author: 'DKM',
			readTime: '2 min baca'
		},
		{
			id: 4,
			title: 'Jadwal Petugas Jumat Bulan Desember',
			category: 'Jadwal',
			date: '25 Nov 2023',
			excerpt:
				'Berikut adalah jadwal petugas Khotib, Imam, dan Muadzin untuk pelaksanaan Sholat Jumat selama bulan Desember 2023.',
			author: 'Sekretariat',
			readTime: '1 min baca'
		}
	];

	function getCategoryColor(category: string) {
		switch (category) {
			case 'Berita':
				return 'primary';
			case 'Laporan':
				return 'success';
			case 'Pengumuman':
				return 'warning';
			case 'Jadwal':
				return 'info';
			default:
				return 'neutral';
		}
	}
</script>

<svelte:head>
	<title>Informasi & Berita | TadBeer</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 pb-24 md:pb-8">
	<!-- Header -->
	<div class="mb-8 text-center max-w-2xl mx-auto">
		<h1 class="text-3xl font-bold text-primary mb-2">Papan Informasi</h1>
		<p class="text-base-content/70">
			Berita terbaru, pengumuman, dan informasi penting seputar kegiatan dan manajemen masjid.
		</p>
	</div>

	<!-- Urgent Alert -->
	{#if urgentAlert.active}
		<div class="alert alert-warning shadow-lg mb-8 animate-bounce-gentle">
			<AlertTriangle class="w-6 h-6" />
			<div>
				<h3 class="font-bold">{urgentAlert.title}</h3>
				<div class="text-xs">{urgentAlert.message}</div>
			</div>
			<div class="text-xs font-mono opacity-70">{urgentAlert.date}</div>
		</div>
	{/if}

	<!-- Featured / Latest -->
	<div class="grid md:grid-cols-2 gap-8 mb-12">
		<div
			class="card bg-base-100 shadow-md border border-base-200 md:col-span-2 lg:col-span-1 overflow-hidden group"
		>
			<figure class="h-64 overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1596920566829-d73adfc0f22f?w=800&auto=format&fit=crop&q=60"
					alt="Featured"
					class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
			</figure>
			<div class="card-body">
				<div class="flex items-center gap-2 mb-2">
					<Badge variant="primary">Berita Utama</Badge>
					<span class="text-xs text-base-content/60 flex items-center gap-1">
						<Calendar class="w-3 h-3" /> 12 Des 2023
					</span>
				</div>
				<h2 class="card-title text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
					Persiapan Menyambut Bulan Suci Ramadhan 1445H
				</h2>
				<p class="text-base-content/70 mb-4">
					DKM TadBeer telah membentuk kepanitiaan untuk menyambut bulan suci Ramadhan. Berbagai
					program unggulan telah disiapkan untuk memfasilitasi ibadah jamaah...
				</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary btn-link p-0 no-underline hover:underline">
						Baca Selengkapnya <ArrowRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<div class="space-y-4 lg:col-span-1">
			<h3 class="font-bold text-lg flex items-center gap-2">
				<Megaphone class="w-5 h-5 text-primary" />
				Pengumuman Terbaru
			</h3>
			{#each announcements as item}
				<div
					class="card card-side bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all hover:border-primary/30 group cursor-pointer"
				>
					<div class="card-body p-4">
						<div class="flex justify-between items-start mb-1">
							<Badge variant={getCategoryColor(item.category) as any} size="sm" outline>
								{item.category}
							</Badge>
							<span class="text-xs text-base-content/50">{item.date}</span>
						</div>
						<h4 class="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
							{item.title}
						</h4>
						<p class="text-sm text-base-content/60 line-clamp-2 mb-2">
							{item.excerpt}
						</p>
						<div class="flex items-center gap-4 text-xs text-base-content/40">
							<span class="flex items-center gap-1">
								<FileText class="w-3 h-3" />
								{item.author}
							</span>
							<span class="flex items-center gap-1">
								<Clock class="w-3 h-3" />
								{item.readTime}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
