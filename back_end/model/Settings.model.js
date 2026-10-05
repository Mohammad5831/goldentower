const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Settings = sequelize.define('Settings', {

    setting_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    setting_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },


    // ========================================
    // General
    // ========================================

    site_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: 'Golden Tower',
    },

    site_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

    site_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },


    // ========================================
    // Contact
    // ========================================

    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },


    // ========================================
    // Social
    // ========================================

    instagram: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    telegram: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    whatsapp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },


    // ========================================
    // Store
    // ========================================

    store_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    allow_registration: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    allow_guest_purchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },


    // ========================================
    // Shipping
    // ========================================

    shipping_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    shipping_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

    free_shipping_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    free_shipping_minimum: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },


    // ========================================
    // Payment
    // ========================================

    online_payment_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

    cash_on_delivery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },


    // ========================================
    // SEO
    // ========================================

    meta_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    meta_keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
    },


    // ========================================
    // Language
    // ========================================

    language: {
        type: DataTypes.ENUM(
            'fa',
            'en'
        ),
        allowNull: false,
        defaultValue: 'fa',
    },


    // ========================================
    // Home Banner
    // ========================================

    home_banner: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    home_banner_alt: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    home_banner_link: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },

    home_banner_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },

}, {
    timestamps: true,
});

module.exports = Settings;