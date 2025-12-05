import { relations } from 'drizzle-orm';
import {
	user,
	session,
	financialTransaction,
	event,
	member,
	donation,
	donationCampaign,
	announcement,
	auditLog
} from './schema';

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	recordedTransactions: many(financialTransaction),
	verifiedDonations: many(donation),
	authoredAnnouncements: many(announcement),
	auditLogs: many(auditLog)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const financialTransactionRelations = relations(financialTransaction, ({ one }) => ({
	recorder: one(user, {
		fields: [financialTransaction.recordedBy],
		references: [user.id]
	})
}));

export const memberRelations = relations(member, ({ one }) => ({
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	})
}));

export const donationCampaignRelations = relations(donationCampaign, ({ many }) => ({
	donations: many(donation)
}));

export const donationRelations = relations(donation, ({ one }) => ({
	campaign: one(donationCampaign, {
		fields: [donation.campaignId],
		references: [donationCampaign.id]
	}),
	verifier: one(user, {
		fields: [donation.verifiedBy],
		references: [user.id]
	})
}));

export const announcementRelations = relations(announcement, ({ one }) => ({
	author: one(user, {
		fields: [announcement.authorId],
		references: [user.id]
	})
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
	user: one(user, {
		fields: [auditLog.userId],
		references: [user.id]
	})
}));
