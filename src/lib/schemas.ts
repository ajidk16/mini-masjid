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

export const mosqueProfileSchema = v.object({
	name: v.pipe(v.string(), v.minLength(3, 'Name is required')),
	address: v.pipe(v.string(), v.minLength(5, 'Address is required')),
	phone: v.optional(v.string()),
	email: v.optional(v.pipe(v.string(), v.email())),
	website: v.optional(v.string()),
	vision: v.optional(v.string()),
	mission: v.optional(v.string()),
	history: v.optional(v.string()),
	imageUrl: v.optional(v.string())
});

export type MosqueProfileSchema = typeof mosqueProfileSchema;

export const inviteUserSchema = v.object({
	name: v.pipe(v.string(), v.minLength(3, 'Name is required')),
	email: v.pipe(v.string(), v.email('Invalid email address')),
	roleId: v.number('Role is required')
});

export const updateUserRoleSchema = v.object({
	userId: v.string(),
	roleId: v.number('Role is required')
});

export type InviteUserSchema = typeof inviteUserSchema;
export type UpdateUserRoleSchema = typeof updateUserRoleSchema;
