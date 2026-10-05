const jwt = require('jsonwebtoken');

require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authorization = req.header('Authorization');

    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: 'توکن ارائه نشده است',
        });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            message: 'فرمت توکن نامعتبر است',
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        return next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'توکن منقضی شده است',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'توکن نامعتبر است',
        });
    }
};

const requireUser = (req, res, next) => {

    if (req.user?.is_guest === true || !req.user?.user_uuid) {
        return res.status(403).json({
            success: false,
            message: 'این بخش فقط برای کاربران ثبت‌نام‌شده قابل دسترسی است',
        });
    }

    return next();
};

const requireAdmin = (req, res, next) => {

    if (
        req.user?.is_guest === true ||
        req.user?.is_admin !== true
    ) {
        return res.status(403).json({
            success: false,
            message: 'دسترسی غیرمجاز',
        });
    }

    return next();
};

module.exports = {
    verifyToken,
    requireUser,
    requireAdmin,
};