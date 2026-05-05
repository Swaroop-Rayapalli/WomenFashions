const express = require('express');
const router = express.Router();
const { submitFeedback, getApprovedFeedbacks, deleteFeedback, likeFeedback, dislikeFeedback } = require('../controllers/feedbackController');
const { protect, authorize, loadUser } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('images', 5), submitFeedback);
router.get('/', getApprovedFeedbacks);
router.post('/:id/like', loadUser, likeFeedback);
router.post('/:id/dislike', loadUser, dislikeFeedback);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteFeedback);

module.exports = router;
