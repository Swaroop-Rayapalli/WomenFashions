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
        await sequelize.sync({ force, alter: true });
        console.log(`✅ Database ${force ? 'reset and ' : ''}synchronized successfully`);
    } catch (error) {
        console.error('❌ Error synchronizing database:', error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    ...models,
    syncDatabase
};
