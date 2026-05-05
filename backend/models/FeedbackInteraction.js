const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FeedbackInteraction = sequelize.define('FeedbackInteraction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        feedbackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'feedback_id'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null for guest interactions identified by IP if needed
            field: 'user_id'
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'ip_address'
        },
        type: {
            type: DataTypes.ENUM('like', 'dislike'),
            allowNull: false
        }
    }, {
        tableName: 'feedback_interactions',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['feedback_id', 'ip_address'],
                name: 'unique_feedback_ip'
            },
            {
                unique: true,
                fields: ['feedback_id', 'user_id'],
                where: {
                    user_id: {
                        [require('sequelize').Op.ne]: null
                    }
                },
                name: 'unique_feedback_user'
            }
        ]
    });

    return FeedbackInteraction;
};
