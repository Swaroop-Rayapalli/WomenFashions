const { sequelize } = require('../models');

async function migrate() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        
        console.log('Syncing models...');
        // This will create the feedback_interactions table if it doesn't exist
        await sequelize.sync({ alter: false }); 
        
        console.log('✅ Migration successful: feedback_interactions table created');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
