const { Customer } = require('../models');
const supabase = require('../utils/supabase');
const fs = require('fs');

/**
 * @desc    Get all customers (Admin only)
 * @route   GET /api/customers
 * @access  Private/Admin
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const { Order } = require('../models');
        const customers = await Customer.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Order,
                    as: 'orders',
                    attributes: ['id']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        const customerData = customers.map(customer => {
            const plain = customer.get({ plain: true });
            return {
                ...plain,
                orderCount: plain.orders?.length || 0,
                orders: undefined // Remove array to save bandwidth
            };
        });

        res.json({
            success: true,
            data: customerData
        });
    } catch (error) {
        console.error('Get All Customers Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
};

/**
 * @desc    Get single customer details (Admin only)
 * @route   GET /api/customers/:id
 * @access  Private/Admin
 */
exports.getCustomerDetails = async (req, res) => {
    try {
        const { CustomerAddress, Order } = require('../models');
        const customer = await Customer.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: CustomerAddress, as: 'addresses' },
                { 
                    model: Order, 
                    as: 'orders',
                    limit: 10,
                    order: [['created_at', 'DESC']]
                }
            ]
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Get Customer Details Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer details',
            error: error.message
        });
    }
};

/**
 * @desc    Upload customer avatar
 * @route   POST /api/customers/avatar
 * @access  Private
 */
exports.uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image file'
        });
    }

    try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `avatars/${req.user.id}-${Date.now()}${req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, fileContent, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update customer in DB
        await Customer.update({ avatarUrl: publicUrl }, { where: { id: req.user.id } });

        // Delete local temporary file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatarUrl: publicUrl
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload avatar',
            error: error.message
        });
    }
};
