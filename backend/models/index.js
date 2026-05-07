const { sequelize } = require('../config/database');

// Import all models
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const ProductImage = require('./ProductImage')(sequelize);
const ProductSize = require('./ProductSize')(sequelize);
const Customer = require('./Customer')(sequelize);
const CustomerAddress = require('./CustomerAddress')(sequelize);
const Cart = require('./Cart')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Feedback = require('./Feedback')(sequelize);
const FeedbackInteraction = require('./FeedbackInteraction')(sequelize);

// Store models in an object
const models = {
    User,
    Category,
    Product,
    ProductImage,
    ProductSize,
    Customer,
    CustomerAddress,
    Cart,
    Order,
    OrderItem,
    Feedback,
    FeedbackInteraction
};

// Set up associations
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Sync database (create tables if they don't exist)
const syncDatabase = async (force = false) => {
    try {
        // Use alter: true only if force is false, to try and keep data
        // But be aware it can fail with constraint errors in Postgres
        const syncOptions = { force };
        
        // Only use alter in development and when not forcing
        if (!force && process.env.NODE_ENV !== 'production') {
            syncOptions.alter = true;
        }

        await sequelize.sync(syncOptions);
        console.log(`✅ Database ${force ? 'reset and ' : ''}synchronized successfully`);
    } catch (error) {
        console.error('❌ Error synchronizing database:', error.message);
        
        // If alter failed, try a plain sync as a fallback (will only create missing tables)
        if (error.name === 'SequelizeUnknownConstraintError' || error.name === 'SequelizeDatabaseError') {
            console.log('⚠️ Alter failed, attempting plain sync fallback...');
            try {
                await sequelize.sync({ force: false, alter: false });
                console.log('✅ Plain sync successful (no schema changes applied)');
            } catch (fallbackError) {
                console.error('❌ Fallback sync also failed:', fallbackError.message);
                throw fallbackError;
            }
        } else {
            throw error;
        }
    }
};

module.exports = {
    sequelize,
    ...models,
    syncDatabase
};
