import { fail } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { mosqueProfileSchema } from '$lib/schemas';
import { uploadImageFromBuffer, deleteImage, getPublicIdFromUrl } from '$lib/server/cloudinary';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const [profile] = await db.select().from(table.mosqueProfile).limit(1);

	const form = await superValidate(profile || {}, valibot(mosqueProfileSchema));

	return { form, profile };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, valibot(mosqueProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const imageFile = formData.get('image') as File;
		let imageUrl = form.data.imageUrl;

		if (imageFile && imageFile.size > 0) {
			try {
				const buffer = Buffer.from(await imageFile.arrayBuffer());
				const uploadResult = await uploadImageFromBuffer(buffer, 'tadbeer/profile');

				// Delete old image if exists
				if (imageUrl) {
					const publicId = getPublicIdFromUrl(imageUrl);
					if (publicId) await deleteImage(publicId);
				}

				imageUrl = uploadResult.secure_url;
			} catch (error) {
				console.error('Image upload failed:', error);
				return fail(500, { form, message: 'Image upload failed' });
			}
		}

		const data = {
			...form.data,
			imageUrl,
			updatedAt: new Date()
		};

		try {
			const [existingProfile] = await db.select().from(table.mosqueProfile).limit(1);

			if (existingProfile) {
				await db
					.update(table.mosqueProfile)
					.set(data)
					.where(eq(table.mosqueProfile.id, existingProfile.id));
			} else {
				await db.insert(table.mosqueProfile).values(data);
			}
		} catch (error) {
			console.error('Database update failed:', error);
			return fail(500, { form, message: 'Database update failed' });
		}

		return { form };
	}
};
