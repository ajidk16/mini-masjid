import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 10;

	// Mock data - replace with database queries
	const transactions = [
		{
			id: '1',
			date: new Date().toISOString(),
			description: 'Infaq Jumat Minggu I',
			category: 'Infaq',
			amount: 2500000,
			notes: 'Pengumpulan kotak amal'
		},
		{
			id: '2',
			date: new Date(Date.now() - 86400000).toISOString(),
			description: 'Zakat Fitrah Keluarga Bapak Ahmad',
			category: 'Zakat',
			amount: 500000,
			notes: null
		},
		{
			id: '3',
			date: new Date(Date.now() - 2 * 86400000).toISOString(),
			description: 'Infaq Jumat Minggu II',
			category: 'Infaq',
			amount: 2800000,
			notes: null
		},
		{
			id: '4',
			date: new Date(Date.now() - 3 * 86400000).toISOString(),
			description: 'Sadaqah Hamba Allah',
			category: 'Sadaqah',
			amount: 1000000,
			notes: 'Transfer bank'
		},
		{
			id: '5',
			date: new Date(Date.now() - 4 * 86400000).toISOString(),
			description: 'Donasi Online',
			category: 'Infaq',
			amount: 750000,
			notes: 'Via website'
		},
		{
			id: '6',
			date: new Date(Date.now() - 5 * 86400000).toISOString(),
			description: 'Wakaf Al-Quran',
			category: 'Wakaf',
			amount: 5000000,
			notes: '10 mushaf Al-Quran'
		}
	];

	const categories = ['Infaq', 'Zakat', 'Sadaqah', 'Wakaf'];
	const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);

	return {
		transactions,
		categories,
		totalIncome,
		transactionCount: transactions.length,
		currentPage: page,
		totalPages: Math.ceil(transactions.length / limit)
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const date = formData.get('date') as string;
		const category = formData.get('category') as string;
		const amountRaw = formData.get('amountRaw') as string;
		const description = formData.get('description') as string;
		const notes = formData.get('notes') as string;

		if (!date || !category || !amountRaw || !description) {
			return fail(400, { error: 'Semua field wajib harus diisi' });
		}

		const amount = Number(amountRaw);
		if (isNaN(amount) || amount <= 0) {
			return fail(400, { error: 'Jumlah harus lebih dari 0' });
		}

		// TODO: Save to database
		console.log('Creating income:', { date, category, amount, description, notes });

		return { success: true, message: 'Pemasukan berhasil ditambahkan' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const date = formData.get('date') as string;
		const category = formData.get('category') as string;
		const amountRaw = formData.get('amountRaw') as string;
		const description = formData.get('description') as string;
		const notes = formData.get('notes') as string;

		if (!id || !date || !category || !amountRaw || !description) {
			return fail(400, { error: 'Semua field wajib harus diisi' });
		}

		const amount = Number(amountRaw);
		if (isNaN(amount) || amount <= 0) {
			return fail(400, { error: 'Jumlah harus lebih dari 0' });
		}

		// TODO: Update in database
		console.log('Updating income:', { id, date, category, amount, description, notes });

		return { success: true, message: 'Pemasukan berhasil diperbarui' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'ID tidak ditemukan' });
		}

		// TODO: Delete from database
		console.log('Deleting income:', id);

		return { success: true, message: 'Transaksi berhasil dihapus' };
	}
};
