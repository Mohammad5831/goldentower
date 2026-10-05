const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const User = sequelize.define('User', {

    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

    last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },

    email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true,
    },

    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    status: {
        type: DataTypes.ENUM(
            'active',
            'inactive',
            'blocked'
        ),
        allowNull: false,
        defaultValue: 'active',
    },

}, {
    timestamps: true,
});

module.exports = User;