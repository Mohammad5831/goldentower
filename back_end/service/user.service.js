const { User, Order, OrderItem } = require('../model');


//////////////////////////////////////////////////////
// FIND USER BY PHONE
//////////////////////////////////////////////////////

const existingUserByPhoneNumber = async (phone) => {

    const user = await User.findOne({
        where: {
            phone_number: phone,
        },
    });

    return user;
};


//////////////////////////////////////////////////////
// CREATE USER
//////////////////////////////////////////////////////

const createUser = async (phone, is_admin = false) => {

    const user = await User.create({
        phone_number: phone,
        is_admin,
    });

    const { user_id, ...newUser } = user.toJSON();

    return newUser;
};


//////////////////////////////////////////////////////
// FIND USER BY UUID
//////////////////////////////////////////////////////

const existingUserByUUID = async (user_uuid) => {

    const user = await User.findOne({
        where: {
            user_uuid,
        },
        attributes: {
            exclude: ['user_id'],
        },
    });

    return user;
};


//////////////////////////////////////////////////////
// GET ALL USERS
//////////////////////////////////////////////////////

const findAllUsers = async () => {

    const users = await User.findAll({
        attributes: {
            exclude: ['user_id'],
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    });

    return users;
};


//////////////////////////////////////////////////////
// UPDATE USER PROFILE
//////////////////////////////////////////////////////

const updateUserProfile = async (user_uuid, data) => {

    const user = await User.findOne({
        where: {
            user_uuid,
        },
    });

    if (!user) {
        return null;
    }

    const allowedFields = [
        'first_name',
        'last_name',
        'email',
        'avatar',
    ];

    const updateData = {};

    for (const field of allowedFields) {

        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }

    }

    await user.update(updateData);

    const { user_id, ...updatedUser } = user.toJSON();

    return updatedUser;
};


//////////////////////////////////////////////////////
// GET USER ORDERS
//////////////////////////////////////////////////////

const findAllOrders = async (user_id) => {

    const orders = await Order.findAll({
        where: {
            user_id,
        },

        attributes: {
            exclude: [
                'order_id',
                'user_id',
            ],
        },

        order: [
            ['createdAt', 'DESC'],
        ],
    });

    return orders;
};


//////////////////////////////////////////////////////
// GET USER ORDER BY UUID
//////////////////////////////////////////////////////

const findOrderByUUID = async (user_id, order_uuid) => {

    const order = await Order.findOne({
        where: {
            order_uuid,
            user_id,
        },

        attributes: {
            exclude: [
                'order_id',
                'user_id',
            ],
        },

        include: [
            {
                model: OrderItem,
                attributes: {
                    exclude: [
                        'order_item_id',
                        'order_id',
                    ],
                },
            },
        ],
    });

    return order;
};


module.exports = {
    existingUserByPhoneNumber,
    createUser,
    existingUserByUUID,
    findAllUsers,
    updateUserProfile,
    findAllOrders,
    findOrderByUUID,
};