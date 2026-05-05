const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: extractedErrors,
    });
};

/**
 * Validation rules for contact form
 */
const contactValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required').matches(/^[0-9+\-\s]{10,15}$/).withMessage('Please enter a valid phone number'),
    body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Please enter a valid email address'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
];

/**
 * Validation rules for login
 */
const loginValidationRules = [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for registration
 */
const registerValidationRules = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'staff']).withMessage('Invalid role'),
];

/**
 * Validation rules for customer registration
 */
const customerRegisterValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('password')
        .isLength({ min: 7 })
        .withMessage('Password must be at least 7 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
    body('username').optional({ checkFalsy: true }).trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
];

/**
 * Validation rules for customer login
 */
const customerLoginValidationRules = [
    body('identifier').notEmpty().withMessage('Username or phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
    validate,
    contactValidationRules,
    loginValidationRules,
    registerValidationRules,
    customerRegisterValidationRules,
    customerLoginValidationRules,
};
