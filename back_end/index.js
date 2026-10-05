const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const db = require('./model');

const app = express();
const port = process.env.PORT || 3000;


// ====================
// Routes
// ====================

const authRoutes = require('./router/user.router');
const productRoutes = require('./router/product.router');
const categoryRoutes = require('./router/category.router');
const brandRoutes = require('./router/brand.router');
const imageRoutes = require('./router/image.router');
const cartRoutes = require('./router/cart.router');
const addressRoutes = require('./router/address.router');
const paymentRoutes = require('./router/payment.router');
const adminRouter = require('./router/admin.router');
const articleRoutes = require('./router/article.router');
const settingsRoutes = require('./router/settings.router');


// ====================
// Middlewares
// ====================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));


// ====================
// Request Logger
// ====================

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});


// ====================
// Static Files
// ====================

const productImgPath = path.join(
    __dirname,
    'storage',
    'products'
);

app.use(
    '/api/image',
    express.static(productImgPath)
);


// ====================
// API Routes
// ====================

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRouter);

app.use('/api/settings', settingsRoutes);

app.use('/api/products', productRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/brands', brandRoutes);

app.use('/api/products/images', imageRoutes);

app.use('/api/carts', cartRoutes);

app.use('/api/addresses', addressRoutes);

app.use('/api/payment', paymentRoutes);

app.use('/api/articles', articleRoutes);

// ====================
// 404 Handler
// ====================

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'مسیر موردنظر پیدا نشد',
    });
});


// ====================
// Global Error Handler
// ====================

app.use((err, req, res, next) => {

    console.error(err);

    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'خطای داخلی سرور',
    });
});


// ====================
// Start Server
// ====================

const startServer = async () => {

    try {

        await db.sequelize.authenticate();

        console.log('database connected');

        await db.sequelize.sync();

        console.log('database synchronized');

        app.listen(port, () => {
            console.log(`server listening on port ${port}`);
        });

    } catch (error) {

        console.error(
            'database connection failed:',
            error
        );

        process.exit(1);
    }
};

startServer();