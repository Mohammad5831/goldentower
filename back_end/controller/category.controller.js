const {
    createCategory,
    findAllCategories,
    findCategoryByUUID,
    updateCategory,
    deleteCategory,
} = require('../service/category.service');


// ایجاد دسته‌بندی
const create = async (req, res) => {
    try {
        const category = await createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: 'دسته‌بندی با موفقیت ایجاد شد',
            category,
        });
    } catch (error) {
        console.error('Create category error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ایجاد دسته‌بندی',
        });
    }
};


// دریافت تمام دسته‌بندی‌ها
const getAll = async (req, res) => {
    try {
        const categories = await findAllCategories();

        return res.status(200).json({
            success: true,
            message: 'لیست دسته‌بندی‌ها با موفقیت دریافت شد',
            categories,
        });
    } catch (error) {
        console.error('Get all categories error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت دسته‌بندی‌ها',
        });
    }
};


// دریافت یک دسته‌بندی
const getSingle = async (req, res) => {
    const { category_uuid } = req.params;

    try {
        const category = await findCategoryByUUID(category_uuid);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'دسته‌بندی موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'دسته‌بندی با موفقیت دریافت شد',
            category,
        });
    } catch (error) {
        console.error('Get single category error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت دسته‌بندی',
        });
    }
};


// ویرایش دسته‌بندی
const update = async (req, res) => {
    const { category_uuid } = req.params;

    try {
        const category = await findCategoryByUUID(category_uuid);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'دسته‌بندی موردنظر پیدا نشد',
            });
        }

        await updateCategory(category_uuid, req.body);

        const updatedCategory = await findCategoryByUUID(category_uuid);

        return res.status(200).json({
            success: true,
            message: 'دسته‌بندی با موفقیت ویرایش شد',
            category: updatedCategory,
        });
    } catch (error) {
        console.error('Update category error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ویرایش دسته‌بندی',
        });
    }
};


// حذف دسته‌بندی
const del = async (req, res) => {
    const { category_uuid } = req.params;

    try {
        const deleted = await deleteCategory(category_uuid);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'دسته‌بندی موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'دسته‌بندی با موفقیت حذف شد',
        });
    } catch (error) {
        console.error('Delete category error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در حذف دسته‌بندی',
        });
    }
};


module.exports = {
    create,
    getAll,
    getSingle,
    update,
    del,
};