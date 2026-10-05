const { getAllOrders } = require("../service/admin.service")

const getOrders = async (req, res) => {
    try {
        const allOrders = await getAllOrders();
        if (!allOrders) {
            return res.status(404).json({
                success: false,
                message: 'لیست سفارشات پیدا نشد',
            });
        };

        return res.status(200).json({
            success: true,
            message: 'لیست سفارشات با موفقیت دریافت شد',
            orders: allOrders,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت لیست سفارشات',
            error: error.message,
        })
    }
};


module.exports = {
    getOrders,
};