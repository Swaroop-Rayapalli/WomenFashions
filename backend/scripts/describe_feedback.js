const { sequelize } = require('../models');

async function describe() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        
        const [results] = await sequelize.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'feedbacks'
        `);
        
        console.log('Table schema for "feedbacks":');
        console.table(results);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

describe();
