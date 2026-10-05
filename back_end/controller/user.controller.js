const { v4: uuidv4 } = require('uuid');

const {
    existingUserByPhoneNumber,
    createUser,
    existingUserByUUID,
    findAllOrders,
    findAllUsers,
} = require('../service/user.service');

const {
    setOtp,
    verifyOtp,
} = require('../service/otpCode.service');

const {
    generateToken,
    generateGuestToken,
} = require('../utilitie/jwtUtil');

const {
    sendOtpToPhone,
} = require('../utilitie/otpUtil');


//////////////////////////////////////////////////////
// REQUEST OTP
//////////////////////////////////////////////////////

const requestOtp = async (req, res) => {

    const { phone_number } = req.body;

    try {

        if (!phone_number) {
            return res.status(400).json({
                success: false,
                message: 'شماره تلفن الزامی است',
            });
        }

        let user = await existingUserByPhoneNumber(phone_number);

        // اگر کاربر وجود ندارد، ایجاد شود
        if (!user) {
            user = await createUser(phone_number, false);
        }

        // کاربر Block شده اجازه ورود ندارد
        if (user.status === 'blocked') {
            return res.status(403).json({
                success: false,
                message: 'حساب کاربری شما مسدود شده است',
            });
        }

        const otp = await sendOtpToPhone(phone_number);

        await setOtp(phone_number, otp);

        return res.status(200).json({
            success: true,
            message: 'کد تایید با موفقیت ارسال شد',
        });

    } catch (error) {

        console.error('Request OTP Error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ارسال کد تایید',
        });
    }
};


//////////////////////////////////////////////////////
// VERIFY OTP
//////////////////////////////////////////////////////

const verifyOtpLogin = async (req, res) => {

    const { phone_number, otp } = req.body;

    try {

        if (!phone_number || !otp) {
            return res.status(400).json({
                success: false,
                message: 'شماره تلفن و کد تایید الزامی هستند',
            });
        }

        const user = await existingUserByPhoneNumber(phone_number);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربر پیدا نشد',
            });
        }

        // بررسی وضعیت کاربر قبل از ورود
        if (user.status === 'blocked') {
            return res.status(403).json({
                success: false,
                message: 'حساب کاربری شما مسدود شده است',
            });
        }

        const result = await verifyOtp(phone_number, otp);

        if (!result.success) {

            if (result.reason === 'OTP_EXPIRED') {
                return res.status(400).json({
                    success: false,
                    message: 'کد تایید منقضی شده است',
                });
            }

            if (result.reason === 'OTP_NOT_FOUND') {
                return res.status(400).json({
                    success: false,
                    message: 'کد تایید پیدا نشد یا منقضی شده است',
                });
            }

            return res.status(400).json({
                success: false,
                message: 'کد تایید نادرست است',
            });
        }

        const token = await generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'ورود با موفقیت انجام شد',

            token,

            user: {
                user_uuid: user.user_uuid,
                is_admin: user.is_admin,
                is_guest: false,
            },
        });

    } catch (error) {

        console.error('Verify OTP Error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ورود',
        });
    }
};


//////////////////////////////////////////////////////
// GUEST LOGIN
//////////////////////////////////////////////////////

const userGuest = async (req, res) => {

    try {

        const guest_uuid = uuidv4();

        const token = await generateGuestToken(guest_uuid);

        return res.status(200).json({
            success: true,
            message: 'ورود کاربر مهمان با موفقیت انجام شد',

            token,

            user: {
                guest_uuid,
                is_admin: false,
                is_guest: true,
            },
        });

    } catch (error) {

        console.error('Guest Login Error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ورود کاربر مهمان',
        });
    }
};


//////////////////////////////////////////////////////
// GET USER ORDERS
//////////////////////////////////////////////////////

const getOrders = async (req, res) => {

    const user_uuid = req.user?.user_uuid;

    try {

        if (!user_uuid) {
            return res.status(401).json({
                success: false,
                message: 'احراز هویت انجام نشده است',
            });
        }

        const user = await existingUserByUUID(user_uuid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربر موردنظر پیدا نشد',
            });
        }

        const orders = await findAllOrders(user.user_id);

        return res.status(200).json({
            success: true,
            message: 'لیست سفارشات با موفقیت دریافت شد',
            orders,
        });

    } catch (error) {

        console.error('Get Orders Error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت لیست سفارشات',
        });
    }
};


//////////////////////////////////////////////////////
// GET ALL USERS - ADMIN
//////////////////////////////////////////////////////

const getAllUsers = async (req, res) => {

    try {

        const users = await findAllUsers();

        return res.status(200).json({
            success: true,
            message: 'لیست کاربران با موفقیت دریافت شد',
            users,
        });

    } catch (error) {

        console.error('Get All Users Error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت لیست کاربران',
        });
    }
};


module.exports = {

    requestOtp,
    verifyOtpLogin,

    userGuest,

    getOrders,
    getAllUsers,
};