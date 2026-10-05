const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
];

const productStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'storage/products');
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `${crypto.randomUUID()}${extension}`;

        cb(null, filename);
    },

});

const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname).toLowerCase();

    if (
        file.mimetype.startsWith('image/') &&
        allowedExtensions.includes(extension)
    ) {
        return cb(null, true);
    }

    return cb(
        new Error('فقط فایل‌های JPG، JPEG، PNG و WEBP مجاز هستند.'),
        false
    );
};

const upload = multer({

    storage: productStorage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});

const uploadImagesMiddleware = upload.array('images', 5);

const uploadSingleImageMiddleware = upload.single('image');

const handleUploadError = (err, req, res, next) => {

    if (!err) {
        return next();
    }

    if (err instanceof multer.MulterError) {

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد.',
            });
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'تعداد یا نام فایل‌های ارسالی نامعتبر است.',
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(400).json({
        success: false,
        message: err.message,
    });

};

const uploadImages = [
    uploadImagesMiddleware,
    handleUploadError,
];

const uploadSingleImage = [
    uploadSingleImageMiddleware,
    handleUploadError,
];

module.exports = {
    uploadImages,
    uploadSingleImage,
};