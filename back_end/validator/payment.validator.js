const { body } = require('express-validator');


// ========================================
// Payment Request
// ========================================

const paymentRequestValidator = [
    body('address_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه آدرس الزامی است')
        .isUUID()
        .withMessage('شناسه آدرس نامعتبر است'),
];


// ========================================
// Payment Verify
// ========================================

const verifyPaymentValidator = [
    body('order_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه سفارش الزامی است')
        .isUUID()
        .withMessage('شناسه سفارش نامعتبر است'),

    body('Authority')
        .trim()
        .notEmpty()
        .withMessage('Authority الزامی است')
        .isLength({ max: 255 })
        .withMessage('Authority نامعتبر است'),

    body('Status')
        .trim()
        .notEmpty()
        .withMessage('وضعیت پرداخت الزامی است')
        .isIn(['OK', 'NOK'])
        .withMessage('وضعیت پرداخت نامعتبر است'),
];


module.exports = {
    paymentRequestValidator,
    verifyPaymentValidator,
};