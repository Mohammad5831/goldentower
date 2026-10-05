const calculateTotalPrice = (cartItems) => {
    let allProducts = [];
    let totalPrice = 0;
    let total_price = 0;

    const itemsWithTotal = cartItems.map(item => {
        const current_price = parseFloat(item.Product.current_price);
        const original_price = parseFloat(item.Product.original_price);
        const quantity = item.quantity || 1; // اگر quantity وجود نداشته باشد، 1 در نظر بگیرید
        const itemTotalPrice = current_price * quantity;
        const item_total_price = original_price * quantity;
        totalPrice += itemTotalPrice;
        total_price += item_total_price
        const product = {
            product_uuid: item.Product.product_uuid,
            product_name: item.Product.name,
            product_model: item.Product.model,
            original_price: original_price,
            current_price: current_price,
            quantity: quantity,
            image: item.Product.image,
            item_total_price: item_total_price,
            itemTotalPrice: itemTotalPrice,
        };
        allProducts.push(product);
        // اضافه کردن itemTotalPrice به شیء Product به عنوان یک خاصیت جدید
    });

    return {
        allProducts,
        totalPrice,
        total_price,
    };
};

module.exports = {
    calculateTotalPrice,
};