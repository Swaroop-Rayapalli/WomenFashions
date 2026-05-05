const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoriesController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCategories);

router.post('/', protect, authorize('admin', 'staff'), createCategory);

module.exports = router;
