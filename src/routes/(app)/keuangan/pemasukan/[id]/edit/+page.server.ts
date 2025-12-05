import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// Mock data - replace with database query
	const transaction = {
		id,
		date: new Date().toISOString(),
		description: 'Infaq Jumat Minggu I',
		category: 'Infaq',
		amount: 2500000,
		notes: 'Pengumpulan kotak amal'
	};

	return { transaction };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
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

		// TODO: Update in database
		console.log('Updating income:', { id: params.id, date, category, amount, description, notes });

		throw redirect(303, '/keuangan/pemasukan');
	},

	delete: async ({ params }) => {
		// TODO: Delete from database
		console.log('Deleting income:', params.id);

		throw redirect(303, '/keuangan/pemasukan');
	}
};
