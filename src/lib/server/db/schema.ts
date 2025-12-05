import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	boolean,
	pgEnum,
	date,
	decimal,
} from 'drizzle-orm/pg-core';

// --- Enums ---
export const roleEnum = pgEnum('role', ['super_admin', 'admin', 'imam', 'bendahara', 'jamaah']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const transactionCategoryEnum = pgEnum('transaction_category', [
	'infaq',
	'zakat',
	'wakaf',
	'operasional',
	'maintenance',
	'gaji',
	'kegiatan',
	'lainnya'
]);
export const eventTypeEnum = pgEnum('event_type', [
	'kajian',
	'ibadah',
	'sosial',
	'phbi',
	'rapat',
	'lainnya'
]);
export const eventStatusEnum = pgEnum('event_status', [
	'scheduled',
	'ongoing',
	'completed',
	'cancelled'
]);
export const assetConditionEnum = pgEnum('asset_condition', [
	'good',
	'maintenance',
	'damaged',
	'lost'
]);
export const donationStatusEnum = pgEnum('donation_status', ['pending', 'verified', 'rejected']);
export const announcementCategoryEnum = pgEnum('announcement_category', [
	'berita',
	'laporan',
	'pengumuman',
	'jadwal'
]);

// --- Tables ---

/**
 * Users table extended with role and profile info
 */
export const user = pgTable('user', {
	id: text('id').primaryKey(), // Using text for ID (e.g., Lucia auth ID or UUID)
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	fullName: text('full_name'),
	role: roleEnum('role').default('jamaah').notNull(),
	phone: text('phone'),
	avatarUrl: text('avatar_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

/**
 * Mosque Profile (Single record usually)
 */
export const mosqueProfile = pgTable('mosque_profile', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	address: text('address').notNull(),
	phone: text('phone'),
	email: text('email'),
	website: text('website'),
	vision: text('vision'),
	mission: text('mission'),
	history: text('history'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

/**
 * Financial Transactions
 */
export const financialTransaction = pgTable('financial_transaction', {
	id: serial('id').primaryKey(),
	type: transactionTypeEnum('type').notNull(),
	category: transactionCategoryEnum('category').notNull(),
	amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
	description: text('description').notNull(),
	date: date('date').defaultNow().notNull(),
	proofUrl: text('proof_url'),
	recordedBy: text('recorded_by').references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
});

/**
 * Events / Kegiatan
 */
export const event = pgTable('event', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	type: eventTypeEnum('type').notNull(),
	status: eventStatusEnum('status').default('scheduled').notNull(),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time').notNull(),
	location: text('location'),
	speaker: text('speaker'),
	imageUrl: text('image_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
});

/**
 * Members / Jamaah Data
 */
export const member = pgTable('member', {
	id: serial('id').primaryKey(),
	userId: text('user_id').references(() => user.id), // Optional link to system user
	fullName: text('full_name').notNull(),
	nik: text('nik').unique(),
	phone: text('phone'),
	address: text('address'),
	birthDate: date('birth_date'),
	joinDate: date('join_date').defaultNow(),
	status: text('status').default('active'), // active, inactive, moved, deceased
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
});

/**
 * Inventory Items
 */
export const inventoryItem = pgTable('inventory_item', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	code: text('code').unique().notNull(),
	category: text('category').notNull(), // e.g., Elektronik, Furniture
	quantity: integer('quantity').default(0).notNull(),
	condition: assetConditionEnum('condition').default('good').notNull(),
	location: text('location'),
	purchaseDate: date('purchase_date'),
	price: decimal('price', { precision: 15, scale: 2 }),
	imageUrl: text('image_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
});

/**
 * Donation Campaigns & Records
 */
export const donationCampaign = pgTable('donation_campaign', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	targetAmount: decimal('target_amount', { precision: 15, scale: 2 }),
	startDate: date('start_date').notNull(),
	endDate: date('end_date'),
	imageUrl: text('image_url'),
	active: boolean('active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const donation = pgTable('donation', {
	id: serial('id').primaryKey(),
	campaignId: integer('campaign_id').references(() => donationCampaign.id),
	donorName: text('donor_name').default('Hamba Allah'),
	donorPhone: text('donor_phone'),
	amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
	paymentMethod: text('payment_method'), // transfer, qris, cash
	status: donationStatusEnum('status').default('pending').notNull(),
	proofUrl: text('proof_url'),
	verifiedBy: text('verified_by').references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

/**
 * Announcements / Informasi
 */
export const announcement = pgTable('announcement', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	content: text('content').notNull(),
	category: announcementCategoryEnum('category').notNull(),
	authorId: text('author_id').references(() => user.id),
	isPublished: boolean('is_published').default(false).notNull(),
	publishedAt: timestamp('published_at'),
	imageUrl: text('image_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at')
});

/**
 * Audit Log for tracking changes
 */
export const auditLog = pgTable('audit_log', {
	id: serial('id').primaryKey(),
	tableName: text('table_name').notNull(),
	recordId: text('record_id').notNull(), // Stored as text to handle both int and string IDs
	action: text('action').notNull(), // CREATE, UPDATE, DELETE, RESTORE
	userId: text('user_id').references(() => user.id),
	oldValues: text('old_values'), // JSON string
	newValues: text('new_values'), // JSON string
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
