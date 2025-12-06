import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedMosqueProfile() {
	console.log('Seeding mosque profile...');
	try {
		const profile = {
			name: 'Masjid Al-Ikhlas',
			address: 'Jl. Kebahagiaan No. 1, Jakarta Selatan',
			phone: '081234567890',
			email: 'info@alikhlas.com',
			website: 'https://alikhlas.com',
			vision: 'Menjadi pusat peradaban umat yang rahmatan lil alamin.',
			mission: 'Memakmurkan masjid dengan kegiatan ibadah dan sosial.',
			history: 'Didirikan pada tahun 2000 oleh warga sekitar.'
		};

		// Check if profile exists
		const existing = await db.select().from(table.mosqueProfile).limit(1);

		if (existing.length === 0) {
			await db.insert(table.mosqueProfile).values(profile);
		} else {
			// Optional: Update existing
			await db
				.update(table.mosqueProfile)
				.set(profile)
				.where(table.eq(table.mosqueProfile.id, existing[0].id));
		}

		console.log('Mosque profile seeded successfully.');
	} catch (e) {
		console.error('Error seeding mosque profile:', e);
	}
}
