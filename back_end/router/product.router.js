const express = require('express');

const router = express.Router();

const {
    create,
    update,
    del,
    getSingel,
    getAllByBrand,
    getAll,
    createGeneralSpec,
    createDetailedSpec,
    getOffers,
} = require('../controller/product.controller');

const {
    createProductValidator,
    updateProductValidator,
} = require('../validator/product.validator');

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


// ========================================
// Product - Admin
// ========================================

router.post(
    '/',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    createProductValidator,
    validationHandler,
    create
);

router.put(
    '/:product_uuid',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    updateProductValidator,
    validationHandler,
    update
);

router.delete(
    '/:product_uuid',
    verifyToken,
    requireAdmin,
    del
);


// ========================================
// Product Specs - Admin
// ========================================

router.post(
    '/detailed-spec/:product_uuid',
    verifyToken,
    requireAdmin,
    createDetailedSpec
);

router.post(
    '/general-spec/:product_uuid',
    verifyToken,
    requireAdmin,
    createGeneralSpec
);


// ========================================
// Public
// ========================================

router.get(
    '/offers',
    getOffers
);

router.get(
    '/brands/:brand_id',
    getAllByBrand
);

router.get(
    '/:product_uuid',
    getSingel
);

router.get(
    '/',
    getAll
);


module.exports = router;