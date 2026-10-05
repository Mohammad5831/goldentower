const express = require('express');

const router = express.Router();

const {
    requestOtp,
    verifyOtpLogin,
    userGuest,
    getOrders,
} = require('../controller/user.controller');

const {
    phoneNumberValidator,
    verifyOtpValidator,
} = require('../validator/auth.validator');

const {
    validationHandler,
} = require('../middleware/error.middleware');

const {
    verifyToken,
    requireUser,
} = require('../middleware/auth.middleware');


router.post(
    '/request-otp',
    phoneNumberValidator,
    validationHandler,
    requestOtp
);

router.post(
    '/verify-otp',
    verifyOtpValidator,
    validationHandler,
    verifyOtpLogin
);

router.post(
    '/guest',
    userGuest
);

router.get(
    '/orders',
    verifyToken,
    requireUser,
    getOrders
);


module.exports = router;