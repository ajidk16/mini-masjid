import { db } from './db.ts';
import * as table from '../schema.ts';

export async function seedMembers() {
	console.log('Seeding members...');
	try {
		const members = [
			{
				fullName: 'Ahmad Fulan',
				nik: '1234567890123456',
				phone: '081234567891',
				address: 'Jl. Mawar No. 10',
				status: 'active'
			},
			{
				fullName: 'Budi Santoso',
				nik: '1234567890123457',
				phone: '081234567892',
				address: 'Jl. Melati No. 5',
				status: 'active'
			}
		];

		for (const member of members) {
			await db
				.insert(table.member)
				.values(member)
				.onConflictDoUpdate({
					target: table.member.nik,
					set: {
						fullName: member.fullName,
						phone: member.phone,
						address: member.address,
						status: member.status
					}
				});
		}
		console.log('Members seeded successfully.');
	} catch (e) {
		console.error('Error seeding members:', e);
	}
}
