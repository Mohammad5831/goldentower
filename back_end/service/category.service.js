const { Category, Product, sequelize } = require('../model');


// ایجاد دسته‌بندی
const createCategory = async (data) => {
    const { name, description, status } = data;

    const category = await Category.create({
        name,
        description,
        status,
    });

    const result = category.toJSON();

    delete result.category_id;

    return result;
};


// دریافت تمام دسته‌بندی‌ها
const findAllCategories = async () => {
    const categories = await Category.findAll({
        attributes: [
            'category_uuid',
            'name',
            'description',
            'status',
            'createdAt',
            'updatedAt',
            [
                sequelize.fn('COUNT', sequelize.col('Products.product_id')),
                'product_count',
            ],
        ],
        include: [
            {
                model: Product,
                attributes: [],
                required: false,
            },
        ],
        group: ['Category.category_id'],
        order: [['createdAt', 'DESC']],
    });

    return categories;
};


// دریافت یک دسته‌بندی
const findCategoryByUUID = async (category_uuid) => {
    const category = await Category.findOne({
        where: { category_uuid },
        attributes: {
            exclude: ['category_id'],
        },
    });

    return category;
};


// ویرایش دسته‌بندی
const updateCategory = async (category_uuid, data) => {
    const { name, description, status } = data;

    const [updatedRows] = await Category.update(
        {
            name,
            description,
            status,
        },
        {
            where: { category_uuid },
        }
    );

    return updatedRows;
};


// حذف دسته‌بندی
const deleteCategory = async (category_uuid) => {
    const category = await Category.findOne({
        where: { category_uuid },
    });

    if (!category) {
        return null;
    }

    await category.destroy();

    return true;
};


module.exports = {
    createCategory,
    findAllCategories,
    findCategoryByUUID,
    updateCategory,
    deleteCategory,
};