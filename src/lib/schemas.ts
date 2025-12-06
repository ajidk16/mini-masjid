import * as v from 'valibot';

export const registerSchema = v.pipe(
	v.object({
		name: v.pipe(v.string(), v.minLength(3, 'Name must be at least 3 characters')),
		email: v.pipe(v.string(), v.email('Invalid email address')),
		password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
		confirmPassword: v.string()
	}),
	v.forward(
		v.check((input) => input.password === input.confirmPassword, "Passwords don't match"),
		['confirmPassword']
	)
);

export const loginSchema = v.object({
	email: v.pipe(v.string(), v.email('Invalid email address')),
	password: v.pipe(v.string(), v.minLength(1, 'Password is required'))
});

export const verifySchema = v.object({
	email: v.pipe(v.string(), v.email()),
	otp: v.pipe(v.string(), v.length(6, 'OTP must be 6 digits'))
});

export const forgotPasswordSchema = v.object({
	email: v.pipe(v.string(), v.email('Invalid email address'))
});

export const changePasswordSchema = v.pipe(
	v.object({
		email: v.pipe(v.string(), v.email()),
		otp: v.pipe(v.string(), v.length(6, 'OTP must be 6 digits')),
		newPassword: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
		confirmPassword: v.string()
	}),
	v.forward(
		v.check((input) => input.newPassword === input.confirmPassword, "Passwords don't match"),
		['confirmPassword']
	)
);

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;
export type VerifySchema = typeof verifySchema;
export type ForgotPasswordSchema = typeof forgotPasswordSchema;
export type ChangePasswordSchema = typeof changePasswordSchema;
