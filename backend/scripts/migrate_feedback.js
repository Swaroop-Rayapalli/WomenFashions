const { sequelize } = require('../models');

async function migrate() {
    try {
        console.log('Connecting to database for migration...');
        await sequelize.authenticate();
        console.log('Connection successful.');

        const queryInterface = sequelize.getQueryInterface();
        
        console.log('Altering feedbacks table: changing image_url to TEXT...');
        await queryInterface.changeColumn('feedbacks', 'image_url', {
            type: require('sequelize').DataTypes.TEXT,
            allowNull: true
        });
        
        console.log('✅ Migration successful: image_url is now TEXT');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
