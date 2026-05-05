const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const supabase = require('../utils/supabase');
const fs = require('fs');

router.post('/image', protect, authorize('admin'), upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image file'
        });
    }

    try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const filePath = `products/${fileName}`;

        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, fileContent, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        // Delete local temporary file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'Image uploaded to Supabase successfully',
            data: {
                filename: fileName,
                path: publicUrl,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Supabase Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image to storage',
            error: error.message
        });
    }
});

module.exports = router;
