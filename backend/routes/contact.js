const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const { name, phone, email, service, message } = req.body;

        // Validate required fields
        if (!name || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, phone, and message'
            });
        }

        // Send email
        await sendContactEmail({
            name,
            phone,
            email,
            service,
            message
        });

        res.json({
            success: true,
            message: 'Your message has been sent successfully! We will contact you soon.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try calling us directly at 9030600126.'
        });
    }
});

module.exports = router;
