const {
    User,
    Cart,
    CartItem,
    Product,
} = require('../model');


// Find User by UUID
const findUserByUUID = async (user_uuid) => {

    const user = await User.findOne({
        where: { user_uuid },
        attributes: ['user_id'],
    });

    return user;
};


// Create Cart
const createdCart = async (user_uuid) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }

    const cart = await Cart.create({
        user_id: user.user_id,
    });

    return cart;
};


// Find Cart by User UUID
const findCart = async (user_uuid) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }

    const cart = await Cart.findOne({
        where: {
            user_id: user.user_id,
        },
    });

    return cart;
};


// Find Cart Item
const existCartItem = async (
    cart_id,
    product_id
) => {

    const cartItem = await CartItem.findOne({
        where: {
            cart_id,
            product_id,
        },
    });

    return cartItem;
};


// Create Cart Item
const createdCartItem = async (
    cart_id,
    product_uuid,
    quantity
) => {

    const product = await Product.findOne({
        where: {
            product_uuid,
        },
        attributes: ['product_id'],
    });

    if (!product) {
        return null;
    }

    const cartItem = await CartItem.create({
        cart_id,
        product_id: product.product_id,
        quantity,
    });

    return cartItem;
};


// Find Cart Items
const findCartItemByCartId = async (cart_id) => {

    const cartItems = await CartItem.findAll({

        where: {
            cart_id,
        },

        attributes: [
            'cart_item_uuid',
            'quantity',
        ],

        include: [
            {
                model: Product,

                attributes: [
                    'product_uuid',
                    'name',
                    'model',
                    'current_price',
                    'original_price',
                    'image',
                ],
            },
        ],

        order: [['createdAt', 'DESC']],
    });

    return cartItems;
};


module.exports = {

    findUserByUUID,
    createdCart,
    findCart,
    existCartItem,
    createdCartItem,
    findCartItemByCartId,

};