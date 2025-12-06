import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { verifyOtp } from '$lib/server/otp';
import { invalidateSession } from '$lib/server/auth';
import { changePasswordSchema } from '$lib/schemas';

export const load = async ({ url }) => {
	const email = url.searchParams.get('email') || '';
	const otp = url.searchParams.get('otp') || ''; // Pre-fill if redirected from verify
	const form = await superValidate({ email, otp }, valibot(changePasswordSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, valibot(changePasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { email, otp, newPassword } = form.data;

			// Find user
			const [user] = await db.select().from(table.user).where(eq(table.user.username, email));

			if (!user) {
				return fail(400, {
					form,
					message: 'User not found'
				});
			}

			// Verify OTP again (security check, though verify page does it too, this is crucial for the actual action)
			const isValid = await verifyOtp(user.id, otp, 'password_reset');

			if (!isValid) {
				return fail(400, {
					form,
					message: 'Invalid or expired OTP. Please request a new one.'
				});
			}

			const passwordHash = await hash(newPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			// Update password
			await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, user.id));

			// Invalidate all sessions
			await db.delete(table.session).where(eq(table.session.userId, user.id));
		} catch (e) {
			console.error('Change password error:', e);
			return fail(500, {
				form,
				message: 'An error occurred while changing your password. Please try again.'
			});
		}

		throw redirect(302, '/auth/login?message=Password changed successfully');
	}
};
