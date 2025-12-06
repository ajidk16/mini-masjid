import { db } from './db.ts';
import * as table from '../schema.ts';

const INITIAL_ROUTES = [
	// 1. Super Admin Only (Manage Admins/Settings)
	{
		prefix: '/admin/users',
		roles: ['super_admin']
	},
	{
		prefix: '/admin/settings',
		roles: ['super_admin']
	},

	// 2. Finance Module (Bendahara + Admins)
	{
		prefix: '/admin/keuangan',
		roles: ['super_admin', 'admin', 'bendahara']
	},
	{
		prefix: '/admin/donasi',
		roles: ['super_admin', 'admin', 'bendahara']
	},
	{
		prefix: '/admin/laporan',
		roles: ['super_admin', 'admin', 'bendahara']
	},

	// 3. Activities & Content Module (Imam + Admins)
	{
		prefix: '/admin/kegiatan',
		roles: ['super_admin', 'admin', 'imam']
	},
	{
		prefix: '/admin/pengumuman',
		roles: ['super_admin', 'admin', 'imam']
	},
	{
		prefix: '/admin/jadwal',
		roles: ['super_admin', 'admin', 'imam']
	},

	// 4. Base Admin Access (Dashboard)
	{
		prefix: '/admin',
		roles: ['super_admin', 'admin', 'bendahara', 'imam']
	},

	// 5. General App Access (Jamaah + All)
	{
		prefix: '/app',
		roles: ['super_admin', 'admin', 'bendahara', 'imam', 'jamaah']
	}
];

export async function seedProtectedRoutes() {
	console.log('Seeding protected routes...');
	try {
		for (const route of INITIAL_ROUTES) {
			await db
				.insert(table.protectedRoute)
				.values(route)
				.onConflictDoUpdate({
					target: table.protectedRoute.prefix,
					set: { roles: route.roles }
				});
		}
		console.log('Protected routes seeded successfully.');
	} catch (e) {
		console.error('Error seeding protected routes:', e);
	}
}
