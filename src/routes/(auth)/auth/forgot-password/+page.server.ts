import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createOtp } from '$lib/server/otp';
import { sendOtpEmail } from '$lib/server/email/nodemailer';
import { forgotPasswordSchema } from '$lib/schemas';

export const load = async () => {
	const form = await superValidate(valibot(forgotPasswordSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, valibot(forgotPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email } = form.data;

		try {
			// Find user
			const [user] = await db.select().from(table.user).where(eq(table.user.username, email));

			if (!user) {
				// Don't reveal if user exists
				return fail(400, {
					form,
					message: 'If an account exists with this email, you will receive a verification code.'
				});
			}

			const otp = await createOtp(user.id, 'password_reset');
			await sendOtpEmail(email, otp, 'password_reset');
		} catch (e) {
			console.error('Forgot password error:', e);
			return fail(500, {
				form,
				message: 'An error occurred. Please try again later.'
			});
		}

		throw redirect(302, `/auth/verify?email=${email}&type=reset`);
	}
};
