const { Feedback, FeedbackInteraction } = require('../models');
const { Op } = require('sequelize');
const supabase = require('../utils/supabase');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Submit new feedback
 * @route   POST /api/feedback
 * @access  Public
 */
exports.submitFeedback = async (req, res, next) => {
    try {
        console.log('Feedback submission received:', { body: req.body, filesCount: req.files?.length });
        const { name, message, rating } = req.body;
        
        if (!name || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name and message are required'
            });
        }

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const fileName = `feedback/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
                    const fileBuffer = fs.readFileSync(file.path);

                    const { data, error } = await supabase.storage
                        .from('avatars')
                        .upload(fileName, fileBuffer, {
                            contentType: file.mimetype,
                            upsert: true
                        });

                    if (error) {
                        console.error('Supabase upload error for file:', file.originalname, error);
                    } else {
                        const { data: publicData } = supabase.storage
                            .from('avatars')
                            .getPublicUrl(fileName);

                        if (publicData) {
                            imageUrls.push(publicData.publicUrl);
                        }
                    }
                } catch (uploadErr) {
                    console.error('Error processing file:', file.originalname, uploadErr);
                } finally {
                    // Always delete local temp file
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }
            }
        }

        const feedback = await Feedback.create({
            name,
            message,
            rating: parseInt(rating) || 5,
            images: imageUrls,
            isApproved: true // Auto-approve for immediate visibility
        });

        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        console.error('Feedback submission error details:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Feedback submission failed',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * @desc    Get all feedbacks (now auto-approved)
 * @route   GET /api/feedback
 * @access  Public
 */
exports.getApprovedFeedbacks = async (req, res, next) => {
    try {
        if (!Feedback) {
            console.error('Feedback model is undefined!');
            return res.status(500).json({ success: false, message: 'Feedback model missing' });
        }
        
        const feedbacks = await Feedback.findAll({
            // Use the database column name to match the project's existing pattern
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: feedbacks.map(f => f.get({ plain: true }))
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching feedbacks',
            error: error.message
        });
    }
};
/**
 * @desc    Delete feedback (Admin only)
 * @route   DELETE /api/feedback/:id
 * @access  Private/Admin
 */
exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        // Optional: Delete images from Supabase
        if (feedback.images && feedback.images.length > 0) {
            for (const imageUrl of feedback.images) {
                try {
                    const fileName = imageUrl.split('/').pop();
                    await supabase.storage.from('avatars').remove([`feedback/${fileName}`]);
                } catch (e) {
                    console.error('Error deleting image from Supabase:', e);
                }
            }
        }

        await feedback.destroy();
        res.json({ success: true, message: 'Feedback deleted' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};

/**
 * @desc    Like a feedback (Toggles or Switches)
 * @route   POST /api/feedback/:id/like
 * @access  Public
 */
exports.likeFeedback = async (req, res, next) => {
    try {
        const feedbackId = req.params.id;
        const userId = req.user ? req.user.id : null;
        const ipAddress = req.ip || req.connection.remoteAddress;

        const feedback = await Feedback.findByPk(feedbackId);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        const existing = await FeedbackInteraction.findOne({
            where: {
                feedbackId,
                [Op.or]: [
                    userId ? { userId } : null,
                    { ipAddress }
                ].filter(Boolean)
            }
        });

        if (existing) {
            if (existing.type === 'like') {
                // UNLIKE: Remove the interaction and decrement count
                await existing.destroy();
                feedback.likes = Math.max(0, feedback.likes - 1);
                await feedback.save();
                return res.json({ success: true, likes: feedback.likes, dislikes: feedback.dislikes, userVote: null });
            } else {
                // SWITCH: Change dislike to like
                existing.type = 'like';
                await existing.save();
                feedback.dislikes = Math.max(0, feedback.dislikes - 1);
                feedback.likes += 1;
                await feedback.save();
                return res.json({ success: true, likes: feedback.likes, dislikes: feedback.dislikes, userVote: 'like' });
            }
        }

        // NEW LIKE
        await FeedbackInteraction.create({ feedbackId, userId, ipAddress, type: 'like' });
        feedback.likes += 1;
        await feedback.save();
        
        res.json({ success: true, likes: feedback.likes, dislikes: feedback.dislikes, userVote: 'like' });
    } catch (error) {
        console.error('Error liking feedback:', error);
        res.status(500).json({ success: false, message: 'Like failed' });
    }
};

/**
 * @desc    Dislike a feedback (Toggles or Switches)
 * @route   POST /api/feedback/:id/dislike
 * @access  Public
 */
exports.dislikeFeedback = async (req, res, next) => {
    try {
        const feedbackId = req.params.id;
        const userId = req.user ? req.user.id : null;
        const ipAddress = req.ip || req.connection.remoteAddress;

        const feedback = await Feedback.findByPk(feedbackId);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        const existing = await FeedbackInteraction.findOne({
            where: {
                feedbackId,
                [Op.or]: [
                    userId ? { userId } : null,
                    { ipAddress }
                ].filter(Boolean)
            }
        });

        if (existing) {
            if (existing.type === 'dislike') {
                // UN-DISLIKE: Remove interaction and decrement count
                await existing.destroy();
                feedback.dislikes = Math.max(0, feedback.dislikes - 1);
                await feedback.save();
                return res.json({ success: true, likes: feedback.likes, dislikes: feedback.dislikes, userVote: null });
            } else {
                // SWITCH: Change like to dislike
                existing.type = 'dislike';
                await existing.save();
                feedback.likes = Math.max(0, feedback.likes - 1);
                feedback.dislikes += 1;
                await feedback.save();
                return res.json({ success: true, likes: feedback.likes, dislikes: feedback.dislikes, userVote: 'dislike' });
            }
        }

        // NEW DISLIKE
        await FeedbackInteraction.create({ feedbackId, userId, ipAddress, type: 'dislike' });
        feedback.dislikes += 1;
        await feedback.save();
        
        res.json({ success: true, likes: feedback.likes, dislikes: feedback.dislikes, userVote: 'dislike' });
    } catch (error) {
        console.error('Error disliking feedback:', error);
        res.status(500).json({ success: false, message: 'Dislike failed' });
    }
};
