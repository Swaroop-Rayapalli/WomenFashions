const { sequelize } = require('./models');

async function cleanupProductsTable() {
    try {
        console.log('Starting cleanup of products table constraints...');
        
        const [constraints] = await sequelize.query(`
            SELECT conname 
            FROM pg_constraint 
            JOIN pg_class ON pg_class.oid = pg_constraint.conrelid 
            WHERE relname = 'products' AND contype != 'p';
        `);
        
        console.log(`Found ${constraints.length} constraints to drop.`);
        
        for (const { conname } of constraints) {
            console.log(`Dropping constraint: ${conname}`);
            // Use simple string instead of template literal to avoid escaping issues in script creation
            await sequelize.query('ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "' + conname + '" CASCADE;');
        }
        
        console.log('✅ Cleanup successful!');
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
    } finally {
        await sequelize.close();
    }
}

cleanupProductsTable();
