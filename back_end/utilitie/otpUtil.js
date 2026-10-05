const crypto = require('crypto');
const { Smsir } = require('smsir-js');

require('dotenv').config();

const apiKey = process.env.SMS_IR_API_KEY;
const lineNumber = 9830007732911042;

const sms = new Smsir(apiKey, lineNumber);

const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const sendSms = async (phoneNumber, code) => {
    try {
        const templateId = 798942;

        const parameters = [
            {
                name: 'OTPCODE',
                value: code,
            },
        ];

        await sms.SendVerifyCode(
            phoneNumber,
            templateId,
            parameters
        );

    } catch (error) {

        console.error(
            'ارسال پیامک با مشکل مواجه شد:',
            error.message
        );

        throw new Error('ارسال کد تایید با مشکل مواجه شد');
    }
};

const sendOtpToPhone = async (phoneNumber) => {

    const otp = generateOtp();

    await sendSms(phoneNumber, otp);

    return otp;
};

module.exports = {
    generateOtp,
    sendSms,
    sendOtpToPhone,
};