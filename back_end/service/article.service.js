const {
    Article,
} = require('../model');


// ========================================
// Get All Articles
// ========================================

const getArticles = async () => {

    const articles = await Article.findAll({
        attributes: {
            exclude: ['article_id'],
        },
        order: [
            ['date', 'DESC'],
        ],
    });

    return articles;
};


// ========================================
// Get Published Articles
// ========================================

const getPublishedArticles = async () => {

    const articles = await Article.findAll({
        where: {
            status: 'published',
        },
        attributes: {
            exclude: ['article_id'],
        },
        order: [
            ['date', 'DESC'],
        ],
    });

    return articles;
};


// ========================================
// Get Article By UUID
// ========================================

const getArticleByUUID = async (article_uuid) => {

    const article = await Article.findOne({
        where: {
            article_uuid,
        },
        attributes: {
            exclude: ['article_id'],
        },
    });

    return article;
};


// ========================================
// Get Published Article By UUID
// ========================================

const getPublishedArticleByUUID = async (article_uuid) => {

    const article = await Article.findOne({
        where: {
            article_uuid,
            status: 'published',
        },
        attributes: {
            exclude: ['article_id'],
        },
    });

    return article;
};


// ========================================
// Create Article
// ========================================

const createArticle = async (data) => {

    const article = await Article.create({
        title: data.title,
        category: data.category,
        main_image: data.main_image,

        date: data.date,
        reading_time: data.reading_time,
        author: data.author,

        excerpt: data.excerpt,

        content: data.content,

        status: data.status,
    });

    return article;
};


// ========================================
// Update Article
// ========================================

const updateArticle = async (article_uuid, data) => {

    const article = await Article.findOne({
        where: {
            article_uuid,
        },
    });

    if (!article) {
        return null;
    }

    await article.update({
        title: data.title,
        category: data.category,

        ...(data.main_image !== undefined && {
            main_image: data.main_image,
        }),

        date: data.date,
        reading_time: data.reading_time,
        author: data.author,

        excerpt: data.excerpt,

        content: data.content,

        status: data.status,
    });

    return article;
};


// ========================================
// Delete Article
// ========================================

const deleteArticle = async (article_uuid) => {

    const article = await Article.findOne({
        where: {
            article_uuid,
        },
    });

    if (!article) {
        return null;
    }

    await article.destroy();

    return true;
};


// ========================================
// Update Article Status
// ========================================

const updateArticleStatus = async (article_uuid, status) => {

    const article = await Article.findOne({
        where: {
            article_uuid,
        },
    });

    if (!article) {
        return null;
    }

    await article.update({
        status,
    });

    return article;
};


module.exports = {
    getArticles,
    getPublishedArticles,

    getArticleByUUID,
    getPublishedArticleByUUID,

    createArticle,
    updateArticle,

    deleteArticle,

    updateArticleStatus,
};