const axios = require('axios');

const {
    exsitingUserByUUID,
} = require('../service/user.service');

const {
    findCart,
    createdCart,
    findCartItemByCartId,
} = require('../service/cart.service');

const {
    createOrderWithPayment,
    findOrderByUUID,
    findPaymentByAuthority,
    completePayment,
} = require('../service/payment.service');

const {
    calculateTotalPrice,
} = require('../utilitie/totalPriceService');


// ========================================
// Payment Request
// ========================================

const paymentRequest = async (req, res) => {
    const user_uuid = req.user?.user_uuid;
    const { address_uuid } = req.body;

    try {

        // ----------------------------------------
        // Find User
        // ----------------------------------------

        const user = await exsitingUserByUUID(user_uuid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربری موردنظر پیدا نشد',
            });
        }


        // ----------------------------------------
        // Find Cart
        // ----------------------------------------

        let cart = await findCart(user_uuid);

        if (!cart) {
            cart = await createdCart(user_uuid);
        }

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'سبد خرید پیدا نشد',
            });
        }


        // ----------------------------------------
        // Get Cart Items
        // ----------------------------------------

        const cartItems = await findCartItemByCartId(
            cart.cart_id
        );

        if (!cartItems.length) {
            return res.status(400).json({
                success: false,
                message: 'سبد خرید خالی است',
            });
        }


        // ----------------------------------------
        // Calculate Total
        // ----------------------------------------

        const calculate = await calculateTotalPrice(
            cartItems
        );

        const totalPrice = Number(
            calculate.totalPrice
        );

        if (
            !Number.isFinite(totalPrice) ||
            totalPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'مبلغ پرداخت معتبر نیست',
            });
        }


        // ----------------------------------------
        // Create Order + Order Items + Payment
        // ----------------------------------------

        const result = await createOrderWithPayment(
            user_uuid,
            address_uuid,
            cartItems,
            totalPrice,
            'online'
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'خطا در ایجاد سفارش',
            });
        }

        const {
            order,
            payment,
        } = result;


        // ----------------------------------------
        // Request Payment From Zarinpal
        // ----------------------------------------

        const response = await axios.post(
            'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
            {
                merchant_id: process.env.MERCHANT_ID,

                amount: Math.round(
                    totalPrice * 10
                ),

                callback_url:
                    `${process.env.CALLBACK_URL}/?order_uuid=${order.order_uuid}`,

                description:
                    `Payment for order ${order.order_uuid}`,
            }
        );


        // ----------------------------------------
        // Validate Zarinpal Response
        // ----------------------------------------

        const data = response.data?.data;

        if (
            !data ||
            data.code !== 100 ||
            !data.authority
        ) {

            await payment.update({
                status: 'failed',
            });

            await order.update({
                order_status: 'cancelled',
            });

            return res.status(502).json({
                success: false,
                message: 'خطا در ایجاد درخواست پرداخت',
            });
        }


        // ----------------------------------------
        // Save Authority
        // ----------------------------------------

        await payment.update({
            authority: data.authority,
        });


        // ----------------------------------------
        // Response
        // ----------------------------------------

        return res.status(200).json({
            success: true,
            message: 'درخواست پرداخت با موفقیت ایجاد شد',

            order_uuid: order.order_uuid,

            payment_uuid: payment.payment_uuid,

            url:
                `https://sandbox.zarinpal.com/pg/StartPay/${data.authority}`,
        });

    } catch (error) {

        console.error(
            'Payment request error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'خطا در پردازش پرداخت',
        });
    }
};


// ========================================
// Payment Verify
// ========================================

const verifyPayment = async (req, res) => {

    const user_uuid = req.user?.user_uuid;

    const {
        order_uuid,
        Authority,
        Status,
    } = req.body;


    // ----------------------------------------
    // Payment Cancelled By User
    // ----------------------------------------

    if (Status !== 'OK') {

        return res.status(400).json({
            success: false,
            message: 'پرداخت توسط کاربر لغو شد',
        });
    }


    try {

        // ----------------------------------------
        // Find User
        // ----------------------------------------

        const user = await exsitingUserByUUID(
            user_uuid
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: 'کاربری موردنظر پیدا نشد',
            });
        }


        // ----------------------------------------
        // Find Order
        // ----------------------------------------

        const order = await findOrderByUUID(
            order_uuid,
            user_uuid
        );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: 'سفارش پیدا نشد',
            });
        }


        // ----------------------------------------
        // Already Paid
        // ----------------------------------------

        if (order.payment_status === 'paid') {

            return res.status(400).json({
                success: false,
                message: 'این سفارش قبلاً پرداخت شده است',
            });
        }


        // ----------------------------------------
        // Find Payment
        // ----------------------------------------

        const payment = await findPaymentByAuthority(
            order.order_id,
            Authority
        );

        if (!payment) {

            return res.status(404).json({
                success: false,
                message: 'تراکنش پرداخت پیدا نشد',
            });
        }


        // ----------------------------------------
        // Verify With Zarinpal
        // ----------------------------------------

        const response = await axios.post(
            'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
            {
                merchant_id:
                    process.env.MERCHANT_ID,

                authority:
                    Authority,

                amount:
                    Math.round(
                        Number(order.total_amount) * 10
                    ),
            }
        );


        const data = response.data?.data;


        // ----------------------------------------
        // Invalid Gateway Response
        // ----------------------------------------

        if (!data) {

            return res.status(502).json({
                success: false,
                message: 'پاسخ نامعتبر از درگاه پرداخت',
            });
        }


        // ----------------------------------------
        // Payment Failed
        // ----------------------------------------

        if (
            data.code !== 100 &&
            data.code !== 101
        ) {

            await payment.update({
                status: 'failed',
            });

            await order.update({
                order_status: 'cancelled',
            });

            return res.status(400).json({
                success: false,
                message: 'تأیید پرداخت ناموفق بود',
            });
        }


        // ----------------------------------------
        // Find Current Cart
        // ----------------------------------------

        const cart = await findCart(user_uuid);


        // ----------------------------------------
        // Complete Payment
        // ----------------------------------------

        await completePayment(
            payment,
            order,
            Authority,
            data.ref_id,
            data.card_pan,
            data.fee,
            cart?.cart_id || null
        );


        // ----------------------------------------
        // Success
        // ----------------------------------------

        return res.status(200).json({
            success: true,
            message: 'پرداخت با موفقیت انجام شد',

            order_uuid:
                order.order_uuid,

            payment_uuid:
                payment.payment_uuid,

            ref_id:
                data.ref_id,

            total_price:
                order.total_amount,
        });

    } catch (error) {

        console.error(
            'Payment verification error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'خطا در بررسی پرداخت',
        });
    }
};


module.exports = {
    paymentRequest,
    verifyPayment,
};