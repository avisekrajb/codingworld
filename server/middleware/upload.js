const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter for different file types
const fileFilter = (req, file, cb) => {
  // Check which field is being uploaded
  const field = file.fieldname;

  // For CV uploads (internship applications)
  if (field === 'cv') {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed for CV upload'));
    }
  }

  // For single image uploads (feedback photos, project thumbnails)
  if (field === 'photo' || field === 'image' || field === 'profile' || field === 'thumbnail') {
    const allowedTypes = /jpeg|jpg|png|gif|webp|heic/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed'));
    }
  }

  // For multiple image uploads (project gallery)
  if (field === 'images') {
    const allowedTypes = /jpeg|jpg|png|gif|webp|heic/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed for gallery images'));
    }
  }

  // Default - allow if no specific field match (use with caution)
  return cb(null, true);
};

// Create multer instance with dynamic file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
  fileFilter: fileFilter
});

module.exports = upload;