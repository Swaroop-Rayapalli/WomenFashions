const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.json({ success: true, message: 'Categories route - coming soon' });
});

router.post('/', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Create category - coming soon' });
});

module.exports = router;
