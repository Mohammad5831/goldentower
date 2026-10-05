const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const Cart = require('./Cart.model');

const Product = require('./Product.model');

const CartItem = sequelize.define('CartItem', {

    cart_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    cart_item_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: Cart,
            key: 'cart_id',
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

        onDelete: 'CASCADE',
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

    color: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

}, {

    timestamps: true,

});

module.exports = CartItem;