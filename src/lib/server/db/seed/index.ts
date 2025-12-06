import { seedUsers } from './users.ts';
import { seedMosqueProfile } from './mosque-profile.ts';
import { seedProtectedRoutes } from './protected-route.ts';
import { seedMembers } from './members.ts';
import { seedEvents } from './events.ts';
import { seedFinancialTransactions } from './financial-transactions.ts';
import { seedInventoryItems } from './inventory-items.ts';
import { seedDonationCampaigns } from './donation-campaigns.ts';
import { seedAnnouncements } from './announcements.ts';

async function main() {
	console.log('Starting database seed...');

	await seedUsers();
	await seedMosqueProfile();
	await seedProtectedRoutes();
	await seedMembers();
	await seedEvents();
	await seedFinancialTransactions();
	await seedInventoryItems();
	await seedDonationCampaigns();
	await seedAnnouncements();

	console.log('Database seed completed.');
}

// Execute if run directly
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main()
		.then(() => process.exit(0))
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
}
