import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Mock data - replace with database queries
	const events = [
		{
			id: '1',
			title: 'Kajian Malam Jumat',
			category: 'Kajian',
			date: new Date().toISOString(),
			time: '19:30',
			endTime: '21:00',
			location: 'Masjid Al-Ikhlas',
			description: 'Kajian rutin setiap malam Jumat membahas kitab Riyadhus Shalihin',
			capacity: 100,
			attendees: 45,
			status: 'upcoming'
		},
		{
			id: '2',
			title: 'Sholat Jumat',
			category: 'Sholat Jumat',
			date: new Date(Date.now() + 86400000).toISOString(),
			time: '12:00',
			endTime: '13:00',
			location: 'Masjid Al-Ikhlas',
			description: 'Sholat Jumat berjamaah',
			capacity: 500,
			attendees: 0,
			status: 'upcoming'
		},
		{
			id: '3',
			title: 'Pengajian Ibu-Ibu',
			category: 'Pengajian',
			date: new Date(Date.now() + 2 * 86400000).toISOString(),
			time: '09:00',
			endTime: '11:00',
			location: 'Aula Masjid',
			description: 'Pengajian rutin untuk ibu-ibu',
			capacity: 50,
			attendees: 0,
			status: 'upcoming'
		},
		{
			id: '4',
			title: 'Rapat Pengurus DKM',
			category: 'Rapat',
			date: new Date(Date.now() - 86400000).toISOString(),
			time: '19:00',
			endTime: '21:00',
			location: 'Ruang Sekretariat',
			description: 'Rapat bulanan pengurus DKM',
			capacity: 20,
			attendees: 15,
			status: 'completed'
		},
		{
			id: '5',
			title: 'Bakti Sosial',
			category: 'Kegiatan Sosial',
			date: new Date(Date.now() + 7 * 86400000).toISOString(),
			time: '08:00',
			endTime: '12:00',
			location: 'Kelurahan Sukamaju',
			description: 'Pembagian sembako untuk warga kurang mampu',
			capacity: 30,
			attendees: 0,
			status: 'upcoming'
		}
	];

	const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
	const completedCount = events.filter((e) => e.status === 'completed').length;

	return {
		events,
		totalEvents: events.length,
		upcomingCount,
		completedCount
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const category = formData.get('category') as string;
		const date = formData.get('date') as string;
		const time = formData.get('time') as string;
		const endTime = formData.get('endTime') as string;
		const location = formData.get('location') as string;
		const description = formData.get('description') as string;
		const capacity = formData.get('capacity') as string;

		if (!title || !category || !date || !time) {
			return fail(400, { error: 'Judul, kategori, tanggal, dan waktu wajib diisi' });
		}

		// TODO: Save to database
		console.log('Creating event:', {
			title,
			category,
			date,
			time,
			endTime,
			location,
			description,
			capacity
		});

		return { success: true, message: 'Kegiatan berhasil ditambahkan' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const category = formData.get('category') as string;
		const date = formData.get('date') as string;
		const time = formData.get('time') as string;
		const endTime = formData.get('endTime') as string;
		const location = formData.get('location') as string;
		const description = formData.get('description') as string;
		const capacity = formData.get('capacity') as string;

		if (!id || !title || !category || !date || !time) {
			return fail(400, { error: 'Data tidak lengkap' });
		}

		// TODO: Update in database
		console.log('Updating event:', {
			id,
			title,
			category,
			date,
			time,
			endTime,
			location,
			description,
			capacity
		});

		return { success: true, message: 'Kegiatan berhasil diperbarui' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'ID tidak ditemukan' });

		// TODO: Delete from database
		console.log('Deleting event:', id);

		return { success: true, message: 'Kegiatan berhasil dihapus' };
	}
};
