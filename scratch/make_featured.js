const { Product } = require('../backend/models');
const { sequelize } = require('../backend/config/database');

async function update() {
    try {
        await sequelize.authenticate();
        await Product.update({ isFeatured: true }, { where: { id: [1, 2] } });
        console.log('Successfully marked products 1 and 2 as featured!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
update();
