import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET
} from '$env/static/private';

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
	console.error('Cloudinary environment variables are missing!');
}

export const uploadImage = async (imagePath: string, folder: string = 'tadbeer') => {
	try {
		const result = await cloudinary.uploader.upload(imagePath, {
			folder: folder,
			format: 'avif',
			transformation: [{ quality: 'auto' }],
		});
		return result;
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		throw error;
	}
};

export const uploadImageFromBuffer = async (
	buffer: Buffer,
	folder: string = 'tadbeer'
): Promise<UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: folder,
				format: 'avif',
				transformation: [{ quality: 'auto' }]
			},
			(error, result) => {
				if (error) return reject(error);
				if (!result) return reject(new Error('No result from Cloudinary'));
				resolve(result);
			}
		);
		Readable.from(buffer).pipe(stream);
	});
};

export const deleteImage = async (publicId: string) => {
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		return result;
	} catch (error) {
		console.error('Cloudinary delete error:', error);
		throw error;
	}
};

export const getPublicIdFromUrl = (url: string) => {
	try {
		const splitUrl = url.split('/');
		const lastSegment = splitUrl.pop() || '';
		const publicIdWithExtension = lastSegment.split('.')[0];
		console.log('Extracted public ID with extension:', publicIdWithExtension);
		// Handle folders if present (e.g. tadbeer/avatars/image)
		// This simple extraction might fail for folders if we just take the last segment.
		// Better approach:
		// URL: https://res.cloudinary.com/cloudname/image/upload/v12345678/folder/image.jpg
		// Regex to capture everything after 'upload/v<numbers>/' and before '.'
		const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
		const match = url.match(regex);
		if (match && match[1]) {
			return match[1];
		}
		return null;
	} catch (error) {
		console.error('Error extracting public ID:', error);
		return null;
	}
};

export default cloudinary;
