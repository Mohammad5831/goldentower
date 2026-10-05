const express = require('express');

const router = express.Router();


// ========================================
// Middleware
// ========================================

const {
    verifyToken,
    requireUser,
} = require('../middleware/auth.middleware');

const {
    validationHandler,
} = require('../middleware/error.middleware');


// ========================================
// Validator
// ========================================

const {
    addressUUIDValidator,
    createAddressValidator,
    updateAddressValidator,
} = require('../validator/address.validator');


// ========================================
// Controller
// ========================================

const {
    getAddresses,
    getAddress,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
} = require('../controller/address.controller');


// ========================================
// Get All User Addresses
// ========================================

router.get(
    '/',
    verifyToken,
    requireUser,
    getAddresses
);


// ========================================
// Get Address By UUID
// ========================================

router.get(
    '/:address_uuid',
    verifyToken,
    requireUser,
    addressUUIDValidator,
    validationHandler,
    getAddress
);


// ========================================
// Create Address
// ========================================

router.post(
    '/',
    verifyToken,
    requireUser,
    createAddressValidator,
    validationHandler,
    addAddress
);


// ========================================
// Update Address
// ========================================

router.put(
    '/:address_uuid',
    verifyToken,
    requireUser,
    updateAddressValidator,
    validationHandler,
    editAddress
);


// ========================================
// Delete Address
// ========================================

router.delete(
    '/:address_uuid',
    verifyToken,
    requireUser,
    addressUUIDValidator,
    validationHandler,
    removeAddress
);


// ========================================
// Set Default Address
// ========================================

router.patch(
    '/:address_uuid/default',
    verifyToken,
    requireUser,
    addressUUIDValidator,
    validationHandler,
    makeDefaultAddress
);


module.exports = router;