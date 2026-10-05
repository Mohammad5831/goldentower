const express = require('express');
const { getOrders } = require('../controller/admin.controller');
const router = express.Router();


router.get('/orders', getOrders);

module.exports = router;