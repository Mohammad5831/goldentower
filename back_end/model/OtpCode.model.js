const { DataTypes } = require('sequelize');

const sequelize = require('../config/database.config');

const OtpCode = sequelize.define('OtpCode', {

    phone_number: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
    },

    otp: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = OtpCode;