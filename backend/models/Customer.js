const { DataTypes } = require('sequelize');

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
        }
    }, {
        tableName: 'customers',
        indexes: [
            { fields: ['phone'] },
            { fields: ['email'] }
        ]
    });

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
    };

    return Customer;
};
