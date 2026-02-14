const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

router.post('/image', protect, authorize('admin'), upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image file'
        });
    }

    res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            size: req.file.size
        }
    });
});

module.exports = router;
