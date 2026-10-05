
const { body, param } = require('express-validator');


// Add Product To Cart
const addCartItemValidator = [

    body('product_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه محصول الزامی است')
        .isUUID()
        .withMessage('شناسه محصول نامعتبر است'),

    body('quantity')
        .notEmpty()
        .withMessage('تعداد محصول الزامی است')
        .isInt({ min: 1 })
        .withMessage('تعداد محصول باید حداقل ۱ باشد'),
];


// Update Cart Item
const updateCartItemValidator = [

    body('product_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه محصول الزامی است')
        .isUUID()
        .withMessage('شناسه محصول نامعتبر است'),

    body('quantity')
        .notEmpty()
        .withMessage('تعداد محصول الزامی است')
        .isInt({ min: 1 })
        .withMessage('تعداد محصول باید حداقل ۱ باشد'),
];


// Delete Cart Item
const deleteCartItemValidator = [

    param('product_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه محصول الزامی است')
        .isUUID()
        .withMessage('شناسه محصول نامعتبر است'),
];


module.exports = {
    addCartItemValidator,
    updateCartItemValidator,
    deleteCartItemValidator,
};
