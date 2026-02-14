const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
    res.json({ success: true, message: 'Products route - coming soon' });
});

router.get('/:id', (req, res) => {
    res.json({ success: true, message: 'Get single product - coming soon' });
});

router.post('/', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Create product - coming soon' });
});

router.put('/:id', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Update product - coming soon' });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Delete product - coming soon' });
});

module.exports = router;
