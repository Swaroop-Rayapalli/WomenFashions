const Sequelize = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(dbUrl || 'postgres://localhost:5432/dummy', {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL database connection established successfully');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL database:', error.message);
        return false;
    }
};

module.exports = { sequelize, testConnection };
