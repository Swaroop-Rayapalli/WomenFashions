const { sequelize } = require('../models');

async function migrate() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        
        console.log('Running ALTER TABLE commands...');
        
        // Use raw SQL to be absolutely sure
        await sequelize.query('ALTER TABLE feedbacks ALTER COLUMN image_url TYPE TEXT');
        await sequelize.query('ALTER TABLE feedbacks ALTER COLUMN name TYPE TEXT');
        
        console.log('✅ Migration successful: image_url and name are now TEXT');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
