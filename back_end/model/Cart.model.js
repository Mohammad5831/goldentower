const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const User = require('./User.model');

const Cart = sequelize.define('Cart', {

    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    cart_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,

        references: {
            model: User,
            key: 'user_id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

}, {
    timestamps: true,
});

module.exports = Cart;