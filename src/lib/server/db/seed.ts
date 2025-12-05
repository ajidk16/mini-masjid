import { db } from './index';
import {
	user,
	mosqueProfile,
	financialTransaction,
	event,
	member,
	inventoryItem,
	donationCampaign,
	donation,
	announcement
} from './schema';
import { hash } from '@node-rs/argon2';

async function main() {
	console.log('🌱 Starting seed...');

	// 1. Users
	const passwordHash = await hash('password123', {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	const users = [
		{
			id: 'user_super_admin',
			username: 'superadmin',
			passwordHash,
			fullName: 'Super Admin',
			role: 'super_admin' as const,
			phone: '081234567890'
		},
		{
			id: 'user_admin',
			username: 'admin',
			passwordHash,
			fullName: 'Admin Masjid',
			role: 'admin' as const,
			phone: '081234567891'
		},
		{
			id: 'user_imam',
			username: 'imam',
			passwordHash,
			fullName: 'Ustadz Abdullah',
			role: 'imam' as const,
			phone: '081234567892'
		},
		{
			id: 'user_bendahara',
			username: 'bendahara',
			passwordHash,
			fullName: 'Bapak Irwan',
			role: 'bendahara' as const,
			phone: '081234567893'
		},
		{
			id: 'user_jamaah',
			username: 'jamaah',
			passwordHash,
			fullName: 'Ahmad Fulan',
			role: 'jamaah' as const,
			phone: '081234567894'
		}
	];

	await db.insert(user).values(users).onConflictDoNothing();
	console.log('✅ Users seeded');

	const members = users.map((u) => ({
		userId: u.id,
		fullName: u.fullName || '',
		phone: u.phone || '',
		address: 'Jl. Contoh Alamat No. 123, Kota Santri',
		
	}));
	await db.insert(member).values(members).onConflictDoNothing();
	console.log('✅ Members seeded');

	// 2. Mosque Profile
	await db
		.insert(mosqueProfile)
		.values({
			name: 'Masjid Al-Ikhlas',
			address: 'Jl. Kebahagiaan No. 99, Kota Santri',
			phone: '021-12345678',
			email: 'info@alikhlas.com',
			vision: 'Menjadi pusat peradaban umat yang rahmatan lil alamin',
			mission: 'Memakmurkan masjid dengan kegiatan ibadah dan sosial'
		})
		.onConflictDoNothing();
	console.log('✅ Mosque Profile seeded');

	// 3. Financial Transactions
	const transactions = [
		{
			type: 'income' as const,
			category: 'infaq' as const,
			amount: '5000000',
			description: 'Infaq Jumat Pekan 1',
			date: '2023-12-01',
			recordedBy: 'user_bendahara'
		},
		{
			type: 'expense' as const,
			category: 'operasional' as const,
			amount: '1500000',
			description: 'Bayar Listrik November',
			date: '2023-12-02',
			recordedBy: 'user_bendahara'
		},
		{
			type: 'income' as const,
			category: 'infaq' as const,
			amount: '4500000',
			description: 'Infaq Jumat Pekan 2',
			date: '2023-12-08',
			recordedBy: 'user_bendahara'
		},
		{
			type: 'expense' as const,
			category: 'maintenance' as const,
			amount: '500000',
			description: 'Perbaikan Kran Wudhu',
			date: '2023-12-10',
			recordedBy: 'user_bendahara'
		},
		{
			type: 'income' as const,
			category: 'wakaf' as const,
			amount: '10000000',
			description: 'Wakaf Renovasi',
			date: '2023-12-12',
			recordedBy: 'user_bendahara'
		}
	];
	await db.insert(financialTransaction).values(transactions);
	console.log('✅ Transactions seeded');

	// 4. Events
	const events = [
		{
			title: "Kajian Rutin Ba'da Maghrib",
			description: 'Pembahasan Kitab Riyadhus Shalihin',
			type: 'kajian' as const,
			status: 'scheduled' as const,
			startTime: new Date('2023-12-15T18:30:00'),
			endTime: new Date('2023-12-15T19:30:00'),
			location: 'Ruang Utama',
			speaker: 'Ustadz Abdullah'
		},
		{
			title: 'Sholat Jumat',
			type: 'ibadah' as const,
			status: 'scheduled' as const,
			startTime: new Date('2023-12-15T11:45:00'),
			endTime: new Date('2023-12-15T12:45:00'),
			location: 'Ruang Utama & Lantai 2',
			speaker: 'Khatib: Ustadz Fulan'
		}
	];
	await db.insert(event).values(events);
	console.log('✅ Events seeded');

	// 5. Inventory
	const items = [
		{
			name: 'Karpet Sajadah',
			code: 'INV-001',
			category: 'Perlengkapan',
			quantity: 50,
			condition: 'good' as const,
			location: 'Ruang Utama'
		},
		{
			name: 'Sound System',
			code: 'INV-002',
			category: 'Elektronik',
			quantity: 1,
			condition: 'good' as const,
			location: 'Ruang Audio'
		},
		{
			name: 'Tangga Lipat',
			code: 'INV-003',
			category: 'Perkakas',
			quantity: 1,
			condition: 'maintenance' as const,
			location: 'Gudang'
		}
	];
	await db.insert(inventoryItem).values(items).onConflictDoNothing();
	console.log('✅ Inventory seeded');

	// 6. Donations
	const campaigns = await db
		.insert(donationCampaign)
		.values({
			title: 'Renovasi Tempat Wudhu',
			targetAmount: '50000000',
			startDate: '2023-11-01',
			active: true
		})
		.returning();

	if (campaigns.length > 0) {
		await db.insert(donation).values([
			{
				campaignId: campaigns[0].id,
				donorName: 'Hamba Allah',
				amount: '1000000',
				status: 'verified' as const,
				paymentMethod: 'transfer'
			},
			{
				campaignId: campaigns[0].id,
				donorName: 'Budi Santoso',
				amount: '500000',
				status: 'pending' as const,
				paymentMethod: 'qris'
			}
		]);
	}
	console.log('✅ Donations seeded');

	// 7. Announcements
	await db.insert(announcement).values([
		{
			title: 'Penerimaan Hewan Qurban',
			content: 'Panitia menerima penyaluran hewan qurban...',
			category: 'pengumuman' as const,
			isPublished: true,
			publishedAt: new Date(),
			authorId: 'user_admin'
		},
		{
			title: 'Laporan Keuangan November',
			content: 'Laporan keuangan bulan November telah terbit...',
			category: 'laporan' as const,
			isPublished: true,
			publishedAt: new Date(),
			authorId: 'user_bendahara'
		}
	]);
	console.log('✅ Announcements seeded');

	console.log('🏁 Seed completed!');
	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
