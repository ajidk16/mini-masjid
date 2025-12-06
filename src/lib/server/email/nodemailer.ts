import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS } from '$env/static/private';
import OtpEmail from '$lib/email/otp.svelte';
import { render } from 'svelte/server';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: GMAIL_USER,
		pass: GMAIL_PASS
	}
});

export async function sendOtpEmail(
	to: string,
	otp: string,
	type: 'email_verification' | 'password_reset'
) {
	const subject = type === 'email_verification' ? 'Verifikasi Email Anda' : 'Reset Password Anda';

	const html = render(OtpEmail, {
		props: {
			otp: otp, // Send plain OTP via email
			appName: 'Yaa Qeen'
		}
	});

	await transporter.sendMail({
		from: `"TadBeer" <${GMAIL_USER}>`,
		to,
		subject,
		html: html.body
	});
}
