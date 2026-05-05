const { Category } = require('./models');
const { sequelize } = require('./config/database');

const categories = [
    { name: 'Designer Blouses', slug: 'designer-blouses', description: 'Custom designed and stitched blouses', displayOrder: 1 },
    { name: 'Maggam Work Blouses', slug: 'maggam-work-blouses', description: 'Intricate Maggam and hand embroidery work', displayOrder: 2 },
    { name: 'Bridal Collection', slug: 'bridal-collection', description: 'Premium bridal and wedding wear', displayOrder: 3 },
    { name: 'Sarees', slug: 'sarees', description: 'Silk, Georgette, and Chiffon sarees', displayOrder: 4 },
    { name: 'Lehengas', slug: 'lehengas', description: 'Designer festive and bridal lehengas', displayOrder: 5 },
    { name: 'Gowns & Long Frocks', slug: 'gowns', description: 'Evening gowns and traditional long frocks', displayOrder: 6 },
    { name: 'Kurtis & Tunics', slug: 'kurtis', description: 'Daily and festive wear kurtis', displayOrder: 7 },
    { name: 'Anarkalis', slug: 'anarkalis', description: 'Grand anarkali sets', displayOrder: 8 },
    { name: 'Western Wear', slug: 'western-wear', description: 'Modern tops, dresses, and skirts', displayOrder: 9 },
    { name: 'Co-ord Sets', slug: 'coord-sets', description: 'Matching designer sets', displayOrder: 10 },
    { name: 'Palazzos & Leggings', slug: 'bottoms', description: 'Comfortable ethnic and western bottoms', displayOrder: 11 },
    { name: 'Dupattas & Scarves', slug: 'scarves', description: 'Silk and designer dupattas', displayOrder: 12 },
    { name: 'Nightwear', slug: 'nightwear', description: 'Comfortable satin and cotton nightwear', displayOrder: 13 },
    { name: 'Kids Wear', slug: 'kids-wear', description: 'Designer outfits for children', displayOrder: 14 },
    { name: 'Plus Size', slug: 'plus-size', description: 'Fashionable outfits in all sizes', displayOrder: 15 },
    { name: 'Accessories', slug: 'accessories', description: 'Belts, bags, and fashion accessories', displayOrder: 16 },
    { name: 'Jewelry', slug: 'jewelry', description: 'Ethnic and contemporary jewelry', displayOrder: 17 },
    { name: 'Fabrics', slug: 'fabrics', description: 'Premium unstitched fabrics', displayOrder: 18 }
];

const seedCategories = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced and connected for seeding...');
        
        for (const cat of categories) {
            await Category.findOrCreate({
                where: { slug: cat.slug },
                defaults: cat
            });
            console.log(`Seeded/Verified category: ${cat.name}`);
        }
        
        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedCategories();
