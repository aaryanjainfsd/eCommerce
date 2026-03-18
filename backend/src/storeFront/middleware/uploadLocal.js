// backend/middlewear/uploadLocal.js
import fs from "fs";
import path from "path";

export default function uploadLocal(req, res, next) {
	try {
        if (!req.file || !req.file.buffer) {
            req.localImage = null;
			return next();
		}
    
        const uploadDir = path.join(process.cwd(), "uploads", "productImages");
        
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const ext = path.extname(req.file.originalname);
		const fileName = `image-${Date.now()}${ext}`;
		const filePath = path.join(uploadDir, fileName);

		fs.writeFileSync(filePath, req.file.buffer);

		req.localImage = {
			url: `/uploads/productImages/${fileName}`,
			path: filePath
		};

		return next();
	} catch (error) {
		console.error("Local upload error:", error);
		return next(error);
	}
}
