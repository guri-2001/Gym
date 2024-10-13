// backend/middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// Set up storage location and naming convention for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Appends timestamp to avoid name conflicts
    },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

// Set multer options
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, // limit file size to 1MB
    fileFilter: fileFilter,
});

module.exports = upload;
