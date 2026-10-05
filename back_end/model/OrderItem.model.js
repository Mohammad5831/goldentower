const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Product = require('./Product.model');
const Order = require('./Order.model');

const OrderItem = sequelize.define('OrderItem', {

    order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    order_item_uuid: {
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

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: Product,
            key: 'product_id',
        },

        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,

        validate: {
            min: 1,
        },
    },

    unit_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

    total_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

}, {
    timestamps: true,

    indexes: [
        {
            unique: true,
            fields: ['order_id', 'product_id'],
        },
    ],
});

module.exports = OrderItem;