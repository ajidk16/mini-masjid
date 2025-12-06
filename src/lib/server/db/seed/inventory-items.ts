import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedInventoryItems() {
	console.log('Seeding inventory items...');
	try {
		const items = [
			{
				name: 'Karpet Sajadah',
				code: 'INV-001',
				category: 'Perlengkapan Sholat',
				quantity: 50,
				condition: 'good' as const,
				location: 'Ruang Utama'
			},
			{
				name: 'Sound System Portable',
				code: 'INV-002',
				category: 'Elektronik',
				quantity: 2,
				condition: 'good' as const,
				location: 'Gudang'
			}
		];

		for (const item of items) {
			await db
				.insert(table.inventoryItem)
				.values(item)
				.onConflictDoUpdate({
					target: table.inventoryItem.code,
					set: {
						name: item.name,
						category: item.category,
						quantity: item.quantity,
						condition: item.condition,
						location: item.location
					}
				});
		}
		console.log('Inventory items seeded successfully.');
	} catch (e) {
		console.error('Error seeding inventory items:', e);
	}
}
