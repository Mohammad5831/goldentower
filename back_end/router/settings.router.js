const express = require('express');

const router = express.Router();

const {
    verifyToken,
    requireAdmin,
} = require('../middleware/auth.middleware');

const {
    validationHandler,
} = require('../middleware/error.middleware');

const {
    uploadSingleImage,
} = require('../middleware/upload.middleware');

const {
    settingsValidator,
} = require('../validator/settings.validator');

const {
    getAdminSettings,
    addSettings,
    editSettings,
} = require('../controller/settings.controller');


// ========================================
// Get Settings
// ========================================

router.get(
    '/',
    verifyToken,
    requireAdmin,
    getAdminSettings
);


// ========================================
// Create Settings
// ========================================

router.post(
    '/',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    settingsValidator,
    validationHandler,
    addSettings
);


// ========================================
// Update Settings
// ========================================

router.put(
    '/',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    settingsValidator,
    validationHandler,
    editSettings
);


module.exports = router;