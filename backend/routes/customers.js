const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const { 
    uploadAvatar, 
    getAllCustomers, 
    getCustomerDetails 
} = require('../controllers/customerController');
const upload = require('../middleware/upload');

// Admin routes
router.get('/', protect, authorize('admin', 'staff'), getAllCustomers);
router.get('/:id', protect, authorize('admin', 'staff'), getCustomerDetails);

// Customer routes
router.post('/avatar', protect, upload.single('image'), uploadAvatar);

module.exports = router;
