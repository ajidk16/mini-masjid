<script lang="ts">
	import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-svelte';
</script>

<footer class="bg-base-200 pt-16 pb-8 text-base-content">
	<div class="container mx-auto px-4">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div class="space-y-4">
				<a href="/" class="flex items-center gap-2 text-xl font-bold text-primary">
					<span class="text-2xl">🕌</span>
					<span>MiniMasjid</span>
				</a>
				<p class="text-sm text-base-content/70">
					Sistem manajemen masjid modern untuk membantu DKM mengelola inventaris dan kegiatan umat
					dengan lebih transparan dan efisien.
				</p>
				<div class="flex gap-4">
					<a
						href="#facebook"
						class="btn btn-ghost btn-circle btn-sm hover:text-primary"
						aria-label="Facebook"
					>
						<Facebook class="h-5 w-5" />
					</a>
					<a
						href="#instagram"
						class="btn btn-ghost btn-circle btn-sm hover:text-primary"
						aria-label="Instagram"
					>
						<Instagram class="h-5 w-5" />
					</a>
					<a
						href="#twitter"
						class="btn btn-ghost btn-circle btn-sm hover:text-primary"
						aria-label="Twitter"
					>
						<Twitter class="h-5 w-5" />
					</a>
					<a
						href="#youtube"
						class="btn btn-ghost btn-circle btn-sm hover:text-primary"
						aria-label="Youtube"
					>
						<Youtube class="h-5 w-5" />
					</a>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="mb-4 text-lg font-bold">Tautan Cepat</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/" class="hover:text-primary">Beranda</a></li>
					<li><a href="#features" class="hover:text-primary">Fitur Unggulan</a></li>
					<li><a href="#pricing" class="hover:text-primary">Biaya Langganan</a></li>
					<li><a href="#testimonials" class="hover:text-primary">Testimoni</a></li>
					<li><a href="/auth/login" class="hover:text-primary">Login DKM</a></li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="mb-4 text-lg font-bold">Legal & Bantuan</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/privacy" class="hover:text-primary">Kebijakan Privasi</a></li>
					<li><a href="/terms" class="hover:text-primary">Syarat & Ketentuan</a></li>
					<li><a href="/faq" class="hover:text-primary">Pusat Bantuan</a></li>
					<li><a href="/contact" class="hover:text-primary">Hubungi Kami</a></li>
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="mb-4 text-lg font-bold">Kontak</h3>
				<ul class="space-y-4 text-sm">
					<li class="flex items-start gap-3">
						<MapPin class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<span>Jl. Masjid Agung No. 1, Jakarta Selatan, DKI Jakarta 12345</span>
					</li>
					<li class="flex items-center gap-3">
						<Phone class="h-5 w-5 shrink-0 text-primary" />
						<span>+62 812-3456-7890</span>
					</li>
					<li class="flex items-center gap-3">
						<Mail class="h-5 w-5 shrink-0 text-primary" />
						<span>info@minimasjid.com</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 border-t border-base-300 pt-8 text-center text-sm text-base-content/60">
			<p>
				&copy; {new Date().getFullYear()} MiniMasjid. All rights reserved. Dibuat dengan ❤️ untuk umat.
			</p>
		</div>
	</div>
</footer>
