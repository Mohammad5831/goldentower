const { body } = require('express-validator');

const phoneNumberValidator = [
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('شماره موبایل الزامی است')
    .isMobilePhone('fa-IR')
    .withMessage('شماره موبایل نامعتبر است'),
];

const verifyOtpValidator = [
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('شماره موبایل الزامی است')
    .isMobilePhone('fa-IR')
    .withMessage('شماره موبایل نامعتبر است'),

  body('otp')
    .trim()
    .notEmpty()
    .withMessage('کد تایید الزامی است')
    .isLength({ min: 6, max: 6 })
    .withMessage('کد تایید باید ۶ رقمی باشد')
    .isNumeric()
    .withMessage('کد تایید باید فقط شامل اعداد باشد')
];

module.exports = {
  phoneNumberValidator,
  verifyOtpValidator,
};