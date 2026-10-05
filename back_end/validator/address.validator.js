const { body, param } = require('express-validator');


// ========================================
// Address UUID
// ========================================

const addressUUIDValidator = [
    param('address_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه آدرس الزامی است')
        .isUUID()
        .withMessage('شناسه آدرس نامعتبر است'),
];


// ========================================
// Create Address
// ========================================

const createAddressValidator = [

    body('title')
        .trim()
        .notEmpty()
        .withMessage('عنوان آدرس الزامی است')
        .isLength({ max: 100 })
        .withMessage('عنوان آدرس نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('receiver_name')
        .trim()
        .notEmpty()
        .withMessage('نام گیرنده الزامی است')
        .isLength({ max: 200 })
        .withMessage('نام گیرنده نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد'),

    body('receiver_phone')
        .trim()
        .notEmpty()
        .withMessage('شماره گیرنده الزامی است')
        .isMobilePhone('fa-IR')
        .withMessage('شماره گیرنده نامعتبر است'),

    body('province')
        .trim()
        .notEmpty()
        .withMessage('استان الزامی است')
        .isLength({ max: 100 })
        .withMessage('نام استان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('city')
        .trim()
        .notEmpty()
        .withMessage('شهر الزامی است')
        .isLength({ max: 100 })
        .withMessage('نام شهر نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('address')
        .trim()
        .notEmpty()
        .withMessage('آدرس الزامی است'),

    body('postal_code')
        .trim()
        .notEmpty()
        .withMessage('کد پستی الزامی است')
        .matches(/^\d{10}$/)
        .withMessage('کد پستی باید ۱۰ رقمی باشد'),

    body('plaque')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('پلاک نمی‌تواند بیشتر از ۲۰ کاراکتر باشد'),

    body('unit')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('واحد نمی‌تواند بیشتر از ۲۰ کاراکتر باشد'),

    body('is_default')
        .optional()
        .isBoolean()
        .withMessage('مقدار آدرس پیش‌فرض نامعتبر است'),
];


// ========================================
// Update Address
// ========================================

const updateAddressValidator = [

    ...addressUUIDValidator,

    body('title')
        .trim()
        .notEmpty()
        .withMessage('عنوان آدرس الزامی است')
        .isLength({ max: 100 })
        .withMessage('عنوان آدرس نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('receiver_name')
        .trim()
        .notEmpty()
        .withMessage('نام گیرنده الزامی است')
        .isLength({ max: 200 })
        .withMessage('نام گیرنده نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد'),

    body('receiver_phone')
        .trim()
        .notEmpty()
        .withMessage('شماره گیرنده الزامی است')
        .isMobilePhone('fa-IR')
        .withMessage('شماره گیرنده نامعتبر است'),

    body('province')
        .trim()
        .notEmpty()
        .withMessage('استان الزامی است')
        .isLength({ max: 100 })
        .withMessage('نام استان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('city')
        .trim()
        .notEmpty()
        .withMessage('شهر الزامی است')
        .isLength({ max: 100 })
        .withMessage('نام شهر نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('address')
        .trim()
        .notEmpty()
        .withMessage('آدرس الزامی است'),

    body('postal_code')
        .trim()
        .notEmpty()
        .withMessage('کد پستی الزامی است')
        .matches(/^\d{10}$/)
        .withMessage('کد پستی باید ۱۰ رقمی باشد'),

    body('plaque')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('پلاک نمی‌تواند بیشتر از ۲۰ کاراکتر باشد'),

    body('unit')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('واحد نمی‌تواند بیشتر از ۲۰ کاراکتر باشد'),
];


// ========================================
// Export
// ========================================

module.exports = {
    addressUUIDValidator,
    createAddressValidator,
    updateAddressValidator,
};