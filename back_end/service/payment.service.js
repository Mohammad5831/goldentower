const {
    User,
    Address,
    Order,
    OrderItem,
    Payment,
    Product,
} = require('../model');

const sequelize = require('../config/database.config');


// ========================================
// Find User By UUID
// ========================================

const findUserByUUID = async (user_uuid) => {

    return await User.findOne({
        where: {
            user_uuid,
        },
        attributes: [
            'user_id',
        ],
    });
};


// ========================================
// Find Address By UUID
// ========================================

const findAddressByUUID = async (
    address_uuid,
    user_id
) => {

    return await Address.findOne({
        where: {
            address_uuid,
            user_id,
        },
    });
};


// ========================================
// Create Order
// ========================================

const createdOrder = async (
    user_uuid,
    address_uuid,
    total_amount,
    transaction = null
) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }


    const address = await findAddressByUUID(
        address_uuid,
        user.user_id
    );

    if (!address) {
        return null;
    }


    const order = await Order.create(
        {
            user_id: user.user_id,
            address_id: address.address_id,

            customer_name: address.receiver_name,
            customer_phone: address.receiver_phone,

            province: address.province,
            city: address.city,
            customer_address: address.address,
            postal_code: address.postal_code,

            plaque: address.plaque,
            unit: address.unit,

            total_amount,

            order_status: 'pending',
            payment_status: 'unpaid',
        },
        {
            transaction,
        }
    );

    return order;
};


// ========================================
// Find Order By UUID
// ========================================

const findOrderByUUID = async (
    order_uuid,
    user_uuid = null
) => {

    const where = {
        order_uuid,
    };


    if (user_uuid) {

        const user = await findUserByUUID(
            user_uuid
        );

        if (!user) {
            return null;
        }

        where.user_id = user.user_id;
    }


    return await Order.findOne({
        where,
    });
};


// ========================================
// Create Order Item
// ========================================

const createdOrderItem = async (
    order_id,
    product_uuid,
    quantity,
    transaction = null
) => {

    const product = await Product.findOne({
        where: {
            product_uuid,
        },
        attributes: [
            'product_id',
            'current_price',
            'stock',
        ],
        transaction,
        lock: transaction
            ? transaction.LOCK.UPDATE
            : undefined,
    });


    if (!product) {
        return null;
    }


    if (product.stock < quantity) {
        return null;
    }


    const unit_price = Number(
        product.current_price
    );

    const total_price =
        unit_price * quantity;


    const orderItem = await OrderItem.create(
        {
            order_id,
            product_id: product.product_id,
            quantity,
            unit_price,
            total_price,
        },
        {
            transaction,
        }
    );


    return orderItem;
};


// ========================================
// Create Order + Items + Payment
// ========================================

const createOrderWithPayment = async (
    user_uuid,
    address_uuid,
    cartItems,
    total_amount,
    method = 'online'
) => {

    const transaction =
        await sequelize.transaction();


    try {

        const order = await createdOrder(
            user_uuid,
            address_uuid,
            total_amount,
            transaction
        );


        if (!order) {

            await transaction.rollback();

            return null;
        }


        for (const item of cartItems) {

            const orderItem =
                await createdOrderItem(
                    order.order_id,
                    item.Product.product_uuid,
                    item.quantity,
                    transaction
                );


            if (!orderItem) {

                await transaction.rollback();

                return null;
            }
        }


        const payment =
            await createdPayment(
                order.order_id,
                total_amount,
                method,
                transaction
            );


        if (!payment) {

            await transaction.rollback();

            return null;
        }


        await transaction.commit();


        return {
            order,
            payment,
        };

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


// ========================================
// Create Payment
// ========================================

const createdPayment = async (
    order_id,
    amount,
    method = 'online',
    transaction = null
) => {

    const payment = await Payment.create(
        {
            order_id,
            amount,
            method,
            status: 'pending',
        },
        {
            transaction,
        }
    );


    return payment;
};


// ========================================
// Find Payment By Authority
// ========================================

const findPaymentByAuthority = async (
    order_id,
    authority
) => {

    return await Payment.findOne({
        where: {
            order_id,
            authority,
            status: 'pending',
        },
    });
};


// ========================================
// Update Payment After Verification
// ========================================

const updatedPaymentAfterVerification = async (
    payment,
    authority,
    ref_id,
    card_pan,
    fee,
    transaction = null
) => {

    const updatedPayment =
        await payment.update(
            {
                authority,
                ref_id,
                card_pan,
                fee,
                status: 'paid',
            },
            {
                transaction,
            }
        );


    return updatedPayment;
};


// ========================================
// Mark Order As Paid
// ========================================

const markOrderAsPaid = async (
    order,
    transaction = null
) => {

    return await order.update(
        {
            payment_status: 'paid',
            order_status: 'processing',
        },
        {
            transaction,
        }
    );
};


// ========================================
// Decrease Product Stock
// ========================================

const decreaseProductStock = async (
    order_id,
    transaction
) => {

    const orderItems =
        await OrderItem.findAll({
            where: {
                order_id,
            },
            attributes: [
                'product_id',
                'quantity',
            ],
            transaction,
            lock: transaction.LOCK.UPDATE,
        });


    for (const item of orderItems) {

        const product =
            await Product.findByPk(
                item.product_id,
                {
                    attributes: [
                        'product_id',
                        'stock',
                    ],
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                }
            );


        if (!product) {
            throw new Error(
                'محصول سفارش پیدا نشد'
            );
        }


        if (product.stock < item.quantity) {
            throw new Error(
                'موجودی محصول کافی نیست'
            );
        }


        await product.decrement(
            'stock',
            {
                by: item.quantity,
                transaction,
            }
        );
    }


    return true;
};


// ========================================
// Clear Cart
// ========================================

const clearCart = async (
    cart_id,
    transaction
) => {

    const {
        CartItem,
    } = require('../model');


    await CartItem.destroy({
        where: {
            cart_id,
        },
        transaction,
    });


    return true;
};


// ========================================
// Complete Payment
// ========================================

const completePayment = async (
    payment,
    order,
    authority,
    ref_id,
    card_pan,
    fee,
    cart_id
) => {

    const transaction =
        await sequelize.transaction();


    try {

        await updatedPaymentAfterVerification(
            payment,
            authority,
            ref_id,
            card_pan,
            fee,
            transaction
        );


        await decreaseProductStock(
            order.order_id,
            transaction
        );


        await markOrderAsPaid(
            order,
            transaction
        );


        if (cart_id) {

            await clearCart(
                cart_id,
                transaction
            );
        }


        await transaction.commit();


        return true;

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


// ========================================
// Cancel Order
// ========================================

const cancelledOrder = async (
    order
) => {

    return await order.update({
        order_status: 'cancelled',
    });
};


module.exports = {

    findUserByUUID,
    findAddressByUUID,

    createdOrder,
    findOrderByUUID,

    createdOrderItem,

    createOrderWithPayment,

    createdPayment,
    findPaymentByAuthority,
    updatedPaymentAfterVerification,

    markOrderAsPaid,

    decreaseProductStock,
    clearCart,

    completePayment,

    cancelledOrder,
};