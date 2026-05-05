const { sequelize } = require('../models');

async function migrate() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('feedbacks');
        
        if (!tableInfo.likes) {
            console.log('Adding likes column...');
            await queryInterface.addColumn('feedbacks', 'likes', {
                type: require('sequelize').DataTypes.INTEGER,
                defaultValue: 0
            });
        }
        
        if (!tableInfo.dislikes) {
            console.log('Adding dislikes column...');
            await queryInterface.addColumn('feedbacks', 'dislikes', {
                type: require('sequelize').DataTypes.INTEGER,
                defaultValue: 0
            });
        }
        
        console.log('✅ Migration successful: likes and dislikes columns added');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
