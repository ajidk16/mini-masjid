# Product Blueprint: TadBeer SaaS

## 🎯 Masalah yang Diselesaikan

### Pain Points
1. **Keuangan tidak transparan** - Jamaah tidak tahu kemana dana masjid mengalir, takut salah kelola
2. **Administrasi manual** - Bendahara masih pakai buku tulis, Excel terpisah-pisah, sulit bikin laporan
3. **Komunikasi buruk** - Pengumuman hanya via speaker/WhatsApp grup yang berantakan
4. **Data jamaah tercecer** - Tidak ada database anggota yang terstruktur untuk koordinasi kegiatan
5. **Donasi tidak optimal** - Tidak ada cara mudah untuk jamaah berdonasi online, kehilangan potensi donatur jarak jauh

### Solution
Platform all-in-one berbasis cloud yang digitalisasi pengelolaan masjid dengan fokus pada **transparansi keuangan** dan **kemudahan administrasi**.

---

## 👥 Target User

### Primary Users

| Persona | Karakteristik | Needs |
|---------|---------------|-------|
| **Bendahara Masjid** | Usia 35-60 tahun, kurang tech-savvy, sibuk dengan pekerjaan utama | Tools simpel untuk input keuangan, auto-generate laporan |
| **Pengurus/Admin** | Usia 30-55 tahun, koordinator kegiatan, butuh visibilitas | Dashboard untuk monitor kegiatan, jamaah, inventaris |
| **Imam/Ustadz** | Usia 30-65 tahun, mengatur jadwal kajian/khutbah | Kalender kegiatan, database jamaah untuk komunikasi |

### Secondary Users

| Persona | Karakteristik | Needs |
|---------|---------------|-------|
| **Jamaah Aktif** | Usia 25-50 tahun, aktif di kegiatan masjid | Info kegiatan, daftar event, lihat laporan keuangan |
| **Donatur** | Semua usia, ingin donasi mudah & transparan | Form donasi online, receipt otomatis, tracking penggunaan |

### Market Size (Indonesia)
- **800,000+** masjid terdaftar
- **TAM (Total Addressable Market)**: 50,000 masjid aktif yang butuh digitalisasi
- **SAM (Serviceable Available Market)**: 10,000 masjid di kota besar (Jabodetabek, Bandung, Surabaya, Medan, Makassar)
- **SOM (Serviceable Obtainable Market) Year 1**: 500 masjid (5% SAM)

---

## ⚡ Fitur Inti

### 1. Keuangan Digital
- Input pemasukan/pengeluaran dengan kategori (zakat, infaq, operasional)
- Upload bukti transaksi (foto struk)
- Laporan bulanan/tahunan auto-generate (PDF/Excel)
- Dashboard visualisasi cash flow

### 2. Manajemen Kegiatan
- Kalender event (pengajian, rapat, gotong royong)
- Pendaftaran online untuk jamaah
- Absensi digital via QR code
- Reminder otomatis (email/WhatsApp)

### 3. Database Jamaah
- Profil anggota lengkap (kontak, alamat, membership)
- Import/export bulk via Excel
- Segmentasi untuk broadcast komunikasi

### 4. Pengumuman & Komunikasi
- Broadcast info via platform (tampil di dashboard jamaah)
- Jadwal sholat otomatis (API integration)
- Arsip khutbah/materi kajian

### 5. Inventaris
- Database aset masjid
- Log peminjaman barang
- Reminder maintenance

---

## 🚀 1 Fitur Killer: **Transparent Finance Dashboard**

### Konsep
**Public financial dashboard** yang bisa diakses semua jamaah tanpa login, menampilkan:
- Total pemasukan/pengeluaran bulan ini (real-time)
- Top 5 kategori pengeluaran (chart)
- Saldo akhir
- History transaksi 3 bulan terakhir (tanpa detail sensitif)

### Why It's a Killer Feature
1. **Solves #1 Pain Point** - Transparansi langsung mengatasi ketidakpercayaan jamaah
2. **Viral Potential** - Masjid bisa share link dashboard di WhatsApp grup, menarik jamaah baru
3. **Differentiation** - Kompetitor fokus admin tools, kita fokus trust-building
4. **Donation Catalyst** - Jamaah yang lihat transparansi lebih termotivasi donasi

