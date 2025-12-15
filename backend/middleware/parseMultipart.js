import multer from "multer";

const storage = multer.memoryStorage();
const parseMultipart = multer({ storage });

export default parseMultipart;
