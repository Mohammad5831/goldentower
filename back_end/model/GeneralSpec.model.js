const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');
const Product = require('./Product.model');

const GeneralSpec = sequelize.define('GeneralSpec', {
    generalSpec_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order: {
        type: DataTypes.INTEGER,
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'product_id',
        },
    },
}, {
    timestamps: true,
});

module.exports = GeneralSpec;