### Implementation
- Public URL: `TadBeer.app/{masjid-slug}/finance`
- Anonymous mode: nama donatur ditutupi jika request
- Widget embed untuk website masjid
- QR code untuk ditempel di papan pengumuman masjid

---

## 🏗️ Arsitektur High-Level

```
┌──────────────────────────────────────────────────────────────┐
│                    USERS (Web Browser)                        │
│  Admin Dashboard  │  Jamaah Portal  │  Public Finance Page   │
└─────────────┬────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────┐
│                   FRONTEND (SvelteKit SSR)                    │
│  - Server-side rendering untuk SEO & performance             │
│  - DaisyUI components dengan custom Islamic theme            │
│  - i18n support (Bahasa Indonesia + English)                 │
└─────────────┬────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────┐
│                 BACKEND (SvelteKit Endpoints)                 │
│  ┌────────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │ Auth API   │  │ CRUD API │  │ Report Gen│  │ Webhook  │  │
│  │ (Session)  │  │ (Drizzle)│  │ (PDF/Excel)│ │ (Payment)│  │
│  └────────────┘  └──────────┘  └───────────┘  └──────────┘  │
└─────────────┬────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────┐
│                        DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  PostgreSQL  │  │  Redis Cache │  │ File Storage │        │
│  │  (Neon/      │  │  (Upstash)   │  │ (Cloudflare  │        │
│  │  Supabase)   │  │              │  │  R2/S3)      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└───────────────────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                           │
│  - Payment Gateway (Midtrans/Xendit)                          │
│  - WhatsApp API (Fonnte/Wablas)                               │
│  - Email (Resend/SendGrid)                                    │
│  - Prayer Times API (Aladhan/Islamic Finder)                  │
└───────────────────────────────────────────────────────────────┘
```

### Tech Stack Decisions

| Component | Choice | Reasoning |
|-----------|--------|-----------|
| **Frontend** | SvelteKit | Existing codebase, SSR out of the box, fast performance |
| **Database** | PostgreSQL (Neon) | Relational data, JSONB for flexibility, serverless pricing |
| **Cache** | Upstash Redis | Serverless, low latency for dashboard stats |
| **File Storage** | Cloudflare R2 | S3-compatible, zero egress fees |
| **Hosting** | Vercel/Cloudflare Pages | Edge deployment, auto-scaling, zero config |
| **Payment** | Midtrans | Market leader di Indonesia, lengkap (VA, e-wallet, QRIS) |

---

## 💰 Pricing Model

### Freemium Strategy

| Tier | Price | Limits | Target |
|------|-------|--------|--------|
| **Free** | Rp 0 | - 1 admin user<br>- 50 jamaah records<br>- 100 transactions/month<br>- Public finance dashboard<br>- Basic support | Masjid kecil, trial users |
| **Starter** | **Rp 99k/bulan** | - 3 admin users<br>- 500 jamaah records<br>- Unlimited transactions<br>- Donasi online (fee 2.5%)<br>- WhatsApp notifications<br>- Email support | Masjid menengah |
| **Pro** | **Rp 299k/bulan** | - 10 admin users<br>- Unlimited jamaah<br>- Multi-mosque management<br>- Custom branding<br>- API access<br>- Priority support | Masjid besar, yayasan |
| **Enterprise** | Custom | - Custom deployment<br>- Dedicated server<br>- SLA guarantee<br>- Training & onboarding | Organisasi besar (NU, Muhammadiyah) |

### Revenue Streams
1. **Subscription**: Recurring revenue dari tier berbayar
2. **Transaction Fee**: 2.5% dari donasi online (kompetitif vs Kitabisa 5%)
3. **Add-ons**:
   - Extra storage: Rp 50k/10GB/bulan
   - WhatsApp blast: Rp 100k/1000 pesan
   - Custom report template: Rp 500k one-time

### Pricing Psychology
- **Rp 99k** = ~2 nasi kotak untuk rapat pengurus, sangat affordable
- **Free tier** dengan public dashboard = marketing tools (viral loop)
- **Annual discount** 20% (Rp 950k/tahun) untuk cash flow stability

