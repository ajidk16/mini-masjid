import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Mock data - replace with database queries
	const transactions = [
		{
			id: '1',
			date: new Date().toISOString(),
			description: 'Pembayaran Listrik',
			category: 'Operasional',
			amount: 850000,
			notes: 'PLN bulan November'
		},
		{
			id: '2',
			date: new Date(Date.now() - 86400000).toISOString(),
			description: 'Pembelian Sajadah',
			category: 'Proyek',
			amount: 1500000,
			notes: '20 lembar sajadah'
		},
		{
			id: '3',
			date: new Date(Date.now() - 2 * 86400000).toISOString(),
			description: 'Gaji Marbot',
			category: 'Gaji',
			amount: 2000000,
			notes: 'Bulan November'
		},
		{
			id: '4',
			date: new Date(Date.now() - 3 * 86400000).toISOString(),
			description: 'Pembayaran Air PDAM',
			category: 'Operasional',
			amount: 350000,
			notes: null
		},
		{
			id: '5',
			date: new Date(Date.now() - 4 * 86400000).toISOString(),
			description: 'Pembelian Sound System',
			category: 'Proyek',
			amount: 5000000,
			notes: 'Upgrade speaker masjid'
		}
	];

	const categories = ['Operasional', 'Proyek', 'Gaji', 'Lainnya'];
	const totalExpense = transactions.reduce((sum, tx) => sum + tx.amount, 0);
	const largestExpense = Math.max(...transactions.map((tx) => tx.amount));

	return {
		transactions,
		categories,
		totalExpense,
		largestExpense,
		transactionCount: transactions.length
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

		console.log('Creating expense:', { date, category, amount, description, notes });
		return { success: true, message: 'Pengeluaran berhasil ditambahkan' };
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

		console.log('Updating expense:', { id, date, category, amount, description, notes });
		return { success: true, message: 'Pengeluaran berhasil diperbarui' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID tidak ditemukan' });

		console.log('Deleting expense:', id);
		return { success: true, message: 'Transaksi berhasil dihapus' };
	}
};
