import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomInt } from 'crypto';

/**
 * Generate a secure 6-digit OTP
 */
export function generateOtp(): string {
	return randomInt(0, 1000000).toString().padStart(6, '0');
}

/**
 * Create and save OTP for a user
 */
export async function createOtp(userId: string, type: 'email_verification' | 'password_reset') {
	// Delete existing OTPs of same type for this user
	await db.delete(table.otp).where(and(eq(table.otp.userId, userId), eq(table.otp.type, type)));

	const otpCode = generateOtp();
	const expiresAt = getOtpExpiration(10); // 10 minutes

	await db.insert(table.otp).values({
		userId,
		code: otpCode, // In production, you might want to hash this too, but for simplicity/UX we store plain for now or hash if strict
		type,
		expiresAt
	});

	return otpCode;
}

/**
 * Verify OTP
 */
export async function verifyOtp(
	userId: string,
	code: string,
	type: 'email_verification' | 'password_reset'
): Promise<boolean> {
	const [otpRecord] = await db
		.select()
		.from(table.otp)
		.where(
			and(
				eq(table.otp.userId, userId),
				eq(table.otp.type, type),
				eq(table.otp.code, code),
				gt(table.otp.expiresAt, new Date())
			)
		);

	if (otpRecord) {
		// Delete OTP after successful verification
		await db.delete(table.otp).where(eq(table.otp.id, otpRecord.id));
		return true;
	}

	return false;
}

/**
 * Generate OTP expiration time (default: 10 minutes)
 */
export function getOtpExpiration(minutes: number = 10): Date {
	return new Date(Date.now() + minutes * 60 * 1000);
}
