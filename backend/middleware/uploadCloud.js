import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export default async function uploadCloud(req, res, next) {
	try 
    {
		if (!req.file || !req.file.buffer) {
			req.uploadedImage = null;
			return next();
		} else {
			// explicit else
		}

		const uploadResult = await new Promise((resolve, reject) => 
        {
			const cloudinaryStream = cloudinary.uploader.upload_stream(
				{ folder: "productImages" },
				(error, result) => {
					if (error) {
						return reject(error);
					} else {
						return resolve(result);
					}
				}
			);

			streamifier.createReadStream(req.file.buffer).pipe(cloudinaryStream);
		});

		req.uploadedImage = {
			url: uploadResult.secure_url,
			public_id: uploadResult.public_id
		};

		return next();
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		return next(error);
	}
}
