const express = require('express');

const router = express.Router();

const {
    create,
    getAll,
    getSingle,
    update,
    del,
} = require('../controller/category.controller');

const {
    verifyToken,
    requireAdmin,
} = require('../middleware/auth.middleware');

const {
    createCategoryValidator,
    updateCategoryValidator
} = require('../validator/category.validator');

const {
    validationHandler
} = require('../middleware/error.middleware');


// دریافت تمام دسته‌بندی‌ها
router.get('/', getAll);

// دریافت یک دسته‌بندی
router.get('/:category_uuid', getSingle);


// ایجاد یک دسته بندی
router.post(
    '/',
    verifyToken,
    requireAdmin,
    createCategoryValidator,
    validationHandler,
    create
);

// ویرایش یک دسته بندی
router.put(
    '/:category_uuid',
    verifyToken,
    requireAdmin,
    updateCategoryValidator,
    validationHandler,
    update
);


// حذف دسته‌بندی
router.delete(
    '/:category_uuid',
    verifyToken,
    requireAdmin,
    del
);


module.exports = router;