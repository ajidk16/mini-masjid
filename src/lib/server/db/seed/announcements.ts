import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedAnnouncements() {
	console.log('Seeding announcements...');
	try {
		const announcements = [
			{
				title: 'Kerja Bakti Masjid',
				content: 'Akan diadakan kerja bakti membersihkan masjid pada hari Ahad besok.',
				category: 'pengumuman' as const,
				isPublished: true,
				publishedAt: new Date()
			},
			{
				title: 'Laporan Keuangan Bulan Ini',
				content: 'Laporan keuangan bulan ini sudah dapat dilihat di papan pengumuman.',
				category: 'laporan' as const,
				isPublished: true,
				publishedAt: new Date()
			}
		];

		const count = await db.$count(table.announcement);
		if (count === 0) {
			await db.insert(table.announcement).values(announcements);
		}
		console.log('Announcements seeded successfully.');
	} catch (e) {
		console.error('Error seeding announcements:', e);
	}
}
