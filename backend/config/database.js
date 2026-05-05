const Sequelize = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('❌ ERROR: DATABASE_URL is not defined in backend/.env');
    // Don't exit here, let testConnection handle it so server.js can start (per original design)
}

const sequelize = dbUrl ? new Sequelize(dbUrl, {
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
}) : null;

const testConnection = async () => {
    if (!sequelize) {
        console.error('❌ Unable to connect: DATABASE_URL is missing');
        return false;
    }
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
