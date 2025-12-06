import { db } from './db.ts';
import * as table from '../schema.ts';
import { hash } from '@node-rs/argon2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

export async function seedUsers() {
	console.log('Seeding users...');
	try {
		const passwordHash = await hash('password123', {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const users = [
			{
				id: encodeHexLowerCase(sha256(new TextEncoder().encode('super_admin'))),
				username: 'superadmin@example.com',
				passwordHash,
				fullName: 'Super Admin',
				role: 'super_admin' as const,
				emailVerified: new Date()
			},
			{
				id: encodeHexLowerCase(sha256(new TextEncoder().encode('admin'))),
				username: 'admin@example.com',
				passwordHash,
				fullName: 'Admin Masjid',
				role: 'admin' as const,
				emailVerified: new Date()
			},
			{
				id: encodeHexLowerCase(sha256(new TextEncoder().encode('imam'))),
				username: 'imam@example.com',
				passwordHash,
				fullName: 'Imam Masjid',
				role: 'imam' as const,
				emailVerified: new Date()
			},
			{
				id: encodeHexLowerCase(sha256(new TextEncoder().encode('bendahara'))),
				username: 'bendahara@example.com',
				passwordHash,
				fullName: 'Bendahara Masjid',
				role: 'bendahara' as const,
				emailVerified: new Date()
			},
			{
				id: encodeHexLowerCase(sha256(new TextEncoder().encode('jamaah'))),
				username: 'jamaah@example.com',
				passwordHash,
				fullName: 'Jamaah Masjid',
				role: 'jamaah' as const,
				emailVerified: new Date()
			}
		];

		for (const user of users) {
			await db
				.insert(table.user)
				.values(user)
				.onConflictDoUpdate({
					target: table.user.username,
					set: {
						passwordHash: user.passwordHash,
						fullName: user.fullName,
						role: user.role,
						emailVerified: user.emailVerified
					}
				});
		}
		console.log('Users seeded successfully.');
	} catch (e) {
		console.error('Error seeding users:', e);
	}
}
