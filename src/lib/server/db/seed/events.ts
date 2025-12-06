import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedEvents() {
	console.log('Seeding events...');
	try {
		const events = [
			{
				title: 'Kajian Rutin Sabtu Pagi',
				description: 'Kajian tafsir Al-Quran bersama Ustadz Fulan.',
				type: 'kajian' as const,
				status: 'scheduled' as const,
				startTime: new Date(Date.now() + 86400000), // Tomorrow
				endTime: new Date(Date.now() + 90000000),
				location: 'Ruang Utama Masjid',
				speaker: 'Ustadz Fulan'
			},
			{
				title: 'Sholat Jumat Berjamaah',
				description: 'Khutbah Jumat dan Sholat Jumat.',
				type: 'ibadah' as const,
				status: 'scheduled' as const,
				startTime: new Date(Date.now() + 86400000 * 5), // Next Friday (approx)
				endTime: new Date(Date.now() + 86400000 * 5 + 3600000),
				location: 'Ruang Utama Masjid',
				speaker: 'Khatib Jumat'
			}
		];

		// Simple check to avoid duplicates if title is not unique constraint
		// For seeding, we might just insert if empty or ignore
		const count = await db.$count(table.event);
		if (count === 0) {
			await db.insert(table.event).values(events);
		}

		console.log('Events seeded successfully.');
	} catch (e) {
		console.error('Error seeding events:', e);
	}
}
