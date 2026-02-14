const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductSize = sequelize.define('ProductSize', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'product_id'
        },
        size: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'stock_quantity'
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_available'
        }
    }, {
        tableName: 'product_sizes',
        indexes: [
            { fields: ['product_id'] },
            { unique: true, fields: ['product_id', 'size'] }
        ],
        timestamps: false
    });

    ProductSize.associate = (models) => {
        ProductSize.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return ProductSize;
};
