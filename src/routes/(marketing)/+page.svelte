<script lang="ts">
	import { onMount } from 'svelte';

	// Form state
	let donorName = $state('');
	let donorEmail = $state('');
	let donorPhone = $state('');
	let donorAmount = $state('');
	let donorMessage = $state('');
	let formSuccess = $state(false);
	let formError = $state('');

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	// Navigation items
	const navItems = [
		{ href: '#beranda', label: 'Beranda' },
		{ href: '#tentang', label: 'Tentang' },
		{ href: '#kegiatan', label: 'Kegiatan' },
		{ href: '#donasi', label: 'Donasi' },
		{ href: '#kontak', label: 'Kontak' }
	];

	// Kegiatan/Activities data
	const kegiatan = [
		{
			title: 'Sholat Berjamaah',
			description: 'Sholat 5 waktu berjamaah dengan imam tetap setiap hari.',
			icon: '🕌',
			time: 'Setiap Waktu Sholat'
		},
		{
			title: 'Kajian Rutin',
			description: 'Kajian kitab dan tafsir Al-Quran setiap Ahad pagi.',
			icon: '📖',
			time: 'Ahad, 08:00 WIB'
		},
		{
			title: 'Tahfidz Quran',
			description: 'Program menghafal Al-Quran untuk anak-anak dan dewasa.',
			icon: '🎓',
			time: 'Senin - Jumat'
		},
		{
			title: 'Sedekah Jumat',
			description: 'Program berbagi makanan dan sedekah setiap Jumat.',
			icon: '🤲',
			time: 'Jumat, Setelah Sholat'
		},
		{
			title: 'Pengajian Ibu-Ibu',
			description: 'Majelis taklim khusus muslimah setiap Rabu sore.',
			icon: '👩‍👧',
			time: 'Rabu, 15:00 WIB'
		},
		{
			title: 'Remaja Masjid',
			description: 'Kegiatan pembinaan remaja dan pemuda masjid.',
			icon: '🧑‍🤝‍🧑',
			time: 'Sabtu, 19:00 WIB'
		}
	];

	// Handle donation form
	function handleDonation(e: Event) {
		e.preventDefault();
		formError = '';
		formSuccess = false;

		if (!donorName.trim()) {
			formError = 'Nama wajib diisi';
			return;
		}
		if (!donorEmail.trim() || !donorEmail.includes('@')) {
			formError = 'Email tidak valid';
			return;
		}
		if (!donorAmount || parseInt(donorAmount) < 10000) {
			formError = 'Nominal minimal Rp 10.000';
			return;
		}

		// Simulate success
		formSuccess = true;
		donorName = '';
		donorEmail = '';
		donorPhone = '';
		donorAmount = '';
		donorMessage = '';

		setTimeout(() => {
			formSuccess = false;
		}, 5000);
	}

	// Scroll reveal observer
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{ threshold: 0.1 }
		);

		document
			.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right')
			.forEach((el) => {
				observer.observe(el);
			});

		return () => observer.disconnect();
	});

	// Close mobile menu on nav click
	function handleNavClick() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<title>Masjid Al-Ikhlas - Rumah Ibadah dan Dakwah</title>
	<meta
		name="description"
		content="Masjid Al-Ikhlas - Pusat ibadah, pendidikan, dan kegiatan sosial umat Islam. Bergabunglah bersama kami dalam kebaikan."
	/>
</svelte:head>

