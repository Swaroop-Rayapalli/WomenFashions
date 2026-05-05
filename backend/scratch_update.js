const { sequelize } = require('./config/database');

async function updateDb() {
    try {
        await sequelize.authenticate();
        await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);');
        console.log('Successfully added avatar_url to users table');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

updateDb();
