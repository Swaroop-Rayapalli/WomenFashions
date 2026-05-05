const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    logout,
    updateProfile,
    updatePassword,
    customerRegister,
    customerLogin,
    forgotPassword,
    resetPassword,
    uploadAvatar
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
    registerValidationRules, 
    loginValidationRules, 
    customerRegisterValidationRules,
    customerLoginValidationRules,
    validate 
} = require('../middleware/validation');
const upload = require('../middleware/upload');

router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);
router.post('/customer/register', customerRegisterValidationRules, validate, customerRegister);
router.post('/customer/login', customerLoginValidationRules, validate, customerLogin);
router.post('/customer/forgot-password', forgotPassword);
router.post('/customer/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.post('/avatar', protect, upload.single('image'), uploadAvatar);
router.post('/logout', protect, logout);

module.exports = router;
