const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            validate: {
                len: [3, 50]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        avatarUrl: {
            type: DataTypes.STRING(255),
            field: 'avatar_url'
        },
        phone: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'staff'),
            defaultValue: 'staff'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active'
        },
        lastLogin: {
            type: DataTypes.DATE,
            field: 'last_login'
        },
        resetPasswordOTP: {
            type: DataTypes.STRING(10),
            field: 'reset_password_otp'
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            field: 'reset_password_expires'
        }
    }, {
        tableName: 'users',
        indexes: [
            { fields: ['email'] },
            { fields: ['username'] }
        ],
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    // Instance method to compare password
    User.prototype.comparePassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    return User;
};
