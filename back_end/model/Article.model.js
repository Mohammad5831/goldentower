const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Article = sequelize.define('Article', {

    // ========================================
    // Primary Key
    // ========================================

    article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    article_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },


    // ========================================
    // Basic Info
    // ========================================

    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

    category: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    main_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },


    // ========================================
    // Meta
    // ========================================

    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    reading_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        },
    },

    author: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },


    // ========================================
    // Short Description
    // ========================================

    excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
    },


    // ========================================
    // Article Content
    // ========================================

    content: {
        type: DataTypes.JSON,
        allowNull: false,
    },


    // ========================================
    // Status
    // ========================================

    status: {
        type: DataTypes.ENUM(
            'draft',
            'published'
        ),
        allowNull: false,
        defaultValue: 'draft',
    },

}, {
    timestamps: true,

    indexes: [
        {
            fields: ['status'],
        },
        {
            fields: ['date'],
        },
        {
            fields: ['category'],
        },
    ],
});

module.exports = Article;