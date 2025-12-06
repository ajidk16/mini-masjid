<script lang="ts">
	import { Search, Filter, Package, Info, ArrowRight } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui';

	// Mock Data
	const assets = [
		{
			id: 1,
			name: 'Karpet Sajadah Premium',
			category: 'Perlengkapan',
			stock: 50,
			available: 45,
			image:
				'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=60',
			condition: 'good'
		},
		{
			id: 2,
			name: 'Sound System Portable',
			category: 'Elektronik',
			stock: 2,
			available: 1,
			image:
				'https://images.unsplash.com/photo-1524678606372-987d7e66c454?w=800&auto=format&fit=crop&q=60',
			condition: 'good'
		},
		{
			id: 3,
			name: 'Tenda Lipat 3x3',
			category: 'Perlengkapan',
			stock: 10,
			available: 0,
			image:
				'https://images.unsplash.com/photo-1565061828011-282424b9ab2a?w=800&auto=format&fit=crop&q=60',
			condition: 'maintenance'
		},
		{
			id: 4,
			name: 'Kursi Lipat Chitose',
			category: 'Furniture',
			stock: 100,
			available: 80,
			image:
				'https://images.unsplash.com/photo-1503602642458-2321114458ed?w=800&auto=format&fit=crop&q=60',
			condition: 'good'
		},
		{
			id: 5,
			name: 'Proyektor Epson',
			category: 'Elektronik',
			stock: 3,
			available: 3,
			image:
				'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
			condition: 'good'
		},
		{
			id: 6,
			name: 'Meja Mengaji Anak',
			category: 'Furniture',
			stock: 30,
			available: 25,
			image:
				'https://images.unsplash.com/photo-1505409627996-766595d95204?w=800&auto=format&fit=crop&q=60',
			condition: 'good'
		}
	];

	let searchQuery = $state('');
	let selectedCategory = $state('Semua');

	const categories = ['Semua', 'Perlengkapan', 'Elektronik', 'Furniture'];

	const filteredAssets = $derived(
		assets.filter((asset) => {
			const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'Semua' || asset.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);
</script>

<svelte:head>
	<title>Inventaris Masjid | TadBeer</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 pb-24 md:pb-8">
	<!-- Header -->
	<div class="mb-8 text-center max-w-2xl mx-auto">
		<h1 class="text-3xl font-bold text-primary mb-2">Inventaris Masjid</h1>
		<p class="text-base-content/70">
			Daftar aset masjid yang dapat digunakan atau dipinjam oleh jamaah untuk kegiatan keagamaan dan
			sosial.
		</p>
	</div>

	<!-- Search & Filter -->
	<div
		class="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-200"
	>
		<div class="relative w-full md:w-96">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
			<input
				type="text"
				placeholder="Cari aset..."
				class="input input-bordered w-full pl-10"
				bind:value={searchQuery}
			/>
		</div>

		<div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
			{#each categories as category}
				<button
					class="btn btn-sm {selectedCategory === category ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => (selectedCategory = category)}
				>
					{category}
				</button>
			{/each}
		</div>
	</div>

	<!-- Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each filteredAssets as asset}
			<div
				class="card bg-base-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-base-200 group"
			>
				<figure class="relative h-48 overflow-hidden bg-base-200">
					<img
						src={asset.image}
						alt={asset.name}
						class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div class="absolute top-3 right-3">
						<Badge variant={asset.available > 0 ? 'success' : 'error'} class="shadow-sm">
							{asset.available > 0 ? 'Tersedia' : 'Habis'}
						</Badge>
					</div>
				</figure>
				<div class="card-body p-4">
					<div class="text-xs text-base-content/50 font-medium uppercase tracking-wider mb-1">
						{asset.category}
					</div>
					<h3 class="card-title text-lg font-bold mb-2">
						{asset.name}
					</h3>

					<div
						class="flex items-center justify-between text-sm text-base-content/70 mt-2 mb-4 bg-base-200/50 p-2 rounded-lg"
					>
						<div class="flex flex-col">
							<span class="text-xs">Total</span>
							<span class="font-bold">{asset.stock} Unit</span>
						</div>
						<div class="divider divider-horizontal mx-0"></div>
						<div class="flex flex-col text-right">
							<span class="text-xs">Tersedia</span>
							<span class="font-bold text-primary">{asset.available} Unit</span>
						</div>
					</div>

					<div class="card-actions">
						<button class="btn btn-primary btn-sm w-full" disabled={asset.available === 0}>
							Ajukan Peminjaman
							<ArrowRight class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredAssets.length === 0}
		<div class="text-center py-12">
			<div class="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
				<Package class="w-8 h-8 text-base-content/40" />
			</div>
			<h3 class="text-lg font-bold mb-2">Aset tidak ditemukan</h3>
			<p class="text-base-content/60">Coba kata kunci lain atau ubah filter kategori.</p>
		</div>
	{/if}
</div>
