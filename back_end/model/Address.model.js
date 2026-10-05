const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');
const User = require('./User.model');

const Address = sequelize.define('Address', {
    address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    address_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: User,
            key: 'user_id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    receiver_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },

    receiver_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },

    province: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },

    plaque: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },

    unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },

    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

}, {
    timestamps: true,

    indexes: [
        {
            fields: ['user_id'],
        },
        {
            fields: ['user_id', 'is_default'],
        },
    ],
});

module.exports = Address;