---

## ⚠️ Risiko & Mitigasi

### 1. Risiko: Rendahnya Adopsi Teknologi di Pengurus Masjid

**Severity**: 🔴 High | **Probability**: 🔴 High

**Mitigasi**:
- Onboarding tutorial video step-by-step (Bahasa Indonesia)
- WhatsApp support hotline (bukan hanya email)
- Feature parity dengan Excel (import/export) untuk transisi bertahap
- Referral program: pengurus yang sudah pakai bisa "mengajarkan" masjid lain (dapat diskon)

### 2. Risiko: Kepercayaan terhadap Keuangan Digital

**Severity**: 🔴 High | **Probability**: 🟠 Medium

**Mitigasi**:
- Audit trail lengkap (siapa input apa kapan)
- Export backup otomatis ke email pengurus setiap bulan
- Endorsement dari tokoh agama/organisasi Islam terpercaya
- Sertifikasi keamanan (ISO 27001 jika budget cukup)

### 3. Risiko: Payment Gateway Failure (Donasi Gagal)

**Severity**: 🟠 Medium | **Probability**: 🟢 Low

**Mitigasi**:
- Multi-gateway (Midtrans + Xendit sebagai backup)
- Retry mechanism otomatis
- Manual fallback: tampilkan nomor rekening jika gateway down

### 4. Risiko: Data Privacy & Compliance

**Severity**: 🟠 Medium | **Probability**: 🟠 Medium

**Mitigasi**:
- GDPR-compliant privacy policy (meskipun Indonesia belum strict)
- Opt-in untuk data jamaah (tidak auto-publish)
- Enkripsi data sensitif (password, NIK)
- Regular security audit

### 5. Risiko: Kompetitor dengan Funding Besar

**Severity**: 🟠 Medium | **Probability**: 🟠 Medium

**Mitigasi**:
- **Niche down**: Fokus masjid kecil-menengah yang diabaikan kompetitor
- **Community-driven**: Buat komunitas pengurus masjid user untuk feedback loop
- **Open-source partial**: Rilis core features sebagai open-source untuk trust-building
- **Speed to market**: Launch MVP dalam 30 hari, iterate cepat

---

## 🗓️ Roadmap 30 Hari (MVP Launch)

### Week 1: Foundation (Dec 5-11)
**Goal**: Setup infrastructure & core models

- [ ] **Day 1-2**: Database schema design & migration
  - Extend existing Drizzle schema dengan tabel: `mosque_profile`, `financial_transaction`, `financial_category`, `event`, `member`
  - Setup seed data untuk demo
  
- [ ] **Day 3-4**: Auth & role system
  - Tambah `role` field di user table
  - Implement `hasPermission()` helper
  - Middleware untuk role-based access control

- [ ] **Day 5-7**: Dashboard layout
  - Buat `(app)` route group untuk authenticated pages
  - Sidebar navigation dengan DaisyUI drawer
  - Toast notification system (success/error feedback)

**Deliverable**: Login page + empty dashboard dengan nav

---

### Week 2: Core Features (Dec 12-18)
**Goal**: Implementasi modul keuangan & kegiatan

- [ ] **Day 8-10**: Modul Keuangan
  - Form input transaksi (income/expense)
  - List view dengan filter by date, category, type
  - Simple chart (bar chart pemasukan vs pengeluaran)
  - Export to Excel

- [ ] **Day 11-13**: Modul Kegiatan
  - CRUD event (create, list, edit, delete)
  - Kalender view dengan FullCalendar atau native CSS grid
  - Registration form untuk jamaah

- [ ] **Day 14**: Testing & bug fixes
  - Manual testing semua flow
  - Fix critical bugs

**Deliverable**: Working keuangan & kegiatan module

---

### Week 3: Killer Feature (Dec 19-25)
**Goal**: Public finance dashboard

- [ ] **Day 15-17**: Public Dashboard
  - Route `/[slug]/finance` tanpa auth
  - Real-time stats dari database
  - Chart.js untuk visualisasi
  - Responsive design (mobile-first)

