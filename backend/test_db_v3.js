const { Sequelize } = require('sequelize');

const test = async () => {
    const url = "postgresql://postgres:Wfashions$$123@db.jlwsxtozciifmdfqrjvw.supabase.co:5432/postgres";
    
    const sequelize = new Sequelize(url, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: console.log
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

test();
