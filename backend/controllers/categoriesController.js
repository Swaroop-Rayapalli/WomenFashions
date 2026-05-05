const { Category } = require('../models');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            order: [['displayOrder', 'ASC'], ['name', 'ASC']]
        });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        next(error);
    }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description, imageUrl, displayOrder } = req.body;
        
        // Generate slug from name
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const category = await Category.create({
            name,
            slug,
            description,
            imageUrl,
            displayOrder: displayOrder || 0
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        next(error);
    }
};
