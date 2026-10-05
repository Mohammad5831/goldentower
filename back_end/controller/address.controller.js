const {
    findAddressByUUID,
    findUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require('../service/address.service');


// ========================================
// Get User Addresses
// ========================================

const getAddresses = async (req, res) => {

    const user_uuid = req.user.user_uuid;

    try {

        const addresses = await findUserAddresses(user_uuid);

        if (addresses === null) {
            return res.status(404).json({
                success: false,
                message: 'کاربر موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'آدرس‌ها با موفقیت دریافت شدند',
            addresses,
        });

    } catch (error) {

        console.error('Get addresses error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت آدرس‌ها',
        });
    }
};


// ========================================
// Get Address By UUID
// ========================================

const getAddress = async (req, res) => {

    const user_uuid = req.user.user_uuid;
    const { address_uuid } = req.params;

    try {

        const address = await findAddressByUUID(
            address_uuid,
            user_uuid
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'آدرس موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'آدرس با موفقیت دریافت شد',
            address,
        });

    } catch (error) {

        console.error('Get address error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت آدرس',
        });
    }
};


// ========================================
// Create Address
// ========================================

const addAddress = async (req, res) => {

    const user_uuid = req.user.user_uuid;

    try {

        const address = await createAddress(
            user_uuid,
            req.body
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'کاربر موردنظر پیدا نشد',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'آدرس با موفقیت ایجاد شد',
            address: {
                address_uuid: address.address_uuid,
                title: address.title,
                receiver_name: address.receiver_name,
                receiver_phone: address.receiver_phone,
                province: address.province,
                city: address.city,
                address: address.address,
                postal_code: address.postal_code,
                plaque: address.plaque,
                unit: address.unit,
                is_default: address.is_default,
            },
        });

    } catch (error) {

        console.error('Create address error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ایجاد آدرس',
        });
    }
};


// ========================================
// Update Address
// ========================================

const editAddress = async (req, res) => {

    const user_uuid = req.user.user_uuid;
    const { address_uuid } = req.params;

    try {

        const address = await updateAddress(
            address_uuid,
            user_uuid,
            req.body
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'آدرس موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'آدرس با موفقیت ویرایش شد',
            address: {
                address_uuid: address.address_uuid,
                title: address.title,
                receiver_name: address.receiver_name,
                receiver_phone: address.receiver_phone,
                province: address.province,
                city: address.city,
                address: address.address,
                postal_code: address.postal_code,
                plaque: address.plaque,
                unit: address.unit,
                is_default: address.is_default,
            },
        });

    } catch (error) {

        console.error('Update address error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ویرایش آدرس',
        });
    }
};


// ========================================
// Delete Address
// ========================================

const removeAddress = async (req, res) => {

    const user_uuid = req.user.user_uuid;
    const { address_uuid } = req.params;

    try {

        const result = await deleteAddress(
            address_uuid,
            user_uuid
        );

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: 'آدرس موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'آدرس با موفقیت حذف شد',
        });

    } catch (error) {

        console.error('Delete address error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در حذف آدرس',
        });
    }
};


// ========================================
// Set Default Address
// ========================================

const makeDefaultAddress = async (req, res) => {

    const user_uuid = req.user.user_uuid;
    const { address_uuid } = req.params;

    try {

        const address = await setDefaultAddress(
            address_uuid,
            user_uuid
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'آدرس موردنظر پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'آدرس پیش‌فرض با موفقیت تغییر کرد',
            address: {
                address_uuid: address.address_uuid,
                title: address.title,
                is_default: address.is_default,
            },
        });

    } catch (error) {

        console.error('Set default address error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در تغییر آدرس پیش‌فرض',
        });
    }
};


module.exports = {
    getAddresses,
    getAddress,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
};