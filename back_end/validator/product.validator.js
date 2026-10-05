const { body } = require('express-validator');


// ========================================
// Create Product
// ========================================

const createProductValidator = [

    body('name')
        .trim()
        .notEmpty()
        .withMessage('نام محصول الزامی است')
        .isLength({ max: 255 })
        .withMessage('نام محصول نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('brand_id')
        .isInt({ min: 1 })
        .withMessage('شناسه برند نامعتبر است'),

    body('model')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage('مدل محصول نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('original_price')
        .isFloat({ min: 0 })
        .withMessage('قیمت اصلی نامعتبر است'),

    body('discount')
        .optional({ nullable: true })
        .isInt({ min: 0, max: 100 })
        .withMessage('تخفیف باید عددی بین ۰ تا ۱۰۰ باشد'),

    body('description')
        .optional({ nullable: true })
        .isString()
        .withMessage('توضیحات نامعتبر است'),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('موجودی باید عددی بزرگ‌تر یا مساوی صفر باشد'),

    body('offer')
        .optional()
        .isBoolean()
        .withMessage('مقدار offer باید true یا false باشد'),

    body('size')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage('سایز محصول نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('category_id')
        .isInt({ min: 1 })
        .withMessage('شناسه دسته‌بندی نامعتبر است'),
];


// ========================================
// Update Product
// ========================================

const updateProductValidator = [

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('نام محصول نمی‌تواند خالی باشد')
        .isLength({ max: 255 })
        .withMessage('نام محصول نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('brand_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شناسه برند نامعتبر است'),

    body('model')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage('مدل محصول نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('original_price')
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage('قیمت اصلی نامعتبر است'),

    body('discount')
        .optional({ nullable: true })
        .isInt({ min: 0, max: 100 })
        .withMessage('تخفیف باید عددی بین ۰ تا ۱۰۰ باشد'),

    body('description')
        .optional({ nullable: true })
        .isString()
        .withMessage('توضیحات نامعتبر است'),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('موجودی باید عددی بزرگ‌تر یا مساوی صفر باشد'),

    body('offer')
        .optional()
        .isBoolean()
        .withMessage('مقدار offer باید true یا false باشد'),

    body('size')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage('سایز محصول نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('شناسه دسته‌بندی نامعتبر است'),
];


// ========================================
// Export
// ========================================

module.exports = {
    createProductValidator,
    updateProductValidator,
};