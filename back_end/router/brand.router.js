const express = require('express');

const router = express.Router();

const {
    create,
    getAll,
    getSingle,
    update,
    del,
} = require('../controller/brand.controller');

const {
    createBrandValidator,
    updateBrandValidator,
} = require('../validator/brand.validator');

const {
    validationHandler,
} = require('../middleware/error.middleware');

const {
    verifyToken,
    requireAdmin,
} = require('../middleware/auth.middleware');

const {
    uploadSingleImage,
} = require('../middleware/upload.middleware');


// دریافت تمام برندها
router.get('/', getAll);


// دریافت یک برند
router.get('/:brand_uuid', getSingle);


// ایجاد برند
router.post(
    '/',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    createBrandValidator,
    validationHandler,
    create
);


// ویرایش برند
router.put(
    '/:brand_uuid',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    updateBrandValidator,
    validationHandler,
    update
);


// حذف برند
router.delete(
    '/:brand_uuid',
    verifyToken,
    requireAdmin,
    del
);


module.exports = router;