const { body, param } = require('express-validator');


// ========================================
// Article UUID Validator
// ========================================

const articleUUIDValidator = [
    param('article_uuid')
        .trim()
        .notEmpty()
        .withMessage('شناسه مقاله الزامی است')
        .isUUID()
        .withMessage('شناسه مقاله نامعتبر است'),
];


// ========================================
// Create Article Validator
// ========================================

const createArticleValidator = [

    body('title')
        .trim()
        .notEmpty()
        .withMessage('عنوان مقاله الزامی است')
        .isLength({ max: 255 })
        .withMessage('عنوان مقاله نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('دسته‌بندی مقاله الزامی است')
        .isLength({ max: 100 })
        .withMessage('دسته‌بندی مقاله نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('date')
        .notEmpty()
        .withMessage('تاریخ مقاله الزامی است')
        .isISO8601()
        .withMessage('تاریخ مقاله نامعتبر است'),

    body('reading_time')
        .notEmpty()
        .withMessage('زمان مطالعه الزامی است')
        .isInt({ min: 1 })
        .withMessage('زمان مطالعه باید حداقل ۱ دقیقه باشد'),

    body('author')
        .trim()
        .notEmpty()
        .withMessage('نام نویسنده الزامی است')
        .isLength({ max: 150 })
        .withMessage('نام نویسنده نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد'),

    body('excerpt')
        .trim()
        .notEmpty()
        .withMessage('خلاصه مقاله الزامی است'),

    body('content')
        .notEmpty()
        .withMessage('محتوای مقاله الزامی است')
        .isArray({ min: 1 })
        .withMessage('محتوای مقاله باید یک آرایه باشد')
        .custom((content) => {

            for (const item of content) {

                if (!item || typeof item !== 'object') {
                    throw new Error('ساختار محتوای مقاله نامعتبر است');
                }

                if (!['paragraph', 'heading'].includes(item.type)) {
                    throw new Error(
                        'نوع محتوای مقاله فقط می‌تواند paragraph یا heading باشد'
                    );
                }

                if (
                    typeof item.text !== 'string' ||
                    !item.text.trim()
                ) {
                    throw new Error(
                        'متن هر بخش از مقاله الزامی است'
                    );
                }
            }

            return true;
        }),

    body('status')
        .notEmpty()
        .withMessage('وضعیت مقاله الزامی است')
        .isIn(['draft', 'published'])
        .withMessage('وضعیت مقاله نامعتبر است'),
];


// ========================================
// Update Article Validator
// ========================================

const updateArticleValidator = [

    ...articleUUIDValidator,

    body('title')
        .trim()
        .notEmpty()
        .withMessage('عنوان مقاله الزامی است')
        .isLength({ max: 255 })
        .withMessage('عنوان مقاله نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('دسته‌بندی مقاله الزامی است')
        .isLength({ max: 100 })
        .withMessage('دسته‌بندی مقاله نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),

    body('date')
        .notEmpty()
        .withMessage('تاریخ مقاله الزامی است')
        .isISO8601()
        .withMessage('تاریخ مقاله نامعتبر است'),

    body('reading_time')
        .notEmpty()
        .withMessage('زمان مطالعه الزامی است')
        .isInt({ min: 1 })
        .withMessage('زمان مطالعه باید حداقل ۱ دقیقه باشد'),

    body('author')
        .trim()
        .notEmpty()
        .withMessage('نام نویسنده الزامی است')
        .isLength({ max: 150 })
        .withMessage('نام نویسنده نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد'),

    body('excerpt')
        .trim()
        .notEmpty()
        .withMessage('خلاصه مقاله الزامی است'),

    body('content')
        .notEmpty()
        .withMessage('محتوای مقاله الزامی است')
        .isArray({ min: 1 })
        .withMessage('محتوای مقاله باید یک آرایه باشد')
        .custom((content) => {

            for (const item of content) {

                if (!item || typeof item !== 'object') {
                    throw new Error('ساختار محتوای مقاله نامعتبر است');
                }

                if (!['paragraph', 'heading'].includes(item.type)) {
                    throw new Error(
                        'نوع محتوای مقاله فقط می‌تواند paragraph یا heading باشد'
                    );
                }

                if (
                    typeof item.text !== 'string' ||
                    !item.text.trim()
                ) {
                    throw new Error(
                        'متن هر بخش از مقاله الزامی است'
                    );
                }
            }

            return true;
        }),

    body('status')
        .notEmpty()
        .withMessage('وضعیت مقاله الزامی است')
        .isIn(['draft', 'published'])
        .withMessage('وضعیت مقاله نامعتبر است'),
];


// ========================================
// Update Article Status Validator
// ========================================

const updateArticleStatusValidator = [

    ...articleUUIDValidator,

    body('status')
        .notEmpty()
        .withMessage('وضعیت مقاله الزامی است')
        .isIn(['draft', 'published'])
        .withMessage('وضعیت مقاله نامعتبر است'),
];


module.exports = {

    articleUUIDValidator,

    createArticleValidator,
    updateArticleValidator,

    updateArticleStatusValidator,
};