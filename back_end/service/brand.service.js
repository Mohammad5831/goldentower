const { Brand, Product, sequelize } = require('../model');


// ایجاد برند
const createBrand = async (data, image = null) => {
    const {
        title,
        name,
    } = data;

    const brand = await Brand.create({
        title,
        name,
        image,
    });

    const result = brand.toJSON();

    delete result.brand_id;

    return result;
};


// دریافت تمام برندها
const findAllBrands = async () => {
    const brands = await Brand.findAll({
        attributes: [
            'brand_uuid',
            'title',
            'name',
            'image',
            'createdAt',
            'updatedAt',
            [
                sequelize.fn(
                    'COUNT',
                    sequelize.col('Products.product_id')
                ),
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
        group: ['Brand.brand_id'],
        order: [['createdAt', 'DESC']],
    });

    return brands;
};


// دریافت یک برند
const findBrandByUUID = async (brand_uuid) => {
    const brand = await Brand.findOne({
        where: { brand_uuid },
        attributes: {
            exclude: ['brand_id'],
        },
    });

    return brand;
};


// ویرایش برند
const updateBrand = async (brand_uuid, data, image) => {
    const {
        title,
        name,
    } = data;

    const updateData = {
        title,
        name,
    };

    if (image !== undefined) {
        updateData.image = image;
    }

    const [updatedRows] = await Brand.update(
        updateData,
        {
            where: { brand_uuid },
        }
    );

    return updatedRows;
};


// حذف برند
const deleteBrand = async (brand_uuid) => {
    const brand = await Brand.findOne({
        where: { brand_uuid },
    });

    if (!brand) {
        return null;
    }

    await brand.destroy();

    return true;
};


module.exports = {
    createBrand,
    findAllBrands,
    findBrandByUUID,
    updateBrand,
    deleteBrand,
};