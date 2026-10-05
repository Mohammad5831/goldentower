const { body } = require('express-validator');


// ========================================
// Settings Validator
// ========================================

const settingsValidator = [

    // ------------------------------------
    // General
    // ------------------------------------

    body('site_name')
        .trim()
        .notEmpty()
        .withMessage('نام سایت الزامی است')
        .isLength({ max: 150 })
        .withMessage('نام سایت نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد'),

    body('site_title')
        .trim()
        .notEmpty()
        .withMessage('عنوان سایت الزامی است')
        .isLength({ max: 255 })
        .withMessage('عنوان سایت نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('site_description')
        .optional({ nullable: true })
        .trim(),

    // ------------------------------------
    // Contact
    // ------------------------------------

    body('phone')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('شماره تماس نمی‌تواند بیشتر از ۲۰ کاراکتر باشد'),

    body('email')
        .optional({ nullable: true })
        .trim()
        .isEmail()
        .withMessage('ایمیل نامعتبر است')
        .isLength({ max: 150 })
        .withMessage('ایمیل نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد'),

    body('address')
        .optional({ nullable: true })
        .trim(),

    // ------------------------------------
    // Social
    // ------------------------------------

    body('instagram')
        .optional({ nullable: true })
        .trim()
        .isURL()
        .withMessage('لینک اینستاگرام نامعتبر است')
        .isLength({ max: 255 })
        .withMessage('لینک اینستاگرام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('telegram')
        .optional({ nullable: true })
        .trim()
        .isURL()
        .withMessage('لینک تلگرام نامعتبر است')
        .isLength({ max: 255 })
        .withMessage('لینک تلگرام نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('whatsapp')
        .optional({ nullable: true })
        .trim()
        .isURL()
        .withMessage('لینک واتساپ نامعتبر است')
        .isLength({ max: 255 })
        .withMessage('لینک واتساپ نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    // ------------------------------------
    // Store
    // ------------------------------------

    body('store_status')
        .notEmpty()
        .withMessage('وضعیت فروشگاه الزامی است')
        .isBoolean()
        .withMessage('وضعیت فروشگاه نامعتبر است'),

    body('allow_registration')
        .notEmpty()
        .withMessage('وضعیت ثبت‌نام الزامی است')
        .isBoolean()
        .withMessage('وضعیت ثبت‌نام نامعتبر است'),

    body('allow_guest_purchase')
        .notEmpty()
        .withMessage('وضعیت خرید مهمان الزامی است')
        .isBoolean()
        .withMessage('وضعیت خرید مهمان نامعتبر است'),

    // ------------------------------------
    // Shipping
    // ------------------------------------

    body('shipping_enabled')
        .notEmpty()
        .withMessage('وضعیت ارسال الزامی است')
        .isBoolean()
        .withMessage('وضعیت ارسال نامعتبر است'),

    body('shipping_cost')
        .notEmpty()
        .withMessage('هزینه ارسال الزامی است')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('هزینه ارسال نامعتبر است')
        .custom(value => Number(value) >= 0)
        .withMessage('هزینه ارسال نمی‌تواند منفی باشد'),

    body('free_shipping_enabled')
        .notEmpty()
        .withMessage('وضعیت ارسال رایگان الزامی است')
        .isBoolean()
        .withMessage('وضعیت ارسال رایگان نامعتبر است'),

    body('free_shipping_minimum')
        .notEmpty()
        .withMessage('حداقل مبلغ ارسال رایگان الزامی است')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('حداقل مبلغ ارسال رایگان نامعتبر است')
        .custom(value => Number(value) >= 0)
        .withMessage('حداقل مبلغ ارسال رایگان نمی‌تواند منفی باشد'),

    // ------------------------------------
    // Payment
    // ------------------------------------

    body('online_payment_enabled')
        .notEmpty()
        .withMessage('وضعیت پرداخت آنلاین الزامی است')
        .isBoolean()
        .withMessage('وضعیت پرداخت آنلاین نامعتبر است'),

    body('cash_on_delivery')
        .notEmpty()
        .withMessage('وضعیت پرداخت در محل الزامی است')
        .isBoolean()
        .withMessage('وضعیت پرداخت در محل نامعتبر است'),

    // ------------------------------------
    // SEO
    // ------------------------------------

    body('meta_title')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('عنوان متا نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('meta_description')
        .optional({ nullable: true })
        .trim(),

    body('meta_keywords')
        .optional({ nullable: true })
        .trim(),

    // ------------------------------------
    // Language
    // ------------------------------------

    body('language')
        .notEmpty()
        .withMessage('زبان سایت الزامی است')
        .isIn(['fa', 'en'])
        .withMessage('زبان سایت نامعتبر است'),

    // ------------------------------------
    // Home Banner
    // ------------------------------------

    body('home_banner_alt')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('متن جایگزین بنر نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('home_banner_link')
        .optional({ nullable: true })
        .trim()
        .isURL()
        .withMessage('لینک بنر نامعتبر است')
        .isLength({ max: 500 })
        .withMessage('لینک بنر نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد'),

    body('home_banner_enabled')
        .notEmpty()
        .withMessage('وضعیت بنر الزامی است')
        .isBoolean()
        .withMessage('وضعیت بنر نامعتبر است'),
];


module.exports = {
    settingsValidator,
};