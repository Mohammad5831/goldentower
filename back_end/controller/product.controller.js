const {
    createdProduct,
    findProductByUUID,
    updatedProduct,
    findAllProduct,
    createdDetailedSpec,
    createdGeneralSpec,
    findAllProductsByBrand,
    findSingelProduct,
    findAllOffers,
} = require('../service/product.service');


// ========================================
// Product
// ========================================

const create = async (req, res) => {

    const image = req.file?.filename || null;

    try {

        const product = await createdProduct(
            req.body,
            image
        );

        return res.status(201).json({
            success: true,
            message: 'محصول با موفقیت ایجاد شد',
            product,
        });

    } catch (error) {

        console.error('Create product error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ایجاد محصول',
        });
    }
};


const update = async (req, res) => {

    const { product_uuid } = req.params;

    const image = req.file?.filename;

    try {

        const product = await findSingelProduct(product_uuid);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        const updatedRows = await updatedProduct(
            product_uuid,
            req.body,
            image
        );

        if (!updatedRows) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        const newProduct = await findProductByUUID(
            product_uuid
        );

        return res.status(200).json({
            success: true,
            message: 'اطلاعات محصول با موفقیت ویرایش شد',
            product: newProduct,
        });

    } catch (error) {

        console.error('Update product error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ویرایش اطلاعات محصول',
        });
    }
};


const del = async (req, res) => {

    const { product_uuid } = req.params;

    try {

        const product = await findSingelProduct(
            product_uuid
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        await product.destroy();

        return res.status(200).json({
            success: true,
            message: 'محصول موردنظر با موفقیت حذف شد',
        });

    } catch (error) {

        console.error('Delete product error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در حذف محصول',
        });
    }
};


// ========================================
// Get Product
// ========================================

const getSingel = async (req, res) => {

    const { product_uuid } = req.params;

    try {

        const product = await findProductByUUID(
            product_uuid
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'محصول موردنظر با موفقیت پیدا شد',
            product,
        });

    } catch (error) {

        console.error('Get single product error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در پیدا کردن محصول',
        });
    }
};


const getAll = async (req, res) => {

    try {

        const products = await findAllProduct();

        return res.status(200).json({
            success: true,
            message: 'لیست محصولات با موفقیت دریافت شد',
            products,
        });

    } catch (error) {

        console.error('Get all products error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در پیدا کردن محصولات',
        });
    }
};


const getAllByBrand = async (req, res) => {

    const { brand_id } = req.params;

    try {

        const products = await findAllProductsByBrand(
            brand_id
        );

        return res.status(200).json({
            success: true,
            message: 'لیست محصولات با موفقیت دریافت شد',
            products,
        });

    } catch (error) {

        console.error('Get products by brand error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در پیدا کردن محصولات',
        });
    }
};


const getOffers = async (req, res) => {

    try {

        const offers = await findAllOffers();

        return res.status(200).json({
            success: true,
            message: 'لیست محصولات با موفقیت دریافت شد',
            offers,
        });

    } catch (error) {

        console.error('Get offers error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در پیدا کردن محصولات',
        });
    }
};


// ========================================
// Detailed Spec
// ========================================

const createDetailedSpec = async (req, res) => {

    const { product_uuid } = req.params;

    const {
        group_name,
        label,
        value,
        order,
    } = req.body;

    try {

        const product = await findSingelProduct(
            product_uuid
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        const detailedSpec = await createdDetailedSpec(
            product.product_id,
            group_name,
            label,
            value,
            order
        );

        return res.status(201).json({
            success: true,
            message: 'مشخصات محصول با موفقیت اضافه شد',
            detailedSpec,
        });

    } catch (error) {

        console.error(
            'Create detailed spec error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'خطا در اضافه کردن مشخصات محصول',
        });
    }
};


// ========================================
// General Spec
// ========================================

const createGeneralSpec = async (req, res) => {

    const { product_uuid } = req.params;

    const {
        label,
        value,
        order,
    } = req.body;

    try {

        const product = await findSingelProduct(
            product_uuid
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        const generalSpec = await createdGeneralSpec(
            product.product_id,
            label,
            value,
            order
        );

        return res.status(201).json({
            success: true,
            message: 'مشخصات محصول با موفقیت اضافه شد',
            generalSpec,
        });

    } catch (error) {

        console.error(
            'Create general spec error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'خطا در اضافه کردن مشخصات محصول',
        });
    }
};


// ========================================
// Export
// ========================================

module.exports = {

    create,
    update,
    del,

    getSingel,
    getAll,
    getAllByBrand,
    getOffers,

    createDetailedSpec,
    createGeneralSpec,
};