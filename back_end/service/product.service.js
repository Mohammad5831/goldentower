const {
    Product,
    Category,
    Brand,
    DetailedSpec,
    GeneralSpec,
} = require('../model');


// ========================================
// Product
// ========================================

const createdProduct = async (body, image = null) => {
    const {
        name,
        brand_id,
        model,
        original_price,
        discount,
        description,
        stock,
        size,
        category_id,
        offer,
    } = body;

    const current_price =
        original_price - (
            original_price * (discount || 0) / 100
        );

    const product = await Product.create({
        name,
        brand_id,
        model,
        original_price,
        discount,
        current_price,
        description,
        stock,
        size,
        image,
        category_id,
        offer,
    });

    const result = product.toJSON();

    delete result.product_id;
    delete result.category_id;
    delete result.brand_id;

    return result;
};


// ========================================
// Update Product
// ========================================

const updatedProduct = async (product_uuid, body, image) => {
    const {
        name,
        brand_id,
        model,
        original_price,
        discount,
        description,
        stock,
        size,
        category_id,
        offer,
    } = body;

    const updateData = {
        name,
        brand_id,
        model,
        original_price,
        discount,
        description,
        stock,
        size,
        category_id,
        offer,
    };

    /*
     * اگر original_price یا discount ارسال شده باشد،
     * قیمت فعلی دوباره در Backend محاسبه می‌شود.
     */
    if (
        original_price !== undefined ||
        discount !== undefined
    ) {
        const product = await Product.findOne({
            where: {
                product_uuid,
            },
        });

        if (!product) {
            return null;
        }

        const finalOriginalPrice =
            original_price !== undefined
                ? Number(original_price)
                : Number(product.original_price);

        const finalDiscount =
            discount !== undefined
                ? Number(discount || 0)
                : Number(product.discount || 0);

        updateData.current_price =
            finalOriginalPrice -
            (
                finalOriginalPrice *
                finalDiscount /
                100
            );
    }

    if (image !== undefined) {
        updateData.image = image;
    }

    const [updatedRows] = await Product.update(
        updateData,
        {
            where: {
                product_uuid,
            },
        }
    );

    return updatedRows;
};


// ========================================
// Find Single Product - Internal
// ========================================

const findSingelProduct = async (product_uuid) => {
    const product = await Product.findOne({
        where: {
            product_uuid,
        },
    });

    return product;
};


// ========================================
// Find Product By UUID
// ========================================

const findProductByUUID = async (product_uuid) => {
    const product = await Product.findOne({
        where: {
            product_uuid,
        },

        attributes: {
            exclude: [
                'product_id',
                'category_id',
                'brand_id',
            ],
        },

        include: [
            {
                model: Category,

                attributes: [
                    'category_uuid',
                    'name',
                ],
            },

            {
                model: Brand,

                attributes: [
                    'brand_uuid',
                    'name',
                    'title',
                    'image',
                ],
            },

            {
                model: DetailedSpec,

                attributes: [
                    'group_name',
                    'label',
                    'value',
                    'order',
                ],
            },

            {
                model: GeneralSpec,

                attributes: [
                    'label',
                    'value',
                    'order',
                ],
            },
        ],
    });

    return product;
};


// ========================================
// Find All Products
// ========================================

const findAllProduct = async () => {
    const products = await Product.findAll({
        attributes: {
            exclude: [
                'product_id',
                'category_id',
                'brand_id',
            ],
        },

        include: [
            {
                model: Category,

                attributes: [
                    'category_uuid',
                    'name',
                ],
            },

            {
                model: Brand,

                attributes: [
                    'brand_uuid',
                    'name',
                    'title',
                    'image',
                ],
            },
        ],

        order: [
            ['createdAt', 'DESC'],
        ],
    });

    return products;
};


// ========================================
// Find & Count Products
// ========================================

const findAndCountAllProducts = async (
    limit,
    offset,
    brand_id,
    category_id
) => {
    const where = {};

    if (brand_id) {
        where.brand_id = brand_id;
    }

    if (category_id) {
        where.category_id = category_id;
    }

    const {
        count,
        rows,
    } = await Product.findAndCountAll({
        limit,
        offset,
        where,

        attributes: {
            exclude: [
                'product_id',
                'category_id',
                'brand_id',
            ],
        },

        include: [
            {
                model: Category,

                attributes: [
                    'category_uuid',
                    'name',
                ],
            },

            {
                model: Brand,

                attributes: [
                    'brand_uuid',
                    'name',
                    'title',
                    'image',
                ],
            },
        ],

        order: [
            ['createdAt', 'DESC'],
        ],
    });

    const totalPages = limit
        ? Math.ceil(count / limit)
        : 1;

    return {
        count,
        rows,
        totalPages,
    };
};


// ========================================
// Find Products By Brand
// ========================================

const findAllProductsByBrand = async (brand_id) => {
    const products = await Product.findAll({
        where: {
            brand_id,
        },

        attributes: {
            exclude: [
                'product_id',
                'category_id',
                'brand_id',
            ],
        },

        include: [
            {
                model: Category,

                attributes: [
                    'category_uuid',
                    'name',
                ],
            },

            {
                model: Brand,

                attributes: [
                    'brand_uuid',
                    'name',
                    'title',
                    'image',
                ],
            },
        ],

        order: [
            ['createdAt', 'DESC'],
        ],
    });

    return products;
};


// ========================================
// Offers
// ========================================

const findAllOffers = async () => {
    const offers = await Product.findAll({
        where: {
            offer: true,
        },

        attributes: [
            'product_uuid',
            'name',
            'image',
            'original_price',
            'current_price',
            'discount',
        ],

        include: [
            {
                model: Brand,

                attributes: [
                    'brand_uuid',
                    'name',
                    'title',
                ],
            },
        ],

        order: [
            ['createdAt', 'DESC'],
        ],
    });

    return offers;
};


// ========================================
// General Spec
// ========================================

const createdGeneralSpec = async (
    product_id,
    label,
    value,
    order
) => {
    const response = await GeneralSpec.create({
        product_id,
        label,
        value,
        order,
    });

    const generalSpec = response.toJSON();

    delete generalSpec.generalSpec_id;
    delete generalSpec.product_id;

    return generalSpec;
};


// ========================================
// Detailed Spec
// ========================================

const createdDetailedSpec = async (
    product_id,
    group_name,
    label,
    value,
    order
) => {
    const response = await DetailedSpec.create({
        product_id,
        group_name,
        label,
        value,
        order,
    });

    const detailedSpec = response.toJSON();

    delete detailedSpec.detailedSpec_id;
    delete detailedSpec.product_id;

    return detailedSpec;
};


// ========================================
// Export
// ========================================

module.exports = {
    createdProduct,
    updatedProduct,

    findSingelProduct,
    findProductByUUID,
    findAllProduct,
    findAndCountAllProducts,
    findAllProductsByBrand,
    findAllOffers,

    createdDetailedSpec,
    createdGeneralSpec,
};