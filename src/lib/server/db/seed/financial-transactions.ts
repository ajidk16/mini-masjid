import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedFinancialTransactions() {
	console.log('Seeding financial transactions...');
	try {
		const transactions = [
			{
				type: 'income' as const,
				category: 'infaq' as const,
				amount: '500000',
				description: 'Infaq Kotak Jumat',
				date: new Date().toISOString().split('T')[0]
			},
			{
				type: 'expense' as const,
				category: 'operasional' as const,
				amount: '150000',
				description: 'Beli Token Listrik',
				date: new Date().toISOString().split('T')[0]
			}
		];

		const count = await db.$count(table.financialTransaction);
		if (count === 0) {
			await db.insert(table.financialTransaction).values(transactions);
		}
		console.log('Financial transactions seeded successfully.');
	} catch (e) {
		console.error('Error seeding financial transactions:', e);
	}
}
