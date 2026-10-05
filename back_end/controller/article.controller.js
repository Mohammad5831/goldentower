const {
    getArticles,
    getPublishedArticles,
    getArticleByUUID,
    getPublishedArticleByUUID,
    createArticle,
    updateArticle,
    deleteArticle,
    updateArticleStatus,
} = require('../service/article.service');


// ========================================
// Get All Articles
// ========================================

const getAllArticles = async (req, res) => {

    try {

        const articles = await getArticles();

        return res.status(200).json({
            success: true,
            message: 'مقالات با موفقیت دریافت شدند',
            articles,
        });

    } catch (error) {

        console.error('Get articles error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت مقالات',
        });
    }
};


// ========================================
// Get Published Articles
// ========================================

const getPublicArticles = async (req, res) => {

    try {

        const articles = await getPublishedArticles();

        return res.status(200).json({
            success: true,
            message: 'مقالات منتشرشده با موفقیت دریافت شدند',
            articles,
        });

    } catch (error) {

        console.error('Get published articles error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت مقالات',
        });
    }
};


// ========================================
// Get Article By UUID
// ========================================

const getSingleArticle = async (req, res) => {

    const { article_uuid } = req.params;

    try {

        const article = await getArticleByUUID(article_uuid);

        if (!article) {

            return res.status(404).json({
                success: false,
                message: 'مقاله موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'مقاله با موفقیت دریافت شد',
            article,
        });

    } catch (error) {

        console.error('Get article error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت مقاله',
        });
    }
};


// ========================================
// Get Published Article By UUID
// ========================================

const getPublicSingleArticle = async (req, res) => {

    const { article_uuid } = req.params;

    try {

        const article = await getPublishedArticleByUUID(article_uuid);

        if (!article) {

            return res.status(404).json({
                success: false,
                message: 'مقاله موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'مقاله با موفقیت دریافت شد',
            article,
        });

    } catch (error) {

        console.error('Get published article error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت مقاله',
        });
    }
};


// ========================================
// Create Article
// ========================================

const addArticle = async (req, res) => {

    try {

        const data = {
            ...req.body,
        };

        if (req.file) {
            data.main_image = req.file.filename;
        }

        const article = await createArticle(data);

        return res.status(201).json({
            success: true,
            message: 'مقاله با موفقیت ایجاد شد',
            article,
        });

    } catch (error) {

        console.error('Create article error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ایجاد مقاله',
        });
    }
};


// ========================================
// Update Article
// ========================================

const editArticle = async (req, res) => {

    const { article_uuid } = req.params;

    try {

        const data = {
            ...req.body,
        };

        if (req.file) {
            data.main_image = req.file.filename;
        }

        const article = await updateArticle(
            article_uuid,
            data
        );

        if (!article) {

            return res.status(404).json({
                success: false,
                message: 'مقاله موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'مقاله با موفقیت بروزرسانی شد',
            article,
        });

    } catch (error) {

        console.error('Update article error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در بروزرسانی مقاله',
        });
    }
};


// ========================================
// Delete Article
// ========================================

const removeArticle = async (req, res) => {

    const { article_uuid } = req.params;

    try {

        const result = await deleteArticle(article_uuid);

        if (!result) {

            return res.status(404).json({
                success: false,
                message: 'مقاله موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'مقاله با موفقیت حذف شد',
        });

    } catch (error) {

        console.error('Delete article error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در حذف مقاله',
        });
    }
};


// ========================================
// Update Article Status
// ========================================

const changeArticleStatus = async (req, res) => {

    const { article_uuid } = req.params;
    const { status } = req.body;

    try {

        const article = await updateArticleStatus(
            article_uuid,
            status
        );

        if (!article) {

            return res.status(404).json({
                success: false,
                message: 'مقاله موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'وضعیت مقاله با موفقیت تغییر کرد',
            article,
        });

    } catch (error) {

        console.error('Change article status error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در تغییر وضعیت مقاله',
        });
    }
};


module.exports = {

    getAllArticles,
    getPublicArticles,

    getSingleArticle,
    getPublicSingleArticle,

    addArticle,
    editArticle,

    removeArticle,

    changeArticleStatus,
};