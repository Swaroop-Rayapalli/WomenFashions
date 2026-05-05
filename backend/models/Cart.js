const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'customer_id'
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'product_id'
        },
        size: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    }, {
        tableName: 'cart_items',
        indexes: [
            { fields: ['customer_id'] },
            { unique: true, fields: ['customer_id', 'product_id', 'size'] }
        ]
    });

    Cart.associate = (models) => {
        Cart.belongsTo(models.Customer, {
            foreignKey: 'customerId',
            as: 'customer'
        });
        Cart.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return Cart;
};
