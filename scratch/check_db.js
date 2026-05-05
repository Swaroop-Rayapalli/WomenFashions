const { Category } = require('../backend/models');
const { sequelize } = require('../backend/config/database');

async function check() {
    try {
        await sequelize.authenticate();
        const cats = await Category.findAll();
        cats.forEach(c => console.log(`- ${c.name} (Active: ${c.isActive})`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
