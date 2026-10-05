const { body } = require('express-validator');


// ایجاد دسته‌بندی
const createCategoryValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('نام دسته‌بندی الزامی است')
        .isLength({ min: 2, max: 100 })
        .withMessage('نام دسته‌بندی باید بین ۲ تا ۱۰۰ کاراکتر باشد'),

    body('description')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 5000 })
        .withMessage('توضیحات نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('وضعیت دسته‌بندی نامعتبر است'),
];


// ویرایش دسته‌بندی
const updateCategoryValidator = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('نام دسته‌بندی نمی‌تواند خالی باشد')
        .isLength({ min: 2, max: 100 })
        .withMessage('نام دسته‌بندی باید بین ۲ تا ۱۰۰ کاراکتر باشد'),

    body('description')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 5000 })
        .withMessage('توضیحات نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('وضعیت دسته‌بندی نامعتبر است'),
];


module.exports = {
    createCategoryValidator,
    updateCategoryValidator,
};