import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Mock Data
	const announcements = [
		{
			id: '1',
			title: 'Kajian Rutin Ditunda',
			content: 'Mohon maaf, kajian rutin malam ini ditunda karena Ustadz berhalangan hadir.',
			status: 'active',
			type: 'urgent',
			createdAt: '2023-12-05T10:00:00Z'
		},
		{
			id: '2',
			title: 'Penerimaan Hewan Qurban',
			content: 'Masjid Al-Ikhlas menerima penyaluran hewan qurban mulai tanggal 1 Dzulhijjah.',
			status: 'active',
			type: 'info',
			createdAt: '2023-12-01T08:00:00Z'
		}
	];

	const khutbahSchedule = [
		{
			id: '1',
			date: '2023-12-08',
			khatib: 'Ustadz Abdul Somad',
			imam: 'Ustadz Hanan Attaki',
			muadzin: 'Bilal',
			theme: 'Menjaga Hati'
		},
		{
			id: '2',
			date: '2023-12-15',
			khatib: 'Ustadz Adi Hidayat',
			imam: 'Ustadz Muzammil',
			muadzin: 'Fulan',
			theme: 'Persiapan Akhir Zaman'
		}
	];

	const broadcastHistory = [
		{
			id: '1',
			subject: 'Undangan Rapat DKM',
			recipientCount: 15,
			channel: 'whatsapp',
			sentAt: '2023-12-04T19:00:00Z',
			status: 'sent'
		},
		{
			id: '2',
			subject: 'Laporan Keuangan Bulanan',
			recipientCount: 150,
			channel: 'email',
			sentAt: '2023-12-01T09:00:00Z',
			status: 'sent'
		}
	];

	return {
		announcements,
		khutbahSchedule,
		broadcastHistory
	};
};

export const actions: Actions = {
	createAnnouncement: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		// TODO: Save to DB
		return { success: true, message: 'Pengumuman berhasil dibuat' };
	},
	createKhutbah: async ({ request }) => {
		const formData = await request.formData();
		const khatib = formData.get('khatib');
		// TODO: Save to DB
		return { success: true, message: 'Jadwal khutbah berhasil dibuat' };
	},
	updateAnnouncement: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		// TODO: Update DB
		return { success: true, message: 'Pengumuman berhasil diperbarui' };
	},
	updateKhutbah: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		// TODO: Update DB
		return { success: true, message: 'Jadwal khutbah berhasil diperbarui' };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		// TODO: Delete from DB
		return { success: true, message: 'Data berhasil dihapus' };
	}
};
