const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.DB_CNN );

        console.log('Database connection success');
        
    } catch (error) {
        console.log(error);
        throw new Error('Database connection fail');
    }

}

module.exports = {
    dbConnection
}