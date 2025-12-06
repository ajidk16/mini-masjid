import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyOtp } from '$lib/server/otp';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { verifySchema } from '$lib/schemas';

export const load = async ({ url }) => {
	const email = url.searchParams.get('email') || '';
	const otp = url.searchParams.get('otp') || ''; // Assuming otp might also come from URL for pre-filling
	const form = await superValidate({ email, otp }, valibot(verifySchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, valibot(verifySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { email, otp } = form.data;

			// Find user
			const [user] = await db.select().from(table.user).where(eq(table.user.username, email));

			if (!user) {
				return fail(400, {
					form,
					message: 'User not found'
				});
			}

			const isValid = await verifyOtp(user.id, otp, 'email_verification');

			if (!isValid) {
				return fail(400, {
					form,
					message: 'Invalid or expired OTP'
				});
			}

			// Mark email as verified
			await db
				.update(table.user)
				.set({ emailVerified: new Date() })
				.where(eq(table.user.id, user.id));

			// Create session
			const token = generateSessionToken();
			const session = await createSession(token, user.id);
			setSessionTokenCookie(event, token, session.expiresAt);
		} catch (e) {
			console.error('Verify error:', e);
			return fail(500, {
				form,
				message: 'An error occurred during verification. Please try again.'
			});
		}

		throw redirect(302, '/');
	}
};
