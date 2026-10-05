const { body } = require('express-validator');


// ایجاد برند
const createBrandValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('عنوان برند الزامی است')
        .isLength({ min: 2, max: 100 })
        .withMessage('عنوان برند باید بین ۲ تا ۱۰۰ کاراکتر باشد'),

    body('name')
        .trim()
        .notEmpty()
        .withMessage('نام برند الزامی است')
        .isLength({ min: 2, max: 100 })
        .withMessage('نام برند باید بین ۲ تا ۱۰۰ کاراکتر باشد'),
];


// ویرایش برند
const updateBrandValidator = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('عنوان برند نمی‌تواند خالی باشد')
        .isLength({ min: 2, max: 100 })
        .withMessage('عنوان برند باید بین ۲ تا ۱۰۰ کاراکتر باشد'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('نام برند نمی‌تواند خالی باشد')
        .isLength({ min: 2, max: 100 })
        .withMessage('نام برند باید بین ۲ تا ۱۰۰ کاراکتر باشد'),
];


module.exports = {
    createBrandValidator,
    updateBrandValidator,
};