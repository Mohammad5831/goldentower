const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Category = require('./Category.model');
const Brand = require('./Brand.model');

const Product = sequelize.define('Product', {

    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    product_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

    model: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

    current_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

    original_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },

    discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,

        validate: {
            min: 0,
        },
    },

    offer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    size: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'category_id',
        },
    },

    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Brand,
            key: 'brand_id',
        },
    },

}, {
    timestamps: true,
});

module.exports = Product;