import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Mock Data
	const campaigns = [
		{
			id: '1',
			title: 'Renovasi Kubah Masjid',
			target: 500000000,
			collected: 125000000,
			deadline: '2024-06-01',
			status: 'active',
			donors: 45
		},
		{
			id: '2',
			title: 'Santunan Anak Yatim',
			target: 50000000,
			collected: 15000000,
			deadline: '2023-12-31',
			status: 'active',
			donors: 20
		},
		{
			id: '3',
			title: 'Wakaf Al-Quran',
			target: 20000000,
			collected: 20000000,
			deadline: '2023-11-30',
			status: 'completed',
			donors: 50
		}
	];

	const transactions = [
		{
			id: 'TRX-001',
			donorName: 'Hamba Allah',
			amount: 1000000,
			campaign: 'Renovasi Kubah Masjid',
			date: '2023-12-05T10:30:00Z',
			paymentMethod: 'QRIS',
			status: 'success'
		},
		{
			id: 'TRX-002',
			donorName: 'Budi Santoso',
			amount: 500000,
			campaign: 'Santunan Anak Yatim',
			date: '2023-12-05T09:15:00Z',
			paymentMethod: 'Transfer Bank',
			status: 'success'
		},
		{
			id: 'TRX-003',
			donorName: 'Siti Aminah',
			amount: 250000,
			campaign: 'Renovasi Kubah Masjid',
			date: '2023-12-04T16:45:00Z',
			paymentMethod: 'E-Wallet',
			status: 'pending'
		}
	];

	const totalCollected = campaigns.reduce((acc, curr) => acc + curr.collected, 0);
	const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
	const totalDonors = campaigns.reduce((acc, curr) => acc + curr.donors, 0);

	return {
		campaigns,
		transactions,
		stats: {
			totalCollected,
			activeCampaigns,
			totalDonors
		}
	};
};

export const actions: Actions = {
	createCampaign: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		// TODO: Save to DB
		return { success: true, message: 'Program donasi berhasil dibuat' };
	},
	updateCampaign: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		// TODO: Update DB
		return { success: true, message: 'Program donasi berhasil diperbarui' };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		// TODO: Delete from DB
		return { success: true, message: 'Data berhasil dihapus' };
	}
};
