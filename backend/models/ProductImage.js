const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductImage = sequelize.define('ProductImage', {
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
        imageUrl: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'image_url'
        },
        altText: {
            type: DataTypes.STRING(200),
            field: 'alt_text'
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'display_order'
        },
        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_primary'
        }
    }, {
        tableName: 'product_images',
        indexes: [
            { fields: ['product_id'] },
            { fields: ['is_primary'] }
        ]
    });

    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return ProductImage;
};
