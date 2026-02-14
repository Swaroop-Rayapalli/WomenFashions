const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'category_id'
        },
        subcategory: {
            type: DataTypes.STRING(100)
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discountPrice: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'discount_price'
        },
        inStock: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'in_stock'
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'stock_quantity'
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_featured'
        },
        badge: {
            type: DataTypes.STRING(50)
        },
        fabric: {
            type: DataTypes.STRING(100)
        },
        workType: {
            type: DataTypes.STRING(100),
            field: 'work_type'
        },
        occasion: {
            type: DataTypes.STRING(100)
        },
        sku: {
            type: DataTypes.STRING(50),
            unique: true
        }
    }, {
        tableName: 'products',
        indexes: [
            { fields: ['category_id'] },
            { fields: ['is_featured'] },
            { fields: ['in_stock'] },
            { fields: ['slug'] }
        ]
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category'
        });
        Product.hasMany(models.ProductImage, {
            foreignKey: 'productId',
            as: 'images',
            onDelete: 'CASCADE'
        });
        Product.hasMany(models.ProductSize, {
            foreignKey: 'productId',
            as: 'sizes',
            onDelete: 'CASCADE'
        });
    };

    return Product;
};
