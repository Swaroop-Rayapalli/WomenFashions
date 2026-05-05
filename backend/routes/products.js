const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productsController');

// Routes
router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, authorize('admin', 'staff'), createProduct);
router.put('/:id', protect, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteProduct);

module.exports = router;
