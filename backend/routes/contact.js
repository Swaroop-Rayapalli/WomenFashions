const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');
const { contactValidationRules, validate } = require('../middleware/validation');

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
router.post('/', contactValidationRules, validate, async (req, res, next) => {
    try {
        const { name, phone, email, service, message } = req.body;

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
            message: 'Failed to send message. Please try calling us directly at 9030600126.',
            error: error.message,
            errorCode: error.code || 'UNKNOWN'
        });
    }
});

module.exports = router;
