import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { inviteUserSchema, updateUserRoleSchema } from '$lib/schemas';
import { eq, desc } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

export const load = async () => {
	// Fetch users with their roles
	const users = await db
		.select({
			id: table.user.id,
			username: table.user.username,
			fullName: table.user.fullName,
			avatarUrl: table.user.avatarUrl,
			roleId: table.user.roleId,
			roleName: table.roles.name,
			createdAt: table.user.createdAt,
			phone: table.user.phone,
			emailVerified: table.user.emailVerified
		})
		.from(table.user)
		.leftJoin(table.roles, eq(table.user.roleId, table.roles.id))
		.orderBy(desc(table.user.createdAt));

	const roles = await db.select().from(table.roles);

	const inviteForm = await superValidate(valibot(inviteUserSchema));
	const roleForm = await superValidate(valibot(updateUserRoleSchema));

	return { users, roles, inviteForm, roleForm };
};

export const actions = {
	invite: async ({ request }) => {
		const form = await superValidate(request, valibot(inviteUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, email, roleId } = form.data;

		// Check if user exists
		const [existingUser] = await db.select().from(table.user).where(eq(table.user.username, email));

		if (existingUser) {
			return fail(400, { form, message: 'User already exists' });
		}

		const tempPassword = crypto.randomUUID().slice(0, 8);
		const passwordHash = await hash(tempPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userId = crypto.randomUUID();

		try {
			await db.insert(table.user).values({
				id: userId,
				username: email,
				fullName: name,
				passwordHash,
				roleId,
				emailVerified: new Date() // Auto-verify invited users or handle differently
			});

			// In a real app, send email with temp password or invite link
			// await sendInviteEmail(email, tempPassword);
			console.log(`Invited user ${email} with password ${tempPassword}`);
		} catch (error) {
			console.error('Invite failed:', error);
			return fail(500, { form, message: 'Failed to invite user' });
		}

		return { form, message: 'User invited successfully' };
	},

	updateRole: async ({ request }) => {
		const form = await superValidate(request, valibot(updateUserRoleSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { userId, roleId } = form.data;

		try {
			await db.update(table.user).set({ roleId }).where(eq(table.user.id, userId));
		} catch (error) {
			console.error('Update role failed:', error);
			return fail(500, { form, message: 'Failed to update role' });
		}

		return { form, message: 'Role updated successfully' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		console.log('Deleting user with ID:', userId);
		if (!userId) {
			return fail(400, { message: 'User ID required' });
		}

		try {
			await db.delete(table.otp).where(eq(table.otp.userId, userId));
			await db.delete(table.session).where(eq(table.session.userId, userId));
			await db.delete(table.auditLog).where(eq(table.auditLog.userId, userId));
			await db.delete(table.member).where(eq(table.member.userId, userId));
			await db.delete(table.announcement).where(eq(table.announcement.authorId, userId));
			await db.delete(table.user).where(eq(table.user.id, userId));
		} catch (error) {
			console.error('Delete user failed:', error);
			return fail(500, { message: 'Failed to delete user' });
		}

		return { success: true, message: 'User deleted successfully' };
	}
};
