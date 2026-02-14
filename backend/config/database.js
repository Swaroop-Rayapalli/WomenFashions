const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite database connection established successfully');
        console.log('📁 Database file: ./database.sqlite');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to SQLite database:', error.message);
        return false;
    }
};

module.exports = { sequelize, testConnection };
