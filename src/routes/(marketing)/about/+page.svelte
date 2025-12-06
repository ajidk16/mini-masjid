<script lang="ts">
	import { MapPin, Phone, Mail, Clock, User, Users, Award, BookOpen, Heart } from 'lucide-svelte';

	const dkmStructure = [
		{
			role: 'Ketua DKM',
			name: 'H. Ahmad Dahlan',
			image:
				'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=60'
		},
		{
			role: 'Sekretaris',
			name: 'Ustadz Fatih',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60'
		},
		{
			role: 'Bendahara',
			name: 'Bapak Irwan',
			image:
				'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60'
		},
		{
			role: 'Koordinator Ibadah',
			name: 'Ustadz Zulkifli',
			image:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60'
		}
	];

	const facilities = [
		{ icon: BookOpen, title: 'Perpustakaan Islam', desc: 'Koleksi buku agama lengkap' },
		{ icon: User, title: 'Ruang Konsultasi', desc: 'Layanan konsultasi syariah' },
		{ icon: Award, title: 'TPA/TPQ', desc: 'Pendidikan Al-Quran anak' },
		{ icon: Heart, title: 'Ambulans Gratis', desc: 'Layanan kesehatan umat' }
	];
</script>

<svelte:head>
	<title>Tentang Kami | TadBeer</title>
</svelte:head>

<div class="pb-24 md:pb-0">
	<!-- Hero Section -->
	<div class="relative bg-base-200 py-20 text-center overflow-hidden">
		<div
			class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"
		></div>
		<div class="container mx-auto px-4 relative z-10">
			<h1 class="text-4xl font-bold text-primary mb-4">Profil Masjid</h1>
			<p class="text-xl text-base-content/70 max-w-2xl mx-auto">
				Menjadi pusat peradaban umat yang memakmurkan dan dimakmurkan masjid.
			</p>
		</div>
	</div>

	<div class="container mx-auto px-4 py-12 space-y-20">
		<!-- History & Vision -->
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div class="space-y-6">
				<h2 class="text-3xl font-bold text-primary">Sejarah Singkat</h2>
				<p class="text-base-content/80 leading-relaxed">
					Masjid TadBeer didirikan pada tahun 2010 atas inisiatif warga setempat yang merindukan
					tempat ibadah yang nyaman dan representatif. Berawal dari sebuah musholla kecil, kini
					telah berkembang menjadi pusat kegiatan keagamaan dan sosial kemasyarakatan.
				</p>
				<p class="text-base-content/80 leading-relaxed">
					Dengan arsitektur yang memadukan nilai tradisional dan modern, masjid ini tidak hanya
					menjadi tempat sholat, tetapi juga pusat pendidikan, dakwah, dan pemberdayaan ekonomi
					umat.
				</p>
			</div>
			<div
				class="relative h-80 rounded-2xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500"
			>
				<img
					src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=800&auto=format&fit=crop&q=60"
					alt="Masjid Architecture"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>

		<!-- Vision Mission -->
		<div class="bg-base-100 rounded-3xl p-8 md:p-12 shadow-sm border border-base-200 text-center">
			<h2 class="text-3xl font-bold text-primary mb-12">Visi & Misi</h2>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="space-y-4">
					<div
						class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary"
					>
						<Heart class="w-8 h-8" />
					</div>
					<h3 class="text-xl font-bold">Spiritual</h3>
					<p class="text-base-content/70">
						Membangun kesalehan pribadi dan sosial melalui ibadah yang berkualitas.
					</p>
				</div>
				<div class="space-y-4">
					<div
						class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary"
					>
						<BookOpen class="w-8 h-8" />
					</div>
					<h3 class="text-xl font-bold">Intelektual</h3>
					<p class="text-base-content/70">
						Menjadi pusat kajian ilmu dan pendidikan Islam yang moderat.
					</p>
				</div>
				<div class="space-y-4">
					<div
						class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent"
					>
						<Users class="w-8 h-8" />
					</div>
					<h3 class="text-xl font-bold">Sosial</h3>
					<p class="text-base-content/70">
						Memberdayakan potensi umat untuk kesejahteraan bersama.
					</p>
				</div>
			</div>
		</div>

		<!-- Structure -->
		<div>
			<h2 class="text-3xl font-bold text-primary text-center mb-12">Struktur DKM</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				{#each dkmStructure as person}
					<div
						class="card bg-base-100 border border-base-200 text-center hover:shadow-md transition-all"
					>
						<figure class="px-4 pt-4">
							<div class="avatar">
								<div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
									<img src={person.image} alt={person.name} />
								</div>
							</div>
						</figure>
						<div class="card-body items-center text-center p-4">
							<h3 class="card-title text-base">{person.name}</h3>
							<p class="text-sm text-base-content/60">{person.role}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Contact & Location -->
		<div class="grid md:grid-cols-2 gap-8 bg-base-200 rounded-3xl overflow-hidden">
			<div class="p-8 md:p-12 space-y-6">
				<h2 class="text-3xl font-bold text-primary">Hubungi Kami</h2>
				<p class="text-base-content/70">
					Silakan berkunjung atau hubungi kami untuk informasi lebih lanjut.
				</p>

				<div class="space-y-4">
					<div class="flex items-center gap-4">
						<div
							class="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center text-primary shadow-sm"
						>
							<MapPin class="w-5 h-5" />
						</div>
						<div>
							<div class="font-bold">Alamat</div>
							<div class="text-sm opacity-70">Jl. Masjid No. 1, Kota Santri, 12345</div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<div
							class="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center text-primary shadow-sm"
						>
							<Phone class="w-5 h-5" />
						</div>
						<div>
							<div class="font-bold">Telepon / WhatsApp</div>
							<div class="text-sm opacity-70">+62 812-3456-7890</div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<div
							class="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center text-primary shadow-sm"
						>
							<Mail class="w-5 h-5" />
						</div>
						<div>
							<div class="font-bold">Email</div>
							<div class="text-sm opacity-70">info@TadBeer.com</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bg-base-300 min-h-[300px] flex items-center justify-center text-base-content/30">
				<!-- Placeholder for Google Maps -->
				<div class="text-center">
					<MapPin class="w-12 h-12 mx-auto mb-2" />
					<span class="font-bold">Peta Lokasi</span>
				</div>
			</div>
		</div>
	</div>
</div>
