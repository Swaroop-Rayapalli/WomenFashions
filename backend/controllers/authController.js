const { User, Customer } = require('../models');
const { Op } = require('sequelize');
const { generateToken } = require('../middleware/auth');
const fs = require('fs');
const supabase = require('../utils/supabase');

// @desc    Register new admin user
// @route   POST /api/auth/register
// @access  Public (should be protected in production)
exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'staff'
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate token
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register new customer
// @route   POST /api/auth/customer/register
// @access  Public
exports.customerRegister = async (req, res, next) => {
    try {
        const { name, phone, password, username, email } = req.body;

        // Check if customer already exists (by phone or username)
        const existingCustomer = await Customer.findOne({
            where: {
                [Op.or]: [
                    { phone },
                    username ? { username } : null
                ].filter(Boolean)
            }
        });

        if (existingCustomer) {
            const field = existingCustomer.phone === phone ? 'phone number' : 'username';
            return res.status(400).json({
                success: false,
                message: `Customer already exists with this ${field}`
            });
        }

        // Create customer
        const customer = await Customer.create({
            name,
            phone,
            password,
            username: username || null,
            email: email || null
        });

        // Generate token
        const token = generateToken(customer.id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                username: customer.username,
                role: 'customer',
                avatarUrl: customer.avatarUrl
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login customer
// @route   POST /api/auth/customer/login
// @access  Public
exports.customerLogin = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        // Check for customer by phone or username
        const customer = await Customer.findOne({
            where: {
                [Op.or]: [
                    { phone: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if customer is active
        if (!customer.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive'
            });
        }

        // Check password
        const isMatch = await customer.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await customer.update({ lastLogin: new Date() });

        // Generate token
        const token = generateToken(customer.id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                username: customer.username,
                role: 'customer',
                avatarUrl: customer.avatarUrl
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Request password reset OTP
// @route   POST /api/auth/customer/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { phone, email } = req.body;

        let user;
        if (phone) {
            user = await Customer.findOne({ where: { phone } });
        } else if (email) {
            user = await User.findOne({ where: { email } });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: email ? 'No staff found with this email' : 'No user found with this phone number'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiry (10 minutes)
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        await user.update({
            resetPasswordOTP: otp,
            resetPasswordExpires: expires
        });

        // SEND OTP (In production, use an SMS gateway or Email service)
        console.log(`\n-----------------------------------`);
        console.log(`🔑 FORGOT PASSWORD OTP FOR ${phone || email}: ${otp}`);
        console.log(`-----------------------------------\n`);

        res.json({
            success: true,
            message: email ? 'OTP sent to your email' : 'OTP sent successfully to your phone number'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/customer/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { phone, email, otp, newPassword } = req.body;

        let user;
        if (phone) {
            user = await Customer.findOne({ 
                where: { 
                    phone,
                    resetPasswordOTP: otp,
                    resetPasswordExpires: { [Op.gt]: new Date() }
                } 
            });
        } else if (email) {
            user = await User.findOne({ 
                where: { 
                    email,
                    resetPasswordOTP: otp,
                    resetPasswordExpires: { [Op.gt]: new Date() }
                } 
            });
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Strength check (7+ chars, 1 int, 1 special)
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be 7+ characters with at least one number and one special character'
            });
        }

        // Update password and clear OTP
        await user.update({
            password: newPassword,
            resetPasswordOTP: null,
            resetPasswordExpires: null
        });

        res.json({
            success: true,
            message: 'Password reset successfully. You can now login.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { username, email, name, phone } = req.body;
        
        const isCustomer = req.user.role === 'customer';
        const model = isCustomer ? Customer : User;
        
        const user = await model.findByPk(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (name && isCustomer) updateData.name = name;

        await user.update(updateData);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const isCustomer = req.user.role === 'customer';
        const model = isCustomer ? Customer : User;
        
        const user = await model.findByPk(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Upload user avatar
// @route   POST /api/auth/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image file'
        });
    }

    try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `avatars/${req.user.id}-${Date.now()}${req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, fileContent, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update user in DB
        const isCustomer = req.user.role === 'customer';
        const model = isCustomer ? Customer : User;
        
        await model.update({ avatarUrl: publicUrl }, { where: { id: req.user.id } });

        // Delete local temporary file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatarUrl: publicUrl
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload avatar',
            error: error.message
        });
    }
};
