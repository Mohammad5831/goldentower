const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');
const Product = require('./Product.model');

const DetailedSpec = sequelize.define('DetailedSpec', {
    detailedSpec_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    group_name: {
        type: DataTypes.STRING,
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

module.exports = DetailedSpec;