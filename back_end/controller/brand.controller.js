const {
    createBrand,
    findAllBrands,
    findBrandByUUID,
    updateBrand,
    deleteBrand,
} = require('../service/brand.service');


// ایجاد برند
const create = async (req, res) => {
    const image = req.file?.filename || null;

    try {
        const brand = await createBrand(req.body, image);

        return res.status(201).json({
            success: true,
            message: 'برند با موفقیت ایجاد شد',
            brand,
        });
    } catch (error) {
        console.error('Create brand error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ایجاد برند',
        });
    }
};


// دریافت تمام برندها
const getAll = async (req, res) => {
    try {
        const brands = await findAllBrands();

        return res.status(200).json({
            success: true,
            message: 'لیست برندها با موفقیت دریافت شد',
            brands,
        });
    } catch (error) {
        console.error('Get all brands error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت برندها',
        });
    }
};


// دریافت یک برند
const getSingle = async (req, res) => {
    const { brand_uuid } = req.params;

    try {
        const brand = await findBrandByUUID(brand_uuid);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'برند موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'برند با موفقیت دریافت شد',
            brand,
        });
    } catch (error) {
        console.error('Get single brand error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت برند',
        });
    }
};


// ویرایش برند
const update = async (req, res) => {
    const { brand_uuid } = req.params;
    const image = req.file?.filename;

    try {
        const brand = await findBrandByUUID(brand_uuid);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'برند موردنظر پیدا نشد',
            });
        }

        await updateBrand(
            brand_uuid,
            req.body,
            image
        );

        const updatedBrand = await findBrandByUUID(brand_uuid);

        return res.status(200).json({
            success: true,
            message: 'برند با موفقیت ویرایش شد',
            brand: updatedBrand,
        });
    } catch (error) {
        console.error('Update brand error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ویرایش برند',
        });
    }
};


// حذف برند
const del = async (req, res) => {
    const { brand_uuid } = req.params;

    try {
        const deleted = await deleteBrand(brand_uuid);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'برند موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'برند با موفقیت حذف شد',
        });
    } catch (error) {
        console.error('Delete brand error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در حذف برند',
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