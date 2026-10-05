
const express = require('express');

const router = express.Router();

const {
    verifyToken,
    requireUser,
} = require('../middleware/auth.middleware');

const {
    addProductToCart,
    deleteFromCart,
    editCartProduct,
    getCart,
} = require('../controller/cart.controller');

const {
    addCartItemValidator,
    updateCartItemValidator,
    deleteCartItemValidator,
} = require('../validator/cart.validator');

const {
    validationHandler,
} = require('../middleware/error.middleware');


// Add Product To Cart
router.post(
    '/',
    verifyToken,
    requireUser,
    addCartItemValidator,
    validationHandler,
    addProductToCart
);


// Get Cart
router.get(
    '/',
    verifyToken,
    requireUser,
    getCart
);


// Update Cart Item
router.put(
    '/',
    verifyToken,
    requireUser,
    updateCartItemValidator,
    validationHandler,
    editCartProduct
);


// Delete Cart Item
router.delete(
    '/:product_uuid',
    verifyToken,
    requireUser,
    deleteCartItemValidator,
    validationHandler,
    deleteFromCart
);


module.exports = router;
