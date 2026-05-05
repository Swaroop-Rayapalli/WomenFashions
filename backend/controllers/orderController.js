const { Order, OrderItem, Product, Customer } = require('../models');

/**
 * @desc    Get all orders for logged in customer
 * @route   GET /api/orders
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { customerId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product', attributes: ['name', 'price'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod, notes, customerDetails } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // Generate Order Number: WF-YYYYMMDD-XXXX
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `WF-${dateStr}-${randomStr}`;

        // Get customer info
        let customerId;
        let customerName;
        let customerEmail;
        let customerPhone;

        // If admin is creating a manual order for a customer
        if (customerDetails && (req.user.role === 'admin' || req.user.role === 'staff')) {
            customerName = customerDetails.name;
            customerPhone = customerDetails.phone;
            customerEmail = customerDetails.email || '';

            // Look up or create a customer record for this phone number
            let customer = await Customer.findOne({ where: { phone: customerPhone } });
            if (!customer) {
                customer = await Customer.create({
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail,
                    password: 'manual-order-placeholder', // Placeholders for required fields
                    username: `user_${customerPhone}`
                });
            }
            customerId = customer.id;
        } else {
            // Regular user creating their own order
            if (req.user.role === 'customer') {
                customerId = req.user.id;
                customerName = req.user.name || req.user.username;
                customerEmail = req.user.email;
                customerPhone = req.user.phone;
            } else {
                // Admin/Staff creating order without customerDetails (unlikely but possible)
                return res.status(400).json({ success: false, message: 'Customer details are required for admin-created orders' });
            }
        }

        const order = await Order.create({
            orderNumber,
            customerId,
            customerName,
            customerEmail,
            customerPhone,
            shippingStreet: shippingAddress.street || shippingAddress.address, // Handle both formats
            shippingCity: shippingAddress.city,
            shippingState: shippingAddress.state,
            shippingPincode: shippingAddress.pincode || shippingAddress.zip,
            totalAmount,
            paymentMethod: paymentMethod || 'whatsapp',
            status: 'pending',
            notes: notes || ''
        });

        const orderItems = items.map(item => ({
            orderId: order.id,
            productId: item.id || item.productId,
            productName: item.name || item.product_name || 'Product',
            productImage: item.image || item.product_image || '',
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            subtotal: parseFloat(item.price) * parseInt(item.quantity)
        }));

        await OrderItem.bulkCreate(orderItems);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order: ' + error.message
        });
    }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders/admin
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
                { model: Customer, as: 'customer', attributes: ['name', 'phone', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
