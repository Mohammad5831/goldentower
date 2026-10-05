const { OtpCode } = require('../model');


//////////////////////////////////////////////////////
// SET OTP
//////////////////////////////////////////////////////

const setOtp = async (phone_number, otp) => {

    // اگر برای این شماره OTP قبلی وجود دارد،
    // آن را حذف می‌کنیم.
    await OtpCode.destroy({
        where: {
            phone_number,
        },
    });

    // OTP جدید
    const expires_at = new Date(
        Date.now() + 5 * 60 * 1000
    );

    const data = await OtpCode.create({
        phone_number,
        otp,
        expires_at,
    });

    return data;
};


//////////////////////////////////////////////////////
// GET OTP
//////////////////////////////////////////////////////

const getOtp = async (phone_number) => {

    const data = await OtpCode.findOne({
        where: {
            phone_number,
        },
    });

    return data;
};


//////////////////////////////////////////////////////
// DELETE OTP
//////////////////////////////////////////////////////

const deleteOtp = async (phone_number) => {

    const deletedRows = await OtpCode.destroy({
        where: {
            phone_number,
        },
    });

    return deletedRows > 0;
};


//////////////////////////////////////////////////////
// VERIFY OTP
//////////////////////////////////////////////////////

const verifyOtp = async (phone_number, otp) => {

    const data = await OtpCode.findOne({
        where: {
            phone_number,
        },
    });

    // OTP وجود ندارد
    if (!data) {
        return {
            success: false,
            reason: 'OTP_NOT_FOUND',
        };
    }

    // OTP منقضی شده
    if (new Date() > new Date(data.expires_at)) {

        await data.destroy();

        return {
            success: false,
            reason: 'OTP_EXPIRED',
        };
    }

    // OTP اشتباه است
    if (data.otp !== otp) {

        return {
            success: false,
            reason: 'INVALID_OTP',
        };
    }

    // OTP صحیح است → حذف شود
    await data.destroy();

    return {
        success: true,
    };
};


module.exports = {
    setOtp,
    getOtp,
    deleteOtp,
    verifyOtp,
};