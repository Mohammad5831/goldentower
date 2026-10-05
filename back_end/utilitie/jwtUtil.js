const jwt = require('jsonwebtoken');

require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        {
            user_uuid: user.user_uuid,
            is_admin: user.is_admin,
            is_guest: false,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

const generateGuestToken = (guest_uuid) => {
    return jwt.sign(
        {
            guest_uuid,
            is_guest: true,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

module.exports = {
    generateToken,
    generateGuestToken,
};