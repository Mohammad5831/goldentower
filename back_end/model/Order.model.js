const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const User = require('./User.model');
const Address = require('./Address.model');

const Order = sequelize.define('Order', {

    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    order_uuid: {
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

        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },

    // آدرس انتخاب‌شده توسط کاربر
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: Address,
            key: 'address_id',
        },

        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },

    // Snapshot اطلاعات گیرنده در زمان ثبت سفارش
    customer_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },

    customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },

    customer_email: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },

    // Snapshot آدرس
    province: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    customer_address: {
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

    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

    fee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

    order_status: {
        type: DataTypes.ENUM(
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
    },

    payment_status: {
        type: DataTypes.ENUM(
            'unpaid',
            'paid',
            'refunded'
        ),
        allowNull: false,
        defaultValue: 'unpaid',
    },

    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

}, {
    timestamps: true,
});

module.exports = Order;