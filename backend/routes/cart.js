const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // All cart routes require authentication

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', removeFromCart);

module.exports = router;