- [ ] **Day 18-19**: Donasi Online (MVP)
  - Form donasi simple (nama, jumlah, kategori)
  - Integrasi Midtrans Snap (sandbox mode)
  - Webhook handler untuk update status payment
  - Auto-send receipt via email

- [ ] **Day 20-21**: Mosque onboarding flow
  - Registration form untuk masjid baru
  - Setup wizard (isi profil, kategori keuangan default, invite admin)
  - Generate slug unik

**Deliverable**: Public dashboard + donasi online working

---

### Week 4: Polish & Launch (Dec 26 - Jan 1)
**Goal**: Production-ready & soft launch

- [ ] **Day 22-24**: UI/UX polish
  - Animasi transitions
  - Loading states
  - Empty states dengan ilustrasi
  - Error handling yang user-friendly

- [ ] **Day 25-26**: Content & documentation
  - Landing page dengan value proposition
  - Tutorial video (5 menit)
  - FAQ section
  - Privacy policy & terms of service

- [ ] **Day 27-28**: Production deployment
  - Setup domain (TadBeer.app)
  - SSL certificate
  - Environment variables untuk production
  - Monitoring (Sentry untuk error tracking)

- [ ] **Day 29-30**: Beta launch
  - Invite 10 masjid untuk beta testing (personal network)
  - Collect feedback via Google Form
  - Fix critical issues

**Deliverable**: Live product di production dengan 10 beta users

---

### Post-Launch (Month 2-3)

**Month 2**: Iterate based on feedback
- Tambah modul jamaah & inventaris
- Improve onboarding UX
- WhatsApp notification integration
- Payment gateway production mode

**Month 3**: Growth & monetization
- Launch paid tiers (Starter & Pro)
- Content marketing (blog tentang manajemen masjid)
- Partnership dengan organisasi Islam lokal
- Target 100 paying customers

---

## 📊 Success Metrics

### North Star Metric
**Total Rp donated through platform** - Karena ini indikator utama value creation untuk masjid

### Supporting Metrics
| Metric | Target Month 1 | Target Month 3 | Target Month 6 |
|--------|----------------|----------------|----------------|
| Active mosques | 10 (beta) | 100 | 500 |
| Paying customers | 0 (free trial) | 20 (20% conversion) | 150 (30% conversion) |
| MRR (Monthly Recurring Revenue) | Rp 0 | Rp 2-3 juta | Rp 15-20 juta |
| Avg transactions/mosque/month | 50 | 100 | 150 |
| Donation GMV | Rp 10 juta | Rp 100 juta | Rp 500 juta |
| Support tickets | < 10 | < 30 | < 50 |
| NPS (Net Promoter Score) | - | 50+ | 60+ |

---

## 🎯 Go-to-Market Strategy

### Phase 1: Personal Network (Month 1)
- Approach 10 masjid di sekitar Jabodetabek yang sudah kenal
- Offer free setup & training
- Collect testimonials + case studies

### Phase 2: Content Marketing (Month 2-3)
- Blog SEO: "Cara Kelola Keuangan Masjid Transparan"
- YouTube tutorial: Setup donasi online untuk masjid
- Guest post di media Islam (NU Online, Muhammadiyah.id)

### Phase 3: Community Building (Month 4-6)
- WhatsApp group "Pengurus Masjid Digital"
- Monthly webinar best practices
- Referral program: ajak 3 masjid dapat 1 bulan gratis

### Phase 4: Partnership (Month 6+)
- MoU dengan organisasi besar (BAZNAS, LAZ)
- Integration dengan platform donasi existing (Kitabisa, dll)
- White-label solution untuk yayasan besar

---

## 💡 Unfair Advantage

1. **Existing Tech Stack**: Codebase SvelteKit sudah ada, tinggal extend (bukan build from scratch)
2. **Niche Focus**: Kompetitor target semua organisasi nirlaba, kita spesifik masjid (better product-market fit)
3. **Transparency First**: Feature killer yang belum ada di kompetitor
4. **Freemium + Low Price**: Barrier to entry rendah, viral potential tinggi
5. **Local Context**: UI/UX disesuaikan kultur Indonesia (support WA, bahasa informal, etc)

---

**Next Action**: Approve roadmap → Start Week 1 implementation
