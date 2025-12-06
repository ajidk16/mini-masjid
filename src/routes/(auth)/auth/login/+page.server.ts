import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { loginSchema } from '$lib/schemas';

export const load = async () => {
	const form = await superValidate(valibot(loginSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, valibot(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { email, password } = form.data;

			// Find user
			const [user] = await db.select().from(table.user).where(eq(table.user.username, email));

			if (!user) {
				return fail(400, {
					form,
					message: 'Incorrect email or password'
				});
			}

			const validPassword = await verify(user.passwordHash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return fail(400, {
					form,
					message: 'Incorrect email or password'
				});
			}

			// Create session
			const token = generateSessionToken();
			const session = await createSession(token, user.id);
			setSessionTokenCookie(event, token, session.expiresAt);
		} catch (e) {
			console.error('Login error:', e);
			return fail(500, {
				form,
				message: 'An error occurred while signing in. Please try again.'
			});
		}

		throw redirect(302, '/admin/dashboard');
	}
};
