const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CustomerAddress = sequelize.define('CustomerAddress', {
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
        addressType: {
            type: DataTypes.ENUM('home', 'work', 'other'),
            defaultValue: 'home',
            field: 'address_type'
        },
        street: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        pincode: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_default'
        }
    }, {
        tableName: 'customer_addresses',
        indexes: [
            { fields: ['customer_id'] },
            { fields: ['is_default'] }
        ]
    });

    CustomerAddress.associate = (models) => {
        CustomerAddress.belongsTo(models.Customer, {
            foreignKey: 'customerId',
            as: 'customer'
        });
    };

    return CustomerAddress;
};
