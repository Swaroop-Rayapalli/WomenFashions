const { Product, Category, ProductImage, ProductSize } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
    try {
        const { category, subcategory, featured, search, minPrice, maxPrice, sort, fabric, occasion } = req.query;
        const queryOptions = {
            include: [
                { model: Category, as: 'category' },
                { model: ProductImage, as: 'images' },
                { model: ProductSize, as: 'sizes' }
            ],
            where: {},
            order: [['created_at', 'DESC']]
        };

        if (category && category !== '' && category !== 'undefined') queryOptions.where.categoryId = category;
        if (subcategory && subcategory !== '') queryOptions.where.subcategory = subcategory;
        if (featured === 'true') queryOptions.where.isFeatured = true;
        if (fabric && fabric !== '') queryOptions.where.fabric = fabric;
        if (occasion && occasion !== '') queryOptions.where.occasion = occasion;

        // Search logic
        if (search && search.trim() !== '') {
            queryOptions.where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Price range logic
        if (minPrice || maxPrice) {
            queryOptions.where.price = {};
            if (minPrice && !isNaN(parseFloat(minPrice))) queryOptions.where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice && !isNaN(parseFloat(maxPrice))) queryOptions.where.price[Op.lte] = parseFloat(maxPrice);
            if (Object.keys(queryOptions.where.price).length === 0) delete queryOptions.where.price;
        }

        // Sorting logic
        if (sort) {
            if (sort === 'price-asc') queryOptions.order = [['price', 'ASC']];
            else if (sort === 'price-desc') queryOptions.order = [['price', 'DESC']];
            else if (sort === 'newest') queryOptions.order = [['created_at', 'DESC']];
            else if (sort === 'oldest') queryOptions.order = [['created_at', 'ASC']];
        }

        const products = await Product.findAll(queryOptions);

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = async (req, res) => {
    try {
        const identifier = req.params.id;
        const isNumeric = /^\d+$/.test(identifier);
        
        let product;
        const includeOptions = [
            { model: Category, as: 'category' },
            { model: ProductImage, as: 'images' },
            { model: ProductSize, as: 'sizes' }
        ];

        if (isNumeric) {
            product = await Product.findByPk(identifier, { include: includeOptions });
        } else {
            product = await Product.findOne({
                where: { slug: identifier },
                include: includeOptions
            });
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res) => {
    try {
        const { name, description, categoryId, subcategory, price, discountPrice, stockQuantity, isFeatured, fabric, workType, occasion, sku, images, sizes } = req.body;

        // Simple slug generation
        const slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

        const product = await Product.create({
            name,
            slug,
            description,
            categoryId,
            subcategory,
            price,
            discountPrice,
            stockQuantity: stockQuantity || 0,
            isFeatured: isFeatured === true || isFeatured === 'true',
            fabric,
            workType,
            occasion,
            sku
        });

        // Add images if provided
        if (images && images.length > 0) {
            const imageObjects = images.map((url, index) => ({
                productId: product.id,
                imageUrl: url,
                isPrimary: index === 0
            }));
            await ProductImage.bulkCreate(imageObjects);
        }

        // Add sizes if provided
        if (sizes && sizes.length > 0) {
            const sizeObjects = sizes.map(size => ({
                productId: product.id,
                size: typeof size === 'object' ? size.size : size,
                stockQuantity: typeof size === 'object' ? size.stockQuantity : 0
            }));
            await ProductSize.bulkCreate(sizeObjects);
        }

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.update(req.body);

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.destroy();

        res.json({
            success: true,
            message: 'Product removed'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
