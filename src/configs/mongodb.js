const mongoose = require('mongoose');

const URI = process.env.MONGO_DB_URL + process.env.MONGO_DB_NAME;

mongoose.connect(URI);

const db = mongoose.connection

db.once('open', function(){

    console.log('Database connection established');
});

db.on('error', (error)=>{
    console.log("Database connecion failure. Description: ", error);
});

module.exports = db;