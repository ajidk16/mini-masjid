import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedDonationCampaigns() {
	console.log('Seeding donation campaigns...');
	try {
		const campaigns = [
			{
				title: 'Renovasi Tempat Wudhu',
				description: 'Penggalangan dana untuk perbaikan tempat wudhu pria dan wanita.',
				targetAmount: '50000000',
				startDate: new Date().toISOString().split('T')[0],
				active: true
			},
			{
				title: 'Santunan Anak Yatim',
				description: 'Donasi rutin bulanan untuk anak yatim di sekitar masjid.',
				targetAmount: '10000000',
				startDate: new Date().toISOString().split('T')[0],
				active: true
			}
		];

		const count = await db.$count(table.donationCampaign);
		if (count === 0) {
			await db.insert(table.donationCampaign).values(campaigns);
		}
		console.log('Donation campaigns seeded successfully.');
	} catch (e) {
		console.error('Error seeding donation campaigns:', e);
	}
}