<!-- HEADER / NAVBAR -->
<header class="navbar fixed top-0 left-0 right-0 z-50 glass px-4 lg:px-8">
	<div class="navbar-start">
		<a href="#beranda" class="flex items-center gap-2 text-lg font-bold text-primary">
			<span class="text-2xl">🕌</span>
			<span class="hidden sm:inline">Masjid Al-Ikhlas</span>
		</a>
	</div>

	<!-- Desktop Navigation -->
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal gap-1">
			{#each navItems as item}
				<li>
					<a href={item.href} class="font-medium hover:text-primary transition-colors">
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="navbar-end gap-2">
		<a href="#donasi" class="btn btn-primary btn-sm hidden sm:inline-flex"> Donasi Sekarang </a>
		<!-- Mobile menu button -->
		<button
			class="btn btn-ghost btn-circle lg:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Toggle menu"
		>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				{#if mobileMenuOpen}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				{/if}
			</svg>
		</button>
	</div>
</header>

<!-- Mobile Navigation Menu -->
{#if mobileMenuOpen}
	<div class="fixed inset-0 z-40 bg-base-100/95 backdrop-blur-md lg:hidden animate-fadeIn">
		<nav class="flex flex-col items-center justify-center h-full gap-6">
			{#each navItems as item}
				<a
					href={item.href}
					onclick={handleNavClick}
					class="text-2xl font-semibold hover:text-primary transition-colors"
				>
					{item.label}
				</a>
			{/each}
			<a href="#donasi" onclick={handleNavClick} class="btn btn-primary mt-4"> Donasi Sekarang </a>
		</nav>
	</div>
{/if}

<!-- HERO SECTION -->
<section id="beranda" class="parallax-hero min-h-screen islamic-pattern">
	<div
		class="parallax-bg"
		style="background-image: url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80');"
	></div>
	<div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
		<div class="scroll-reveal">
			<span class="text-6xl mb-6 block animate-bounce-gentle">🕌</span>
			<h1 class="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
				Selamat Datang di<br />
				<span class="gradient-text">Masjid Al-Ikhlas</span>
			</h1>
			<p class="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
				Pusat ibadah, pendidikan, dan kegiatan sosial untuk membangun umat yang bertakwa dan
				berakhlak mulia.
			</p>
			<div class="flex flex-wrap gap-4 justify-center">
				<a href="#tentang" class="btn btn-primary btn-lg"> Tentang Kami </a>
				<a
					href="#kegiatan"
					class="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-base-content"
				>
					Lihat Kegiatan
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
		<a
			href="#tentang"
			class="text-white opacity-70 hover:opacity-100 transition-opacity"
			aria-label="Scroll ke bawah"
		>
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				/>
			</svg>
		</a>
	</div>
</section>

<!-- TENTANG SECTION -->
<section id="tentang" class="section-padding bg-base-100">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12 scroll-reveal">
			<h2 class="text-headline text-primary mb-2">Tentang Masjid</h2>
			<p class="text-caption max-w-2xl mx-auto">Mengenal lebih dekat sejarah dan visi misi kami</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
			<!-- Content -->
			<div class="scroll-reveal-left">
				<h3 class="text-title mb-4">Sejarah Masjid Al-Ikhlas</h3>
				<p class="text-base-content/80 mb-6 leading-relaxed">
					Masjid Al-Ikhlas didirikan pada tahun 1985 oleh para tokoh masyarakat yang memiliki
					cita-cita luhur untuk membangun tempat ibadah yang nyaman dan menjadi pusat kegiatan umat
					Islam. Seiring berjalannya waktu, masjid ini terus berkembang menjadi pusat pendidikan dan
					sosial yang aktif melayani masyarakat.
				</p>

				<div class="space-y-4">
					<div class="flex items-start gap-4">
						<div
							class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
						>
							🎯
						</div>
						<div>
							<h4 class="font-semibold mb-1">Visi</h4>
							<p class="text-sm text-base-content/70">
								Menjadi masjid yang makmur, pusat ibadah dan dakwah yang membawa rahmat bagi seluruh
								alam.
							</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div
							class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
						>
							📋
						</div>
						<div>
							<h4 class="font-semibold mb-1">Misi</h4>
							<p class="text-sm text-base-content/70">
								Menyelenggarakan kegiatan ibadah, pendidikan, dan sosial yang berkualitas untuk
								membentuk generasi muslim yang berakhlak mulia.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div class="scroll-reveal-right">
				<div class="grid grid-cols-2 gap-4">
					<div class="card bg-primary text-primary-content hover-lift">
						<div class="card-body items-center text-center p-6">
							<span class="text-4xl font-bold">39+</span>
							<span class="text-sm opacity-80">Tahun Berdiri</span>
						</div>
					</div>
					<div class="card bg-secondary text-secondary-content hover-lift">
						<div class="card-body items-center text-center p-6">
							<span class="text-4xl font-bold">500+</span>
							<span class="text-sm opacity-80">Jamaah Aktif</span>
						</div>
					</div>
					<div class="card bg-accent text-accent-content hover-lift">
						<div class="card-body items-center text-center p-6">
							<span class="text-4xl font-bold">12</span>
							<span class="text-sm opacity-80">Program Rutin</span>
						</div>
					</div>
					<div class="card bg-neutral text-neutral-content hover-lift">
						<div class="card-body items-center text-center p-6">
							<span class="text-4xl font-bold">50+</span>
							<span class="text-sm opacity-80">Santri Tahfidz</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- KEGIATAN SECTION -->
<section id="kegiatan" class="section-padding bg-base-200 islamic-pattern">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12 scroll-reveal">
			<h2 class="text-headline text-primary mb-2">Kegiatan Masjid</h2>
			<p class="text-caption max-w-2xl mx-auto">Berbagai kegiatan rutin yang kami selenggarakan</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each kegiatan as item, i}
				<div class="card bg-base-100 shadow-lg hover-lift scroll-reveal stagger-{i + 1}">
					<div class="card-body">
						<div class="flex items-center gap-3 mb-3">
							<span class="text-4xl">{item.icon}</span>
							<div>
								<h3 class="card-title text-lg">{item.title}</h3>
								<span class="badge badge-primary badge-sm">{item.time}</span>
							</div>
						</div>
						<p class="text-base-content/70">{item.description}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-10 scroll-reveal">
			<a href="#kontak" class="btn btn-primary"> Hubungi Kami untuk Info Lebih Lanjut </a>
		</div>
	</div>
</section>

<!-- DONASI SECTION -->
<section id="donasi" class="section-padding bg-base-100">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-12 scroll-reveal">
			<h2 class="text-headline text-primary mb-2">Donasi & Infaq</h2>
			<p class="text-caption max-w-2xl mx-auto">
				Bergabunglah dalam kebaikan. Setiap donasi Anda membantu kemakmuran masjid.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8 items-start">
			<!-- Bank Info -->
			<div class="scroll-reveal-left">
				<div class="card bg-gradient-to-br from-primary to-secondary text-white">
					<div class="card-body">
						<h3 class="card-title text-white mb-4">Transfer Bank</h3>
						<div class="space-y-4">
							<div class="bg-white/10 rounded-lg p-4">
								<p class="text-sm opacity-80">Bank Syariah Indonesia (BSI)</p>
								<p class="text-2xl font-bold tracking-wider">7123 4567 890</p>
								<p class="text-sm">a.n. Masjid Al-Ikhlas</p>
							</div>
							<div class="bg-white/10 rounded-lg p-4">
								<p class="text-sm opacity-80">Bank Mandiri</p>
								<p class="text-2xl font-bold tracking-wider">1234 5678 9012</p>
								<p class="text-sm">a.n. Masjid Al-Ikhlas</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Donation Form -->
			<div class="scroll-reveal-right">
				<div class="card bg-base-100 shadow-xl border border-base-300">
					<form class="card-body" onsubmit={handleDonation}>
						<h3 class="card-title mb-4">Form Konfirmasi Donasi</h3>

						{#if formSuccess}
							<div class="alert alert-success mb-4">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>Jazakallahu khairan! Donasi Anda tercatat.</span>
							</div>
						{/if}

						{#if formError}
							<div class="alert alert-error mb-4">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{formError}</span>
							</div>
						{/if}

						<div class="form-control mb-3">
							<label class="label" for="donor-name">
								<span class="label-text">Nama Lengkap *</span>
							</label>
							<input
								id="donor-name"
								type="text"
								class="input input-bordered w-full"
								placeholder="Masukkan nama"
								bind:value={donorName}
							/>
						</div>

						<div class="form-control mb-3">
							<label class="label" for="donor-email">
								<span class="label-text">Email *</span>
							</label>
							<input
								id="donor-email"
								type="email"
								class="input input-bordered w-full"
								placeholder="email@contoh.com"
								bind:value={donorEmail}
							/>
						</div>

						<div class="form-control mb-3">
							<label class="label" for="donor-phone">
								<span class="label-text">No. WhatsApp</span>
							</label>
							<input
								id="donor-phone"
								type="tel"
								class="input input-bordered w-full"
								placeholder="08xx xxxx xxxx"
								bind:value={donorPhone}
							/>
						</div>

						<div class="form-control mb-3">
							<label class="label" for="donor-amount">
								<span class="label-text">Nominal Donasi (Rp) *</span>
							</label>
							<input
								id="donor-amount"
								type="number"
								class="input input-bordered w-full"
								placeholder="50000"
								min="10000"
								bind:value={donorAmount}
							/>
						</div>

						<div class="form-control mb-4">
							<label class="label" for="donor-message">
								<span class="label-text">Pesan / Doa</span>
							</label>
							<textarea
								id="donor-message"
								class="textarea textarea-bordered w-full"
								rows="2"
								placeholder="Semoga menjadi amal jariyah..."
								bind:value={donorMessage}
							></textarea>
						</div>

						<button type="submit" class="btn btn-primary w-full"> Konfirmasi Donasi </button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- KONTAK SECTION -->
<section id="kontak" class="section-padding bg-base-200">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12 scroll-reveal">
			<h2 class="text-headline text-primary mb-2">Hubungi Kami</h2>
			<p class="text-caption max-w-2xl mx-auto">
				Kami senang menerima kunjungan dan pertanyaan Anda
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<!-- Contact Info -->
			<div class="scroll-reveal-left space-y-6">
				<div class="flex items-start gap-4">
					<div
						class="w-12 h-12 bg-primary text-primary-content rounded-xl flex items-center justify-center text-xl flex-shrink-0"
					>
						📍
					</div>
					<div>
						<h4 class="font-semibold mb-1">Alamat</h4>
						<p class="text-base-content/70">
							Jl. Masjid Al-Ikhlas No. 123<br />
							Kelurahan Sukamaju, Kecamatan Bahagia<br />
							Kota Bandung, Jawa Barat 40123
						</p>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<div
						class="w-12 h-12 bg-secondary text-secondary-content rounded-xl flex items-center justify-center text-xl flex-shrink-0"
					>
						📞
					</div>
					<div>
						<h4 class="font-semibold mb-1">Telepon</h4>
						<p class="text-base-content/70">
							(022) 1234-5678<br />
							+62 812-3456-7890 (WhatsApp)
						</p>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<div
						class="w-12 h-12 bg-accent text-accent-content rounded-xl flex items-center justify-center text-xl flex-shrink-0"
					>
						✉️
					</div>
					<div>
						<h4 class="font-semibold mb-1">Email</h4>
						<p class="text-base-content/70">
							info@masjidalihlas.org<br />
							dkm@masjidalihlas.org
						</p>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<div
						class="w-12 h-12 bg-neutral text-neutral-content rounded-xl flex items-center justify-center text-xl flex-shrink-0"
					>
						🕐
					</div>
					<div>
						<h4 class="font-semibold mb-1">Jam Operasional</h4>
						<p class="text-base-content/70">
							Buka 24 jam untuk ibadah<br />
							Sekretariat: 08:00 - 17:00 WIB
						</p>
					</div>
				</div>
			</div>

			<!-- Map -->
			<div class="scroll-reveal-right">
				<div class="card bg-base-100 shadow-xl overflow-hidden h-full min-h-80">
					<iframe
						title="Lokasi Masjid Al-Ikhlas"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7990682858674!2d107.6186808!3d-6.9175872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64cc28d2d85%3A0xc39f6316ec3fbfb8!2sMasjid%20Raya%20Bandung!5e0!3m2!1sen!2sid!4v1701756000000!5m2!1sen!2sid"
						width="100%"
						height="100%"
						style="border:0; min-height: 320px;"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
					></iframe>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FOOTER -->
<footer class="bg-neutral text-neutral-content">
	<div class="max-w-6xl mx-auto px-4 py-12">
		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="lg:col-span-2">
				<div class="flex items-center gap-2 text-xl font-bold mb-4">
					<span class="text-3xl">🕌</span>
					Masjid Al-Ikhlas
				</div>
				<p class="opacity-80 max-w-md">
					Pusat ibadah, pendidikan, dan kegiatan sosial untuk membangun umat yang bertakwa. Mari
					bersama membangun masjid yang makmur.
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h5 class="font-bold mb-4">Navigasi</h5>
				<ul class="space-y-2 opacity-80">
					{#each navItems as item}
						<li>
							<a href={item.href} class="hover:text-primary transition-colors">
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Social -->
			<div>
				<h5 class="font-bold mb-4">Media Sosial</h5>
				<div class="flex gap-3">
					<a
						href="https://facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
						aria-label="Facebook"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
						</svg>
					</a>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
						aria-label="Instagram"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"
							/>
						</svg>
					</a>
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
						aria-label="YouTube"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
							/>
						</svg>
					</a>
					<a
						href="https://wa.me"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
						aria-label="WhatsApp"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="border-t border-white/10">
		<div class="max-w-6xl mx-auto px-4 py-4 text-center text-sm opacity-70">
			<p>
				© {new Date().getFullYear()} Masjid Al-Ikhlas. Semua hak dilindungi.
			</p>
		</div>
	</div>
</footer>
