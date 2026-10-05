const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    category_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },

}, {
    timestamps: true,
});

module.exports = Category;