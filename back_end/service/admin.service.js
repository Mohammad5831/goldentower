const { Order } = require("../model")

const getAllOrders = async () => {
    const orders = Order.findAll({
        attributes: {
            exclude: ['order_id', 'user_id']
        }
    })

    return orders;
};


module.exports = {
    getAllOrders,
}