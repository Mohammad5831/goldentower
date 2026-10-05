const sequelize = require('../config/database.config');

const User = require('./User.model');
const OtpCode = require('./OtpCode.model');

const Product = require('./Product.model');
const Category = require('./Category.model');
const Brand = require('./Brand.model');

const DetailedSpec = require('./DetailedSpec.model');
const GeneralSpec = require('./GeneralSpec.model');

const Cart = require('./Cart.model');
const CartItem = require('./CartItem.model');

const Order = require('./Order.model');
const OrderItem = require('./OrderItem.model');
const Payment = require('./Payment.model');

const Address = require('./Address.model');

const Settings = require('./Settings.model');


// ========================================
// User and Cart
// ========================================

User.hasOne(Cart, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
});


// ========================================
// User and Address
// ========================================

User.hasMany(Address, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Address.belongsTo(User, {
    foreignKey: 'user_id',
});


// ========================================
// Cart and CartItem
// ========================================

Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    onDelete: 'CASCADE',
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
});


// ========================================
// Product and CartItem
// ========================================

Product.hasMany(CartItem, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
});

CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
});


// ========================================
// Category and Product
// ========================================

Category.hasMany(Product, {
    foreignKey: 'category_id',
});

Product.belongsTo(Category, {
    foreignKey: 'category_id',
});


// ========================================
// Brand and Product
// ========================================

Brand.hasMany(Product, {
    foreignKey: 'brand_id',
});

Product.belongsTo(Brand, {
    foreignKey: 'brand_id',
});


// ========================================
// Product and GeneralSpec
// ========================================

Product.hasMany(GeneralSpec, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
});

GeneralSpec.belongsTo(Product, {
    foreignKey: 'product_id',
});


// ========================================
// Product and DetailedSpec
// ========================================

Product.hasMany(DetailedSpec, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
});

DetailedSpec.belongsTo(Product, {
    foreignKey: 'product_id',
});


// ========================================
// User and Order
// ========================================

User.hasMany(Order, {
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
});


// ========================================
// Address and Order
// ========================================

Address.hasMany(Order, {
    foreignKey: 'address_id',
    onDelete: 'RESTRICT',
});

Order.belongsTo(Address, {
    foreignKey: 'address_id',
});


// ========================================
// Order and OrderItem
// ========================================

Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
});


// ========================================
// Product and OrderItem
// ========================================

Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    onDelete: 'RESTRICT',
});

OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
});


// ========================================
// Order and Payment
// ========================================

Order.hasMany(Payment, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
});

Payment.belongsTo(Order, {
    foreignKey: 'order_id',
});


module.exports = {

    sequelize,

    User,
    OtpCode,

    Product,
    Category,
    Brand,

    DetailedSpec,
    GeneralSpec,

    Cart,
    CartItem,

    Order,
    OrderItem,
    Payment,

    Address,
    
    Settings,
};