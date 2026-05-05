const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },
        images: {
            type: DataTypes.TEXT, // Using TEXT for maximum compatibility
            defaultValue: '[]',
            field: 'image_url',
            get() {
                const rawValue = this.getDataValue('images');
                if (!rawValue) return [];
                try {
                    // Handle cases where it might already be an object or a JSON string
                    return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
                } catch (e) {
                    // Handle legacy comma-separated strings or single URLs
                    if (typeof rawValue === 'string' && rawValue.includes(',')) {
                        return rawValue.split(',').map(s => s.trim());
                    }
                    return rawValue ? [rawValue] : [];
                }
            },
            set(value) {
                this.setDataValue('images', JSON.stringify(value || []));
            }
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_approved'
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        tableName: 'feedbacks',
        timestamps: true,
        underscored: true
    });

    return Feedback;
};
