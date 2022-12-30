module.exports = (sequelize, DataTypes) => {
    const Magazine = sequelize.define("Magazine", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        author_mail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING(1234),
            allowNull: true,
        },
        published_at: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Magazine;
}