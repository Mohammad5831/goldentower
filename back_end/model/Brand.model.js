const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Brand = sequelize.define('Brand', {

    brand_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    brand_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

}, {
    timestamps: true,
});

module.exports = Brand;