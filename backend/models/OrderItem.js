const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'order_id'
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'product_id'
        },
        productName: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'product_name'
        },
        productImage: {
            type: DataTypes.STRING(255),
            field: 'product_image'
        },
        size: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'order_items',
        indexes: [
            { fields: ['order_id'] },
            { fields: ['product_id'] }
        ]
    });

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order'
        });
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return OrderItem;
};
