const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Orders route - coming soon' });
});

router.post('/', (req, res) => {
    res.json({ success: true, message: 'Create order - coming soon' });
});

module.exports = router;
