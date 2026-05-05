const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const { getMyOrders, createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.get('/', protect, getMyOrders);
router.post('/', protect, createOrder);

// Admin & Staff routes
router.get('/admin', protect, authorize('admin', 'staff'), getAllOrders);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;
