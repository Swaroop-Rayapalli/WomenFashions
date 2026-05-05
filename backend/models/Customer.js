const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const Customer = sequelize.define('Customer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: true,
            validate: {
                len: [3, 50]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true // Changed from false to true to accommodate existing users in SQLite
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
        },
        avatarUrl: {
            type: DataTypes.STRING(255),
            field: 'avatar_url'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        tableName: 'customers',
        underscored: true,
        indexes: [
            { fields: ['phone'] },
            { fields: ['email'] },
            { fields: ['username'] }
        ],
        hooks: {
            beforeCreate: async (customer) => {
                if (customer.password) {
                    const salt = await bcrypt.genSalt(10);
                    customer.password = await bcrypt.hash(customer.password, salt);
                }
            },
            beforeUpdate: async (customer) => {
                if (customer.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    customer.password = await bcrypt.hash(customer.password, salt);
                }
            }
        }
    });

    // Instance method to compare password
    Customer.prototype.comparePassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    Customer.associate = (models) => {
        Customer.hasMany(models.CustomerAddress, {
            foreignKey: 'customerId',
            as: 'addresses',
            onDelete: 'CASCADE'
        });
        Customer.hasMany(models.Order, {
            foreignKey: 'customerId',
            as: 'orders'
        });
        Customer.hasMany(models.Cart, {
            foreignKey: 'customerId',
            as: 'cartItems'
        });
    };

    return Customer;
};
