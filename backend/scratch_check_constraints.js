const { sequelize } = require('./models');

async function checkConstraints() {
    try {
        const [results] = await sequelize.query(`
            SELECT conname, contype 
            FROM pg_constraint 
            JOIN pg_class ON pg_class.oid = pg_constraint.conrelid 
            WHERE relname = 'products';
        `);
        console.log('Constraints on products table:', results);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkConstraints();
