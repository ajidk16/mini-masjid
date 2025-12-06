import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { createOtp } from '$lib/server/otp';
import { sendOtpEmail } from '$lib/server/email/nodemailer';
import { registerSchema } from '$lib/schemas';

export const load = async () => {
	const form = await superValidate(valibot(registerSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, valibot(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, email, password } = form.data;

		// Check if user exists
		const [existingUser] = await db.select().from(table.user).where(eq(table.user.username, email)); // Using email as username for now

		if (existingUser) {
			return fail(400, {
				form,
				message: 'Email already registered'
			});
		}

		const passwordHash = await hash(password, {
			// recommended minimum parameters
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
				emailVerified: null,
				passwordHash,
				fullName: name,
				role: 'jamaah' // Default role
			});

			const otp = await createOtp(userId, 'email_verification');
			await sendOtpEmail(email, otp, 'email_verification');
		} catch (e) {
			console.error(e);
			return fail(500, {
				form,
				message: 'An error occurred while creating your account.'
			});
		}

		throw redirect(302, `/auth/verify?email=${email}`);
	}
};
