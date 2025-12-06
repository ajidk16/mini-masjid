import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie, sessionCookieName } from '$lib/server/auth';

export const POST = async (event) => {
	const sessionId = event.cookies.get(sessionCookieName);
	if (!sessionId) {
		throw redirect(302, '/auth/login');
	}

	await invalidateSession(sessionId);
	deleteSessionTokenCookie(event);

	throw redirect(302, '/auth/login');
};
