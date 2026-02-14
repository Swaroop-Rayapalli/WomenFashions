const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderNumber: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            field: 'order_number'
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'customer_id'
        },
        customerName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'customer_name'
        },
        customerEmail: {
            type: DataTypes.STRING(100),
            field: 'customer_email'
        },
        customerPhone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            field: 'customer_phone'
        },
        shippingStreet: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'shipping_street'
        },
        shippingCity: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'shipping_city'
        },
        shippingState: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'shipping_state'
        },
        shippingPincode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: 'shipping_pincode'
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'total_amount'
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'completed', 'cancelled'),
            defaultValue: 'pending'
        },
        paymentMethod: {
            type: DataTypes.ENUM('whatsapp', 'cod', 'online', 'upi'),
            defaultValue: 'whatsapp',
            field: 'payment_method'
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'failed'),
            defaultValue: 'pending',
            field: 'payment_status'
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'orders',
        indexes: [
            { fields: ['customer_id'] },
            { fields: ['order_number'] },
            { fields: ['status'] },
            { fields: ['created_at'] }
        ]
    });

    Order.associate = (models) => {
        Order.belongsTo(models.Customer, {
            foreignKey: 'customerId',
            as: 'customer'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            as: 'items',
            onDelete: 'CASCADE'
        });
    };

    return Order;
};
