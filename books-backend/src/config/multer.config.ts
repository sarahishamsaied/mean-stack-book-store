import multer from 'multer';
import path from 'path';

// Storage configuration
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'), // Absolute path to the uploads directory
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    callback(null, `${file.fieldname}-${Date.now()}${fileExtension}`);
  },
});

// File filter function to ensure only images are uploaded
const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new Error('Not an image! Please upload only images.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    fields: 10,
  },
});

export default upload;
