const { Category, Product, ProductImage, ProductSize, sequelize } = require('./models');

const seed = async () => {
    try {
        console.log('Connecting to Supabase...');
        await sequelize.authenticate();
        console.log('Connection successful. Syncing database...');
        
        await sequelize.sync({ force: true });
        console.log('Database synced (Tables dropped and recreated)');

        const bridalCat = await Category.create({
            name: 'Bridal Collection',
            slug: 'bridal-collection',
            description: 'Stunning bridal blouses and lehengas'
        });

        const designerCat = await Category.create({
            name: 'Designer Blouses',
            slug: 'designer-blouses',
            description: 'Trendy cuts and modern patterns'
        });

        const p1 = await Product.create({
            name: 'Zardosi Bridal Blouse',
            slug: 'zardosi-bridal-blouse',
            description: 'Heavy zardosi work on silk fabric',
            categoryId: bridalCat.id,
            price: 5000,
            inStock: true,
            stockQuantity: 10
        });

        await ProductImage.create({
            productId: p1.id,
            imageUrl: '/images/bridal_blouse_1765197647134.png',
            isPrimary: true
        });

        const sizes = ['XS', 'S', 'M', 'L', 'XL'];
        for (const size of sizes) {
            await ProductSize.create({
                productId: p1.id,
                size,
                stockQuantity: 2,
                isAvailable: true
            });
        }

        const p2 = await Product.create({
            name: 'Elegant Designer Blouse',
            slug: 'elegant-designer-blouse',
            description: 'Modern cut designer blouse',
            categoryId: designerCat.id,
            price: 1500,
            inStock: true,
            stockQuantity: 20
        });

        await ProductImage.create({
            productId: p2.id,
            imageUrl: '/images/designer_blouses_collection_1765197297759.png',
            isPrimary: true
        });

        for (const size of sizes) {
            await ProductSize.create({
                productId: p2.id,
                size,
                stockQuantity: 4,
                isAvailable: true
            });
        }

        console.log('✅ Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
