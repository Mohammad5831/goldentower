const { validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        message: 'خطای اعتبارسنجی',
        errors: errors.array(),
    });
};

module.exports = {
    validationHandler,
};