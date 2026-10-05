const {
    getSettings,
    createSettings,
    updateSettings,
} = require('../service/settings.service');


// ========================================
// Get Settings
// ========================================

const getAdminSettings = async (req, res) => {

    try {

        const settings = await getSettings();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'تنظیمات فروشگاه پیدا نشد',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'تنظیمات با موفقیت دریافت شد',
            settings,
        });

    } catch (error) {

        console.error('Get settings error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت تنظیمات',
        });
    }
};


// ========================================
// Create Settings
// ========================================

const addSettings = async (req, res) => {

    try {

        const existingSettings = await getSettings();

        if (existingSettings) {
            return res.status(409).json({
                success: false,
                message: 'تنظیمات فروشگاه قبلاً ایجاد شده است',
            });
        }

        const data = {
            ...req.body,
        };

        if (req.file) {
            data.home_banner = req.file.filename;
        }

        const settings = await createSettings(data);

        return res.status(201).json({
            success: true,
            message: 'تنظیمات با موفقیت ایجاد شد',
            settings,
        });

    } catch (error) {

        console.error('Create settings error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ایجاد تنظیمات',
        });
    }
};


// ========================================
// Update Settings
// ========================================

const editSettings = async (req, res) => {

    try {

        const data = {
            ...req.body,
        };

        if (req.file) {
            data.home_banner = req.file.filename;
        }

        const settings = await updateSettings(data);

        return res.status(200).json({
            success: true,
            message: 'تنظیمات با موفقیت بروزرسانی شد',
            settings,
        });

    } catch (error) {

        console.error('Update settings error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در بروزرسانی تنظیمات',
        });
    }
};


module.exports = {
    getAdminSettings,
    addSettings,
    editSettings,
};