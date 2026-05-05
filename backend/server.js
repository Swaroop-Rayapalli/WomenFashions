require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers

// CORS configuration - support multiple origins
const rawAllowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:8000'
];

// Normalize origins: Ensure they start with https:// if they look like domains
const allowedOrigins = rawAllowedOrigins
    .filter(Boolean)
    .map(url => {
        if (!url.startsWith('http')) {
            return `https://${url}`;
        }
        return url;
    });

// Also add variants without trailing slashes
const finalAllowedOrigins = [...new Set([
    ...allowedOrigins,
    ...allowedOrigins.map(url => url.replace(/\/$/, ''))
])];

console.log('Final Allowed Origins:', finalAllowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Normalize incoming origin for checking
        const normalizedOrigin = origin.replace(/\/$/, '');

        // Check if origin is in our list OR matches a netlify/vercel subdomain
        const isAllowed = finalAllowedOrigins.includes(normalizedOrigin) ||
            normalizedOrigin.endsWith('.netlify.app') ||
            normalizedOrigin.endsWith('.vercel.app') ||
            normalizedOrigin.includes('localhost');

        if (isAllowed) {
            console.log(`CORS allowed for origin: ${origin}`);
            callback(null, true);
        } else {
            console.error(`CORS blocked for origin: ${origin}`);
            console.error(`Allowed Origins were: ${JSON.stringify(finalAllowedOrigins)}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 login requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes'
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

// Global Sanitization Middleware
app.use((req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }
    next();
});

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/feedback', require('./routes/feedback'));


// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Women Fashion API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection (non-fatal — contact route doesn't need DB)
        const connected = await testConnection();
        if (!connected) {
            console.warn('⚠️  DB connection failed — continuing without DB. Contact form will still work.');
        } else {
            // Sync database (create tables) only if connected
            await syncDatabase(false);
        }

        // Start listening regardless of DB status
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
            console.log(`\n✅ Women Fashion Backend API is ready!\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    startServer();
}

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    // Add any cleanup logic here (close DB, etc.)
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});
// Export for Vercel
module.exports = app;
