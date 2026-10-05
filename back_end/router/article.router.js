const express = require('express');

const router = express.Router();


// ========================================
// Middleware
// ========================================

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


// ========================================
// Validator
// ========================================

const {
    articleUUIDValidator,
    createArticleValidator,
    updateArticleValidator,
    updateArticleStatusValidator,
} = require('../validator/article.validator');


// ========================================
// Controller
// ========================================

const {
    getAllArticles,
    getPublicArticles,
    getSingleArticle,
    getPublicSingleArticle,
    addArticle,
    editArticle,
    removeArticle,
    changeArticleStatus,
} = require('../controller/article.controller');


// ======================================================
// ADMIN ROUTES
// ======================================================

// Get all articles
// GET /api/articles/admin/all
router.get(
    '/admin/all',
    verifyToken,
    requireAdmin,
    getAllArticles
);


// Get article by UUID
// GET /api/articles/admin/:article_uuid
router.get(
    '/admin/:article_uuid',
    verifyToken,
    requireAdmin,
    articleUUIDValidator,
    validationHandler,
    getSingleArticle
);


// Create article
// POST /api/articles/admin
router.post(
    '/admin',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    createArticleValidator,
    validationHandler,
    addArticle
);


// Update article
// PUT /api/articles/admin/:article_uuid
router.put(
    '/admin/:article_uuid',
    verifyToken,
    requireAdmin,
    uploadSingleImage,
    updateArticleValidator,
    validationHandler,
    editArticle
);


// Delete article
// DELETE /api/articles/admin/:article_uuid
router.delete(
    '/admin/:article_uuid',
    verifyToken,
    requireAdmin,
    articleUUIDValidator,
    validationHandler,
    removeArticle
);


// Change article status
// PATCH /api/articles/admin/:article_uuid/status
router.patch(
    '/admin/:article_uuid/status',
    verifyToken,
    requireAdmin,
    updateArticleStatusValidator,
    validationHandler,
    changeArticleStatus
);


// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get published articles
// GET /api/articles
router.get(
    '/',
    getPublicArticles
);


// Get published article by UUID
// GET /api/articles/:article_uuid
router.get(
    '/:article_uuid',
    articleUUIDValidator,
    validationHandler,
    getPublicSingleArticle
);


module.exports = router;