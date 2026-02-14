const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        imageUrl: {
            type: DataTypes.STRING(255),
            field: 'image_url'
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'display_order'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active'
        }
    }, {
        tableName: 'categories',
        indexes: [
            { fields: ['slug'] },
            { fields: ['is_active'] }
        ]
    });

    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId',
            as: 'products'
        });
    };

    return Category;
};
