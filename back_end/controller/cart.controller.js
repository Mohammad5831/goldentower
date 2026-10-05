const {
    findCart,
    createdCart,
    existCartItem,
    createdCartItem,
    findCartItemByCartId,
} = require('../service/cart.service');

const {
    findSingelProduct,
} = require('../service/product.service');

const {
    exsitingUserByUUID,
} = require('../service/user.service');

const {
    calculateTotalPrice,
} = require('../utilitie/totalPriceService');


// Add Product To Cart
const addProductToCart = async (req, res) => {

    const user_uuid = req.user.user_uuid;

    const {
        product_uuid,
        quantity,
    } = req.body;

    try {

        const user = await exsitingUserByUUID(user_uuid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربری موردنظر پیدا نشد',
            });
        }

        const product = await findSingelProduct(product_uuid);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        let cart = await findCart(user_uuid);

        if (!cart) {
            cart = await createdCart(user_uuid);
        }

        const existItem = await existCartItem(
            cart.cart_id,
            product.product_id
        );

        if (existItem) {
            return res.status(400).json({
                success: false,
                message: 'این محصول در سبد خرید شما موجود است',
            });
        }

        await createdCartItem(
            cart.cart_id,
            product_uuid,
            quantity
        );

        return res.status(201).json({
            success: true,
            message: 'محصول با موفقیت به سبد خرید اضافه شد',
        });

    } catch (error) {

        console.error('Add product to cart error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در اضافه کردن محصول به سبد خرید',
        });
    }
};


// Edit Cart Product
const editCartProduct = async (req, res) => {

    const user_uuid = req.user.user_uuid;

    const {
        product_uuid,
        quantity,
    } = req.body;

    try {

        const user = await exsitingUserByUUID(user_uuid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربری موردنظر پیدا نشد',
            });
        }

        const product = await findSingelProduct(product_uuid);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        const cart = await findCart(user_uuid);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'سبد خرید موردنظر پیدا نشد',
            });
        }

        const existItem = await existCartItem(
            cart.cart_id,
            product.product_id
        );

        if (!existItem) {
            return res.status(404).json({
                success: false,
                message: 'این محصول در سبد خرید شما موجود نیست',
            });
        }

        await existItem.update({
            quantity,
        });

        return res.status(200).json({
            success: true,
            message: 'سبد خرید با موفقیت ویرایش شد',
        });

    } catch (error) {

        console.error('Edit cart product error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در ویرایش سبد خرید',
        });
    }
};


// Get Cart
const getCart = async (req, res) => {

    const user_uuid = req.user.user_uuid;

    try {

        const user = await exsitingUserByUUID(user_uuid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربری موردنظر پیدا نشد',
            });
        }

        let cart = await findCart(user_uuid);

        if (!cart) {
            cart = await createdCart(user_uuid);
        }

        const cartItems = await findCartItemByCartId(
            cart.cart_id
        );

        const calculate = await calculateTotalPrice(cartItems);

        return res.status(200).json({
            success: true,
            message: 'سبد خرید با موفقیت دریافت شد',
            cartItems: calculate.allProducts,
            totalPrice: calculate.totalPrice,
            total_price: calculate.total_price,
        });

    } catch (error) {

        console.error('Get cart error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت سبد خرید',
        });
    }
};


// Delete From Cart
const deleteFromCart = async (req, res) => {

    const user_uuid = req.user.user_uuid;

    const {
        product_uuid,
    } = req.params;

    try {

        const user = await exsitingUserByUUID(user_uuid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربری موردنظر پیدا نشد',
            });
        }

        const product = await findSingelProduct(product_uuid);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'محصول موردنظر پیدا نشد',
            });
        }

        const cart = await findCart(user_uuid);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'سبد خرید موردنظر پیدا نشد',
            });
        }

        const existItem = await existCartItem(
            cart.cart_id,
            product.product_id
        );

        if (!existItem) {
            return res.status(404).json({
                success: false,
                message: 'این محصول در سبد خرید شما موجود نیست',
            });
        }

        await existItem.destroy();

        return res.status(200).json({
            success: true,
            message: 'محصول با موفقیت از سبد خرید حذف شد',
        });

    } catch (error) {

        console.error('Delete from cart error:', error);

        return res.status(500).json({
            success: false,
            message: 'خطا در حذف محصول از سبد خرید',
        });
    }
};


module.exports = {
    addProductToCart,
    editCartProduct,
    getCart,
    deleteFromCart,
};