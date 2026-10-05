const express = require('express');

const router = express.Router();


// ========================================
// Middleware
// ========================================

const {
    verifyToken,
} = require('../middleware/auth.middleware');

const {
    validationHandler,
} = require('../middleware/error.middleware');


// ========================================
// Validator
// ========================================

const {
    paymentRequestValidator,
    verifyPaymentValidator,
} = require('../validator/payment.validator');


// ========================================
// Controller
// ========================================

const {
    paymentRequest,
    verifyPayment,
} = require('../controller/payment.controller');


// ========================================
// Authentication
// ========================================

router.use(verifyToken);


// ========================================
// Payment Request
// ========================================

router.post(
    '/request',
    paymentRequestValidator,
    validationHandler,
    paymentRequest
);


// ========================================
// Payment Verify
// ========================================

router.post(
    '/verify',
    verifyPaymentValidator,
    validationHandler,
    verifyPayment
);


module.exports = router;