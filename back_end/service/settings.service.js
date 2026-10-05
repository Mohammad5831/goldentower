const { Settings } = require('../model');


// ========================================
// Get Settings
// ========================================

const getSettings = async () => {

    return await Settings.findOne({
        attributes: {
            exclude: ['setting_id'],
        },
    });
};


// ========================================
// Create Settings
// ========================================

const createSettings = async (data) => {

    return await Settings.create(data);
};


// ========================================
// Update Settings
// ========================================

const updateSettings = async (data) => {

    let settings = await Settings.findOne();

    if (!settings) {
        settings = await createSettings(data);
        return settings;
    }

    await settings.update(data);

    return settings;
};


module.exports = {
    getSettings,
    createSettings,
    updateSettings,
};