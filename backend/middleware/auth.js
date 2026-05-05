const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to find in User table (Admin/Staff)
        let user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        // If not found in User table, try Customer table
        if (!user) {
            const { Customer } = require('../models');
            user = await Customer.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            
            if (user) {
                // Customers don't have a role field in DB, but they are 'customer' role
                user = user.toJSON();
                user.role = 'customer';
            }
        }

        if (!user || (!user.isActive && user.isActive !== undefined)) {
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Optional user loading - doesn't block guests
exports.loadUser = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            const { Customer } = require('../models');
            user = await Customer.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });
            if (user) {
                user = user.toJSON();
                user.role = 'customer';
            }
        }

        if (user && (user.isActive || user.isActive === undefined)) {
            req.user = user;
        }
        next();
    } catch (error) {
        next(); // Proceed as guest if token is invalid
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Generate JWT token
exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
