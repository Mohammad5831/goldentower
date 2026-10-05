const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Order = require('./Order.model');

const Payment = sequelize.define('Payment', {

    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    payment_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: Order,
            key: 'order_id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

    method: {
        type: DataTypes.ENUM(
            'online',
            'creditCard',
            'cash'
        ),
        allowNull: false,
        defaultValue: 'online',
    },

    status: {
        type: DataTypes.ENUM(
            'pending',
            'paid',
            'failed',
            'cancelled',
            'refunded'
        ),
        allowNull: false,
        defaultValue: 'pending',
    },

    authority: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
    },

    ref_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    card_pan: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },

    fee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

}, {
    timestamps: true,
});

module.exports = Payment;