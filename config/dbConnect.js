const mongoose = require('mongoose');
const colors = require('colors')

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database Connected Successfully: ${connect.connection.host}, 
            ${connect.connection.name}`.bgGreen.white);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1); 
    }
};

module.exports = dbConnect;