const { Cart, Product, ProductImage } = require('../models');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { customerId: req.user.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [{ model: ProductImage, as: 'images', where: { isPrimary: true }, required: false }]
                }
            ]
        });

        res.json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
exports.addToCart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;

        // Check if item already in cart
        let cartItem = await Cart.findOne({
            where: {
                customerId: req.user.id,
                productId,
                size
            }
        });

        if (cartItem) {
            cartItem.quantity += (quantity || 1);
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                customerId: req.user.id,
                productId,
                size,
                quantity: quantity || 1
            });
        }

        res.status(201).json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
exports.removeFromCart = async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            where: { id: req.params.id, customerId: req.user.id }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        await cartItem.destroy();

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
